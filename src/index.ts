import './EngineAPI'
import { ScriptingHost } from 'decentraland-rpc/lib/host/ScriptingHost'
import { ScriptingTransport } from "decentraland-rpc/lib/common/json-rpc/types"
import { future } from 'fp-future'
import { CustomWebWorkerTransport } from './CustomWebWorkerTransport'
import Worker from 'web-worker'
import { EngineAPI } from './EngineAPI'
import * as fs from 'fs'
//const gamekitWorkerRaw = require("raw-loader!./artifacts/cli.scene.system.js");
//const gamekitWorkerBLOB = new Blob([gamekitWorkerRaw])
//const gamekitWorkerUrl = URL.createObjectURL(gamekitWorkerBLOB)

/*function CustomWebWorkerTransport(fork: ChildProcess): ScriptingTransport {
  const api: ScriptingTransport = {
    onMessage(handler) {
      fork.on("message", (message) => {
        console.log("[K]I", message.data)
        handler(message.data)
      })
    },
    sendMessage(message) {
      console.log("[K]O", message)
      fork.send(message)
    },
    close() {
        fork.kill()
    },
  }

  return api
}*/

class SceneWorker {
  protected engineAPI: EngineAPI | null = null
  private readonly system = future<ScriptingHost>()

  constructor() {
    const transport = SceneWorker.buildWebWorkerTransport()

    this.startSystem(transport)
      .then(($) => this.system.resolve($))
      .catch(($) => this.system.reject($))
  }

  private static buildWebWorkerTransport(): ScriptingTransport {
    const content = fs.readFileSync('./artifacts/scene.system.js')
    const worker = new Worker(content)

    return CustomWebWorkerTransport(worker)
  }

  private async startSystem(transport: ScriptingTransport) {
    const system = await ScriptingHost.fromTransport(transport)

    this.engineAPI = system.getAPIInstance('EngineAPI') as EngineAPI

    system.on('error', (e) => {
      // @ts-ignore
      console['log']('Unloading scene because of unhandled exception in the scene worker: ')

      // @ts-ignore
      console['error'](e)

      transport.close()
    })

    system.enable()

    return system
  }
}

async function run() {
  new SceneWorker()
}

run().catch((e) => {
  console.log("Error:", e)
})
import { future } from 'fp-future'
import Worker from 'web-worker'

import * as ScriptingHost from './old-rpc/host/ScriptingHost.js'
import type { ScriptingTransport } from "./old-rpc/common/json-rpc/types"

import { CustomWebWorkerTransport } from './CustomWebWorkerTransport.js'

import './apis/EngineAPI.js'
import './apis/DevTools.js'
import './apis/EnvironmentAPI'
import './apis/Permissions'

import * as fs from 'fs'
import { EngineAPI } from './apis/EngineAPI.js'

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
  private readonly system = future<ScriptingHost.ScriptingHost>()

  constructor() {
    const transport = SceneWorker.buildWebWorkerTransport()

    this.startSystem(transport)
      .then(($) => this.system.resolve($))
      .catch(($) => this.system.reject($))
  }

  private static buildWebWorkerTransport(): ScriptingTransport {
    debugger

    // const content = fs.readFileSync('./artifacts/test.js')
    // const worker = new Worker(`data:application/javascript,console.log(42)`);
    // console.log('running', { content: content.toString() })


    const worker = new Worker('./artifacts/scene.system.js')
    return CustomWebWorkerTransport(worker)
  }

  private async startSystem(transport: ScriptingTransport) {
    console.log({ "startSystem": true })
    const system = await ScriptingHost.ScriptingHost.fromTransport(transport)

    this.engineAPI = system.getAPIInstance('EngineAPI') as EngineAPI

    system.on('error', (e) => {
      // @ts-ignore
      console['log']('Unloading scene because of unhandled exception in the scene worker: ')

      debugger

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
  // setTimeout(() => {
  //   console.log('hi')
  // }, 2000)
}

run().catch((e) => {
  console.log("Error:", e)
})
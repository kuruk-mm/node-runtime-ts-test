import { ScriptingHost } from 'decentraland-rpc/lib/host'
import { ScriptingTransport } from "decentraland-rpc/lib/common/json-rpc/types"
import { future } from 'fp-future'
import { CustomWebWorkerTransport } from './CustomWebWorkerTransport'
import WrappedWorker from './WrappedWorker'
import { SHARE_ENV } from 'worker_threads'

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
  private readonly system = future<ScriptingHost>()

  constructor() {
    const transport = SceneWorker.buildWebWorkerTransport()

    this.startSystem(transport)
      .then(($) => this.system.resolve($))
      .catch(($) => this.system.reject($))
  }

  private static buildWebWorkerTransport(): ScriptingTransport {
    const worker = new WrappedWorker("./artifacts/cli.scene.system.js", {
      env: SHARE_ENV
    })

    return CustomWebWorkerTransport(worker)
  }

  private async startSystem(transport: ScriptingTransport) {
    const system = await ScriptingHost.fromTransport(transport)

    system.enable()

    return system
  }

  public print() {
    console.log('Hello world')
  }
}

async function run() {
  const sceneWorker = new SceneWorker()
  sceneWorker.print()

  /*const scene = JSON.parse(readFileSync('scene.json').toString())

  // resolve absolute path, it is necessary to resolve the sourceMaps
  const sceneJsonFile = resolve(scene.main)
  const sceneJsonContent = readFileSync(sceneJsonFile).toString()

  console.log(`> will load file: ${sceneJsonFile}`)

  const [runtime] = await runIvm(sceneJsonContent, sceneJsonFile, transport)

  console.log('> awaiting scene to run')

  await runtime*/
  console.log("End")
}

run().catch((e) => {
  console.log("Error:", e)
})
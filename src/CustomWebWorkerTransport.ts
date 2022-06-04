import { ScriptingTransport } from 'decentraland-rpc/lib/common/json-rpc/types'
import Worker from 'web-worker'

export function CustomWebWorkerTransport(worker: Worker): ScriptingTransport {
  const api: ScriptingTransport = {
    onConnect(handler) {
      worker.addEventListener('message', (message: MessageEvent) => {
        console.log('onConnect', message.data)
        handler()
      }, { once: true })
    },
    onError(handler) {
      worker.addEventListener('error', (err: ErrorEvent) => {
        // `err.error['isSceneError'] = true` will flag the error as a scene worker error enabling error
        // filtering in DCLUnityLoader.js, unhandled errors (like WebSocket messages failing)
        // are not handled by the update loop and therefore those break the whole worker
        if (err.error) {
          err.error['isSceneError'] = true
          handler(err.error)
        } else if (err.message) {
          ;(err as any)['isSceneError'] = true
          handler(err as any)
        }
      })
    },
    onMessage(handler) {
      worker.addEventListener('message', (message: MessageEvent) => {
        console.log('[K]I', message.data)
        handler(message.data)
      })
    },
    sendMessage(message) {
      console.log('[K]O', message)
      worker.postMessage(message)
    },
    close() {
      if ('terminate' in worker) {
        ;(worker as any).terminate()
      } else if ('close' in worker) {
        ;(worker as any).close()
      }
    }
  }

  return api
}

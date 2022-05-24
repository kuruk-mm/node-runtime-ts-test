import { ScriptingTransport } from 'decentraland-rpc/lib/common/json-rpc/types'
import WrappedWorker from './WrappedWorker'

export function CustomWebWorkerTransport(worker: WrappedWorker): ScriptingTransport {
  const api: ScriptingTransport = {
    onConnect(handler) {
      worker.once('message', () => handler())
    },
    onError(handler) {
      worker.addListener('error', (err: ErrorEvent) => {
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
      worker.addListener('message', (message: MessageEvent) => {
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

import { Worker } from 'worker_threads'

export default class WrappedWorker extends Worker {
    addEventListener(event: any, listener: () => void): this { return this.addListener(event, listener) }
}
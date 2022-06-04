import { registerAPI } from "decentraland-rpc/lib/host/ScriptingHost"
import { APIOptions, exposeMethod } from "decentraland-rpc/lib/host/API"
import { ExposableAPI } from "./ExposableAPI"

export interface IEngineAPI {
  /**
   * Subscribes to events dispatched by the EngineAPI
   * Use it to listen to events from the scene (like `click`)
   * @param event
   */
  subscribe(event: string): Promise<void>

  /**
   * Removes a subscription to an event
   * @param event
   */
  unsubscribe(event: string): Promise<void>

  /**
   * Send batch
   * @param batch
   */
  sendBatch(actions: any[]): Promise<void>

  /**
   * Start signal, sent after everything was initialized
   */
  startSignal(): Promise<void>

  /** Event handler for subscription events */
  onSubscribedEvent(fn: any): void
}

@registerAPI("EngineAPI")
export class EngineAPI extends ExposableAPI implements IEngineAPI {
  didStart: boolean = false

  // this dictionary contains the list of subscriptions.
  // the boolean value indicates if the client is actively
  // listenting to that event
  subscribedEvents: { [event: string]: boolean } = {}

  constructor(options: APIOptions) {
    super(options)
  }
  onSubscribedEvent(fn: any): void {
    console.log("EngineAPI subscribe: ", event)
  }

  @exposeMethod
  async subscribe(event: any) {
    console.log("EngineAPI subscribe: ", event)
  }

  @exposeMethod
  async unsubscribe(event: string) {
    console.log("EngineAPI unsubscribe: ", event)
  }

  @exposeMethod
  async sendBatch(actions: any[]): Promise<void> {
    console.log("SendBatch: ", actions)
  }

  @exposeMethod
  async startSignal(): Promise<void> {
    console.log("EngineAPI startSignal: ")
  }
}

import { API, exposeMethod, getExposedMethods } from "../old-rpc/host/API.js"

export class ExposableAPI extends API {
  @exposeMethod
  async _getExposedMethods(): Promise<string[]> {
    return Array.from(getExposedMethods(this) as Set<string>)
  }
}
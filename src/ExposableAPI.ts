import { API, exposeMethod, getExposedMethods } from "decentraland-rpc/lib/host/API"

export class ExposableAPI extends API {
  @exposeMethod
  async _getExposedMethods(): Promise<string[]> {
    return Array.from(getExposedMethods(this) as Set<string>)
  }
}
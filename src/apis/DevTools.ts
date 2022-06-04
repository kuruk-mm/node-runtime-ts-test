import { registerAPI, exposeMethod, API } from './../old-rpc/host'


@registerAPI('DevTools')
export class DevTools extends API {

    @exposeMethod
    async event<T>(type: T, params: any): Promise<void> {
        console.log("hola")
    }
}

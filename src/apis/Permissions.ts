import { registerAPI, exposeMethod } from './../old-rpc/host'
import { ExposableAPI } from './ExposableAPI'

@registerAPI('Permissions')
export class Permissions extends ExposableAPI {
    /**
     * Returns if it has a specific permission
     */
    @exposeMethod
    async hasPermission(test: string): Promise<boolean> {
        return true
    }

    /**
     * Returns if it has many permissions
     */
    @exposeMethod
    async hasManyPermissions(test: string[]): Promise<boolean> {
        return true
    }
}

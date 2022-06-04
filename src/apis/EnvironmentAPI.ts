import { registerAPI, exposeMethod } from './../old-rpc/host'
import { ExposableAPI } from './ExposableAPI'

@registerAPI('EnvironmentAPI')
export class EnvironmentAPI extends ExposableAPI {

    /**
     * Returns the coordinates and the definition of a parcel
     */
    @exposeMethod
    async getBootstrapData(): Promise<any> {
        return {} as any
    }

    /**
     * Returns whether the scene is running in preview mode or not
     */
    @exposeMethod
    async isPreviewMode(): Promise<boolean> {
        return true
    }

    /**
     * Returns what platform is running the scene
     */
    @exposeMethod
    async getPlatform(): Promise<string> {
        return ''
    }

    /**
     * Returns if the feature flag unsafe-request is on
     */
    @exposeMethod
    async areUnsafeRequestAllowed(): Promise<boolean> {
        return false
    }

    /**
     * Returns the current connected realm
     */
    @exposeMethod
    async getCurrentRealm(): Promise<any | undefined> {
        return {} as any
    }

    /**
     * Returns explorer configuration and environment information
     */
    @exposeMethod
    async getExplorerConfiguration(): Promise<any> {
        return {
            clientUri: '',
            configurations: {
                questsServerUrl: ''
            }
        }
    }

    /**
     * Returns Decentraland's time
     */
    @exposeMethod
    async getDecentralandTime(): Promise<{ seconds: number }> {

        return { seconds: 1 }
    }
}

import * as fs from "fs"
import { customEval, getES5Context } from "./sandbox"

const array: any[] = []

const dcl: any = {
  DEBUG: true,
  log(...args: any[]) {
    console.log(...args)
  },

  openExternalUrl(url: string) {

  },

  openNFTDialog(assetContractAddress: string, tokenId: string, comment: string | null) {

  },

  addEntity(entityId: string) {
    console.log("entityId: ", entityId)
  },

  removeEntity(entityId: string) {
    console.log("removeEntity: ", entityId)
  },

  /** update tick */
  onUpdate(cb: (deltaTime: number) => void): void {
    console.log('onUpdate')
    array.push(cb)
  },

  /** event from the engine */
  onEvent(cb: (event: any) => void): void {

  },

  /** called after adding a component to the entity or after updating a component */
  updateEntityComponent(entityId: string, componentName: string, classId: number, json: string): void {

  },

  /** called after adding a DisposableComponent to the entity */
  attachEntityComponent(entityId: string, componentName: string, id: string): void {
    console.log(`attachEntityComponent ${entityId} ${componentName}`)
  },

  /** call after removing a component from the entity */
  removeEntityComponent(entityId: string, componentName: string): void {
    console.log(`removeEntityComponent ${entityId} ${componentName}`)
  },

  /** set a new parent for the entity */
  setParent(entityId: string, parentId: string): void {

  },

  /** queries for a specific system with a certain query configuration */
  query(queryType: any, payload: any) {

  },

  /** subscribe to specific events, events will be handled by the onEvent function */
  subscribe(eventName: string): void {

  },

  /** unsubscribe to specific event */
  unsubscribe(eventName: string): void {

  },

  componentCreated(id: string, componentName: string, classId: number) {

  },

  componentDisposed(id: string) {

  },

  componentUpdated(id: string, json: string) {
    
  },

  loadModule: async (_moduleName: string) => {
    console.log("_moduleName: ", _moduleName)
    return Promise.resolve()
  },
  callRpc: async (rpcHandle: string, methodName: string, args: any[]) => {

  },
  onStart(cb: Function) {
  },
  error(message: any, data: any) {
    console.log(message, data)
  },
}

const main = async () => {
  const content = fs.readFileSync("./bin/game.js")
  const source = content.toString()
  console.log('Start eval')

  await customEval(source, getES5Context({dcl}))

  const update = () => {
    for(var item of array) {
      //console.log(`item of update ${item}`)
      item(1/30)
    }
  }
  for(let i = 0; i < 100; ++i) {
    update()
  }

  console.log(array.length)

  console.log('End eval')
}

main().then(() => {
  console.log("Done!")
}).catch((e: any) => {
  console.log(`Error: ${e}`)
})
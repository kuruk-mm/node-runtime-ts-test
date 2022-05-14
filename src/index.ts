import * as fs from "fs"
import { customEval, getES5Context } from "./sandbox"

type UpdateCallback = (deltaTime: number) => void
const updateCallbacks: UpdateCallback[] = []

const counters = new Map<string, number>()

const addCounter = (counterName: string) => {
  const value = counters.get(counterName)
  if (value) {
    counters.set(counterName, value + 1)
  } else {
    counters.set(counterName, 1)
  }
}

const printCounters = () => {
  for (let [key, value] of counters) {
    console.log(key, value);
}
}

const dcl: DecentralandInterface = {
  DEBUG: true,
  log(...args: any[]) {
    console.log(...args)
  },

  openExternalUrl(url: string) {
    addCounter('openExternalUrl')
  },

  openNFTDialog(assetContractAddress: string, tokenId: string, comment: string | null) {
    addCounter('openNFTDialog')
  },

  addEntity(entityId: string) {
    addCounter('addEntity')
  },

  removeEntity(entityId: string) {
    addCounter('removeEntity')
  },

  /** update tick */
  onUpdate(cb: UpdateCallback): void {
    console.log('onUpdate')
    updateCallbacks.push(cb)
    addCounter('onUpdate')
  },

  /** event from the engine */
  onEvent(cb: (event: any) => void): void {
    addCounter('onEvent')
  },

  /** called after adding a component to the entity or after updating a component */
  updateEntityComponent(entityId: string, componentName: string, classId: number, json: string): void {
    addCounter('updateEntityComponent')
  },

  /** called after adding a DisposableComponent to the entity */
  attachEntityComponent(entityId: string, componentName: string, id: string): void {
    addCounter('attachEntityComponent')
  },

  /** call after removing a component from the entity */
  removeEntityComponent(entityId: string, componentName: string): void {
    addCounter('removeEntityComponent')
  },

  /** set a new parent for the entity */
  setParent(entityId: string, parentId: string): void {
    addCounter('setParent')
  },

  /** queries for a specific system with a certain query configuration */
  query(queryType: any, payload: any) {
    addCounter('query')
  },

  /** subscribe to specific events, events will be handled by the onEvent function */
  subscribe(eventName: string): void {
    addCounter('subscribe')
  },

  /** unsubscribe to specific event */
  unsubscribe(eventName: string): void {
    addCounter('unsubscribe')
  },

  componentCreated(id: string, componentName: string, classId: number) {
    addCounter('componentCreated')
  },

  componentDisposed(id: string) {
    addCounter('componentDisposed')
  },

  componentUpdated(id: string, json: string) {
    addCounter('componentUpdated')
  },

  loadModule: async (_moduleName: string): Promise<ModuleDescriptor> => {
    addCounter('loadModule')
    return Promise.resolve({
      rpcHandle: 'foo',
      methods: [{name: 'bar'}]
    })
  },
  callRpc: async (rpcHandle: string, methodName: string, args: any[]) => {
    addCounter('callRpc')
    return Promise.resolve()
  },
  onStart(cb: Function) {
    addCounter('onStart')
  },
  error(message: any, data: any) {
    addCounter('error')
  }
}

const main = async () => {
  const content = fs.readFileSync("./bin/game.js")
  const source = content.toString()

  performance.mark('custom-eval')
  await customEval(source, getES5Context({dcl}))
  performance.mark('end-custom-eval')

  console.log('Counters after eval')
  printCounters()

  const update = () => {
    for(const update of updateCallbacks) {
      update(1.0/30.0)
    }
  }

  performance.mark('update')
  for(let i = 0; i < 5000; ++i) {
    update()
  }
  performance.mark('end-update')

  console.log('\nCounters after updates')
  printCounters()

  const CustomEval = performance.measure(
    'Custom Eval',
    'custom-eval',
    'end-custom-eval'
  )

  console.log(CustomEval)

  const EngineUpdate = performance.measure(
    'Engine Updates',
    'update',
    'end-update'
  )

  console.log(EngineUpdate)
}

main().catch((e: any) => {
  console.log(`Error: ${e}`)
})
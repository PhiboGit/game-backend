import { CraftingMsg } from "../jsonValidators/messageValidator/validateCraftingMsg.js"
import { GatheringMsg } from "../jsonValidators/messageValidator/validateGatheringMsg.js"

type ActionObject = {
  counter: number
  characterName: string
  actionMsg: GatheringMsg | CraftingMsg
}

class ActionManager {
  private MAX_QUEUE_LENGTH = 4 

  private actionQueue: Map<string, ActionObject[]> = new Map()

  private activeActionTimeoutCancellers: Map<string, () => void> = new Map()

  private cancelActiveAction(characterName: string) {
    const cancel = this.activeActionTimeoutCancellers.get(characterName)
    if (cancel) {
      cancel()
      this.activeActionTimeoutCancellers.delete(characterName)
      console.log('%s: Canceled active action', characterName)
    }
  }
  
  cancelAction(characterName: string, index: number) {
    if (index < 0) {
      this.cancelActiveAction(characterName)
      return
    }
    
    if(!this.actionQueue.has(characterName)) {
      console.log('%s: Action queue does not exist', characterName)
      return
    }
    if (index >= this.actionQueue.get(characterName)!.length) {
      console.log('%s: Invalid index', characterName)
      return
    }

    this.actionQueue.get(characterName)!.splice(index, 1)
    console.log('%s: Removed action at index %d', characterName, index)
  }

  addAction(characterName: string, actionMsg: GatheringMsg | CraftingMsg) {
    const action: ActionObject = {
      characterName,
      counter: 0,
      actionMsg
    }
    this.enqueueAction(characterName, action)
  }

  private enqueueAction(characterName: string, action: ActionObject) {
    if (!this.actionQueue.has(characterName)) {
      this.actionQueue.set(characterName, [])
    }
    if (this.actionQueue.get(characterName)!.length >= this.MAX_QUEUE_LENGTH) {
      console.log('%s: Queue is full!', characterName)
		  return
    }
    this.actionQueue.get(characterName)!.push(action)
    console.log('%s: Added to queue. Queue length:', characterName, this.actionQueue.get(characterName)!.length)

    this.processQueue(characterName)
  }

  private dequeueAction(characterName: string): ActionObject | undefined {

    if(!this.actionQueue.get(characterName)) {
      console.log('%s: No actions in queue', characterName)
      return undefined
    }

    const action = this.actionQueue.get(characterName)!.shift()
    // clean up
    if(!action || this.actionQueue.get(characterName)!.length === 0) {
      this.actionQueue.delete(characterName)
    }
    
    return action
  }
  
  private processQueue(characterName: string) {
    if(this.activeActionTimeoutCancellers.has(characterName)) {
      console.log('%s: Action already in progress', characterName)
      return
    }
    
    const action = this.dequeueAction(characterName)
    if(!action) {
      return
    }
    console.log('%s: Removed from queue to process. Queue length:', characterName, this.actionQueue.get(characterName)?.length || 0)
    
    console.log('%s: Processing queue...', characterName)
    this.startSquentialAction(action)
      .then(() => {
        console.log('%s: Squential action done', characterName)
        this.activeActionTimeoutCancellers.delete(characterName)

        // recursive call to process the queue / next action in queue
        this.processQueue(characterName)
      })
      .catch((error) => {
        console.log(error)
      })

  }

  private startSquentialAction(action: ActionObject): Promise<void> {
    return new Promise(async (resolve) => {
      console.log('%s: Squential action started', action.characterName)

      while( action.actionMsg.iterations > 0 || !action.actionMsg.limit) {
        // start the action
        switch (action.actionMsg.task) {
          case 'gathering':
            //TODO: validate action
            //TODO: start action
            await new Promise<void>((res) => {
              const timeout = setTimeout(() => {
                console.log('%s: Action timed out', action.characterName)
                res()
              }, 5000)
              this.activeActionTimeoutCancellers.set(action.characterName, () => {
                clearTimeout(timeout)
                res()
              })
            })
            break
          case 'crafting':
            console.log(action.actionMsg.args.recipe)
            break
          default:
            console.error('%s: unknown task. should not happen!', action.characterName, action)
            resolve()
            return
        }
        action.counter++
        action.actionMsg.iterations--     
      }
      resolve()
    })
  }
}

export const actionManager = new ActionManager()

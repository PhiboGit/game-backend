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
    }
  }
  
  cancelAction(characterName: string, index: number) {
    if (index < 0) {
      this.cancelActiveAction(characterName)
      return
    }
    
    if(!this.actionQueue.has(characterName)) {
      return
    }
    if (index >= this.actionQueue.get(characterName)!.length) {
      return
    }

    this.actionQueue.get(characterName)!.splice(index, 1)
  }

  addAction(characterName: string, actionMsg: GatheringMsg | CraftingMsg) {
    const action: ActionObject = {
      characterName,
      counter: 0,
      actionMsg
    }
    this.enqueueAction(characterName, action)
    console.log('Added action')
  }

  private enqueueAction(characterName: string, action: ActionObject) {
    if (!this.actionQueue.has(characterName)) {
      this.actionQueue.set(characterName, [])
    }
    if (this.actionQueue.get(characterName)!.length >= this.MAX_QUEUE_LENGTH) {
      console.log('Queue is full!')
		  return
    }
    this.actionQueue.get(characterName)!.push(action)

    this.processQueue(characterName)
  }

  private dequeueAction(characterName: string): ActionObject | undefined {

    if(!this.actionQueue.get(characterName)) {
      console.log('No actions in queue')
      return undefined
    }

    const action = this.actionQueue.get(characterName)!.shift()
    if(!action) {
      console.log('No actions in queue')
      this.actionQueue.delete(characterName)
      return undefined
    }
    if( this.actionQueue.get(characterName)!.length === 0) {
      console.log('Queue is now empty!')
      this.actionQueue.delete(characterName)
    }

    return action
  }

  private processQueue(characterName: string) {
    console.log('Processing queue...')
    if(this.activeActionTimeoutCancellers.has(characterName)) {
      console.log('Action already in progress')
      return
    }

    const action = this.dequeueAction(characterName)
    if(!action) {
      return
    }

    this.startSquentialAction(action)
      .then(() => {
        console.log('Squential action done')
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
      console.log('Squential action started')

      while( action.actionMsg.iterations > 0 || !action.actionMsg.limit) {
        // start the action
        switch (action.actionMsg.task) {
          case 'gathering':
            //TODO: validate action
            //TODO: start action
            await new Promise<void>((res) => {
              const timeout = setTimeout(() => {
                console.log('Action timed out')
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
            console.error('unknown task. should not happen!', action)
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

import ITaskAction from "./ITaskAction.js";
import GatheringAction from "./gatheringAction/gatheringAction.js";
import { ActionMsg, ActionObject } from "./types.js"

/**
 * Manages the task actions for all character.
 * 
 * Executes actions in order of the queue and 
 * repeates the action depending on the limit and iterations properties.
 * 
 * 
 * Has only two public functions:
 * - addAction: adds an action to the queue
 * - cancelAction: removes an action from the queue 
 */
class ActionManager {
  private taskMap: Map<string, ITaskAction> = new Map([
    ["gathering", new GatheringAction()],
  ]);

  private MAX_QUEUE_LENGTH = 4 

  private actionQueue: Map<string, ActionObject[]> = new Map()

  private activeActionTimeoutCancellers: Map<string, () => void> = new Map()

  private isActionActive(characterName: string): boolean {
    return this.activeActionTimeoutCancellers.has(characterName)
  }

  // Create a callback to contain the logic here.
  // registers the callback in the activeActionTimeoutCancellers map
  // the action should then define the callback what should happen when a cancel is invoked.
  // for example: the action should then clearTimeout to interrupt the action.
  private createCancelCallback(characterName: string): (callback: () => void) => void {
    const cancel = (callback: () => void) => {
      callback();
    };
    
    // if the callback is not implemented yet
    this.activeActionTimeoutCancellers.set(characterName, () => cancel(() => {throw new Error('Dev did not implement a callback for cancel!')} ));
    return (callback: () => void) => {
      this.activeActionTimeoutCancellers.set(characterName, () => cancel(callback));
    };
  }
  
  private cancelActiveAction(characterName: string) {
    const cancel = this.activeActionTimeoutCancellers.get(characterName)
    if (cancel) {
      cancel()
      console.log('%s: Callback to cancel was called', characterName)
    } else {
      console.log('%s: No active action to cancel', characterName)
    }
    this.activeActionTimeoutCancellers.delete(characterName)
  }
  
  // public functions to cancel an action
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

  // public functions to add an action
  addAction(characterName: string, actionMsg: ActionMsg) {
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
    if(this.isActionActive(characterName)) {
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
        this.cancelActiveAction(characterName)

        // recursive call to process the queue / next action in queue
        this.processQueue(characterName)
      })
      .catch((error) => {
        console.log('%s: Squential action interrupted:', characterName, error)
        this.cancelActiveAction(characterName)
      })

  }

  private startSquentialAction(action: ActionObject): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const taskAction = this.taskMap.get(action.actionMsg.task)
      if(!taskAction) {
        console.error('%s: unknown task. should not happen!', action.characterName, action)
        return reject('unknown task. should not happen!')
      }

      console.log('%s: Squential action started', action.characterName)
      while(action.actionMsg.iterations > 0 || !action.actionMsg.limit) {
        try {
          console.log('%s: Counter: %d %s Iterations left: %d', action.characterName, action.counter, action.actionMsg.limit, action.actionMsg.iterations)
          await taskAction.validateAction(action.characterName, action.actionMsg)

          const  cancelCallback = this.createCancelCallback(action.characterName) 
          await taskAction.startAction(action.characterName, action.actionMsg, cancelCallback )
          action.counter++
          action.actionMsg.iterations--
        } catch(error) {
          return reject(error)
        }     
      }
      resolve()
    })
  }
}

export const actionManager = new ActionManager()

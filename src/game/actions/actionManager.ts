import { updateCharacter } from "../services/characterService.js";
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
      updateCharacter({ characterName, activeAction: null })
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
    updateCharacter({ characterName, actionQueue: this.actionQueue.get(characterName)! })
  }

  // public functions to add an action
  addAction(characterName: string, actionMsg: ActionMsg) {
    const action: ActionObject = {
      counter: 0,
      actionTime: null,
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
    updateCharacter({ characterName, actionQueue: this.actionQueue.get(characterName)! })

    this.processQueue(characterName)
  }

  private dequeueAction(characterName: string): ActionObject | undefined {

    if(!this.actionQueue.get(characterName)) {
      console.log('%s: No actions in queue', characterName)
      return undefined
    }

    const action = this.actionQueue.get(characterName)!.shift()
    updateCharacter({ characterName, actionQueue: this.actionQueue.get(characterName)! })
    // clean up
    if(!action || this.actionQueue.get(characterName)!.length === 0) {
      this.actionQueue.delete(characterName)
    }
    
    return action
  }
  
  /**
   * Starts a process that will manage the queue of actions for this specific character.
   * 
   * Manages the queue of actions and executes them in order of the Queue.
   */
  private async processQueue(characterName: string) {
    while(this.actionQueue.get(characterName)?.length) {
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
      try {
        await this.startSquentialAction(characterName , action);
        console.log('%s: Squential action done', characterName);
      } catch (error) {
        console.log('%s: Squential action interrupted:', characterName, error);
      } finally {
        // Clear active action to be able to start next one.
        this.cancelActiveAction(characterName);
      }
    }
  }

  /**
   * Start a sequential action. Performs the same action repeatedly.
   * 
   * The action will be executed in a loop until it is done (limit/ interations reached) or it is interrupted.
   * 
   * @param actionObject the action to execute
   * @returns A promise that resolves when the action is done. Or rejects if the action fails.
   */
  private startSquentialAction(characterName: string, actionObject: ActionObject): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const taskAction = this.taskMap.get(actionObject.actionMsg.task)
      if(!taskAction) {
        console.error('%s: unknown task. should not happen!', characterName, actionObject)
        return reject('unknown task. should not happen!')
      }

      console.log('%s: Squential action started', characterName)
      while(actionObject.actionMsg.iterations > 0 || !actionObject.actionMsg.limit) {
        try {
          console.log('%s: Counter: %d %s Iterations left: %d', characterName, actionObject.counter, actionObject.actionMsg.limit, actionObject.actionMsg.iterations)
          await taskAction.validateAction(characterName, actionObject)

          updateCharacter({ characterName, activeAction: actionObject })

          const  cancelCallback = this.createCancelCallback(characterName) 
          await taskAction.startAction(characterName, actionObject, cancelCallback )
          actionObject.counter++
          actionObject.actionMsg.iterations--
        } catch(error) {
          // Any error will reject the promise. 
          // Can be an interrupted action by cancel, or an invalid action by resource limit.
          // The action cannnot be performed if the requirements are not met.
          return reject(error)
        }     
      }
      resolve()
    })
  }
}

export const actionManager = new ActionManager()

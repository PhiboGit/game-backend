import { Schema, model } from "mongoose"
import { ResourceId } from "../../jsonValidators/dataValidator/validateResourceData.js"

export type ResourceBuyOrder = {
  characterName: string
  resource: ResourceId

  price: number
  amount: number
  unitsBought: number

  unitsToCollect: number
  goldToCollect: number

  status: 'created' | 'registered' | 'fulfilled' | 'canceled'
}

const resourceBuyOrderSchema = new Schema<ResourceBuyOrder>({
  characterName: {
    type: String,
    required: true
  },
  resource: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  unitsBought: {
    type: Number,
    required: true
  },
  unitsToCollect: {
    type: Number,
    required: true
  },
  goldToCollect: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  }
}, { collection: 'resource_buy_orders' })

// Create the Mongoose model
const ResourceBuyOrderModel = model<ResourceBuyOrder>('ResourceBuyOrder', resourceBuyOrderSchema);

export default ResourceBuyOrderModel;
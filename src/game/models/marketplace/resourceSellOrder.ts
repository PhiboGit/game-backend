import { Schema, model } from "mongoose"
import { ResourceId } from "../../jsonValidators/dataValidator/validateResourceData.js"

export type ResourceSellOrder = {
  characterName: string
  resource: ResourceId

  price: number
  amount: number
  unitsSold: number

  unitsToCollect: number
  goldToCollect: number

  status: 'created' | 'registered' | 'fulfilled' | 'canceled'  
}

const resourceSellOrderSchema = new Schema<ResourceSellOrder>({
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
  unitsSold: {
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
}, { collection: 'resource_sell_orders' })

// Create the Mongoose model
const ResourceSellOrderModel = model<ResourceSellOrder>('ResourceSellOrder', resourceSellOrderSchema);

export default ResourceSellOrderModel;
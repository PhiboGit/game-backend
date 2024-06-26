import mongoose, { Schema } from "mongoose"
import { ResourceId } from "../../jsonValidators/dataValidator/validateResourceData.js"
import { ResourceBuyOrder } from "./resourceBuyOrder.js"
import { ResourceSellOrder } from "./resourceSellOrder.js"

type ResourceOrderbook = {
  resource: ResourceId

  orderbookBuying: {
    price: number
    totalUnits: number
    orders: ResourceBuyOrder[]
  }[]

  orderbookSelling: {
    price: number
    totalUnits: number
    orders: ResourceSellOrder[]
  }[]
}

const resourceOrderbookSchema = new Schema<ResourceOrderbook>({
  resource: {
    type: String,
    required: true
  },

  orderbookBuying: [{
    _id: false,
    price: {
      type: Number,
      required: true
    },
    totalUnits: {
      type: Number,
      required: true
    },
    orders: [{
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ResourceBuyOrder',
      }
    }]
  }],

  orderbookSelling: [{
    _id: false,
    price: {
      type: Number,
      required: true
    },
    totalUnits: {
      type: Number,
      required: true
    },
    orders: [{
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ResourceSellOrder',
      }
    }]
  }],
}, { collection: 'resource_orderbooks' })

const ResourceOrderbookModel = mongoose.model<ResourceOrderbook>("ResourceOrderbook", resourceOrderbookSchema)

export default ResourceOrderbookModel
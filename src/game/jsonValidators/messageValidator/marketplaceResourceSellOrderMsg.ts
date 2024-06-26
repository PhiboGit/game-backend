import { JTDSchemaType } from "ajv/dist/jtd.js"
import { ResourceId, resourceIds } from "../dataValidator/validateResourceData.js"
import { ajv } from "../ajvInstance.js"

export type MarketplaceResourceSellOrderMsg = {
  type: 'marketplace_resource_sellOrder'

  resource: ResourceId
  amount: number
  price: number
} 

const schemaResourceSellOrder: JTDSchemaType<MarketplaceResourceSellOrderMsg> = {
  properties: {
    type: {enum: ['marketplace_resource_sellOrder']},
    resource: {enum: [...resourceIds]},
    amount: {type: 'int32'},
    price: {type: 'int32'},
  }
}

const validate = ajv.compile<MarketplaceResourceSellOrderMsg>(schemaResourceSellOrder)

export function validateMarketplaceResourceSellOrderMsg(data: any): MarketplaceResourceSellOrderMsg | null{
  if(validate(data)) {
    console.log("MarketplaceResourceSellOrderMsg is valid")
    return data as MarketplaceResourceSellOrderMsg
  }else{
    console.log("MarketplaceResourceSellOrderMsg not valid: ", validate.errors);
    return null
  }
}
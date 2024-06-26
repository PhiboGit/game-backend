import mongoose from "mongoose";
import { MarketplaceResourceSellOrderMsg } from "../../jsonValidators/messageValidator/marketplaceResourceSellOrderMsg.js";
import ResourceSellOrderModel from "../../models/marketplace/resourceSellOrder.js";



 class ResourceMarketplaceManager {
  
  
  async createSellOrder(characterName: string, sellOrderMsg: MarketplaceResourceSellOrderMsg) {
    
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
  
      const sellOrder = await ResourceSellOrderModel.create({
        characterName: characterName,
        resource: sellOrderMsg.resource,
        price: sellOrderMsg.price,
        amount: sellOrderMsg.amount,
        unitsSold: 0,
        unitsToCollect: 0,
        goldToCollect: 0,
        status: 'created'
      }, { session: session, new: true })

      // Check if the order was created successfully
      if (!sellOrder ) {
        console.log("Error: Order creation failed.");
        throw new Error("Order creation failed.");
      }

      


      
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Transaction aborted");
      console.error("Error posting order:", error);
    }

  }
}

export default new ResourceMarketplaceManager()
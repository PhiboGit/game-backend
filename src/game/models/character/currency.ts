import { Schema } from "mongoose";



export interface Currency {
  gold: number;
}


// Define Currency schema
export const currencySchema = new Schema<Currency>({
  gold: { type: Number, default: 0 },
}, {_id: false});
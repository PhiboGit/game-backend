import { Schema } from "mongoose";



export interface Currency {
  gold: number;
}

export type CurrencyId = keyof Currency


// Define Currency schema
export const currencySchema = new Schema<Currency>({
  gold: { type: Number, default: 0 },
}, {_id: false});
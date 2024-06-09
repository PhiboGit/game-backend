import mongoose, { Schema, Types } from "mongoose";

export const professionIds = ["woodcutting", "mining", "harvesting", "weaving", "smelting", "woodworking", "smith", "engineer", "artificer"] as const
export type ProfessionId = typeof professionIds[number]
export const equipmentSlots = ["tool", "head", "chest", "legs", "feet", "hands"] as const
export type EquipmentSlot = typeof equipmentSlots[number]
export type Equipment = Record<EquipmentSlot, Types.ObjectId | null>
export type Profession = {
  exp: number;
  equipment: Equipment;
}

export type Professions = Record<ProfessionId, Profession>;

// Define Equipment schema
export const equipmentSchema = new Schema<Equipment>({
  tool: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
  head: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
  chest: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
  legs: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
  feet: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
  hands: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
}, {_id: false});

// Define Profession schema
export const professionSchema = new Schema<Profession>({
  exp: { type: Number, default: 0 },
  equipment: { type: equipmentSchema, default: { tool: null, head: null, chest: null, legs: null, feet: null, hands: null } },
}, {_id: false});
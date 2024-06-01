import mongoose, { Schema, model, Types } from 'mongoose';
import { Currency, currencySchema } from './currency.js';
import { Profession, professionSchema } from './profession.js';
import { Resources, resourcesSchema } from './resources.js';


export interface Character {
  _id: Types.ObjectId;
  characterName: string;
  exp: number;
  currency: Currency;
  items: Types.ObjectId[];
  activeAction: object | null;
  actionQueue: object[];
  professions: {
    woodcutting: Profession;
    mining: Profession;
    harvesting: Profession;
  };
  resources: Resources;
}

const characterSchema = new Schema<Character>({
  characterName: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  exp: { 
    type: Number,
    default: 0,
  },
  currency: {
    type: currencySchema,
    default: { gold: 0 },
  },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  activeAction: { type: Object, default: null },
  actionQueue: { type: [Object], default: [] },
  professions: {
    woodcutting: { type: professionSchema, default: { exp: 0, equipment: {} } },
    mining: { type: professionSchema, default: { exp: 0, equipment: {} } },
    harvesting: { type: professionSchema, default: { exp: 0, equipment: {} } },
  },
  resources: { type: resourcesSchema, default: {} },
}, {
  collection: 'characters'
});

// Create the Mongoose model
const CharacterModel = model<Character>('Character', characterSchema);

export default CharacterModel;

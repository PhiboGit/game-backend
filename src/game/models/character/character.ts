import mongoose, { Schema, model, Types } from 'mongoose';
import { Currency, currencySchema } from './currency.js';
import { Professions, professionSchema } from './profession.js';
import { ActionObject } from '../../actions/types.js';
import { Resources } from '../../jsonValidators/dataValidator/validateResourceData.js';
import { resourcesSchema } from './resources.js';

export interface Character {
  _id: Types.ObjectId;
  characterName: string;
  expChar: number;
  currency: Currency;
  items: Types.ObjectId[];
  activeAction: ActionObject | null;
  actionQueue: ActionObject[];
  professions: Professions;
  resources: Resources;
}

const characterSchema = new Schema<Character>({
  characterName: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  expChar: { 
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
    weaving: { type: professionSchema, default: { exp: 0, equipment: {} } },
    smelting: { type: professionSchema, default: { exp: 0, equipment: {} } },
    woodworking: { type: professionSchema, default: { exp: 0, equipment: {} } },
    smith: { type: professionSchema, default: { exp: 0, equipment: {} } },
    engineer: { type: professionSchema, default: { exp: 0, equipment: {} } },
    artificer: { type: professionSchema, default: { exp: 0, equipment: {} } },
  },
  resources: { type: resourcesSchema, default: {} },
}, {
  collection: 'characters'
});

// Create the Mongoose model
const CharacterModel = model<Character>('Character', characterSchema);

export default CharacterModel;

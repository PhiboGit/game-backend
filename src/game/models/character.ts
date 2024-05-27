import mongoose, { Document } from 'mongoose';

const CharacterSchema = new mongoose.Schema(
  {
    characterName: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    resources: {
      woodT1: { type: Number, default: 0 },
    }
  },
  {collection: 'characters'}
)

export interface ICharacter {
  characterName: string
  resources: {
    woodT1: number
  }
}

// Correct model definition
const Character = mongoose.model<ICharacter & Document>('Character', CharacterSchema);

export default Character
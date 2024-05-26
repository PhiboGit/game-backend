import mongoose from "mongoose";

const CharacterSchema = new mongoose.Schema(
  {
    characterName: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
  },
  {collection: 'characters'}
)

const Character = mongoose.model('CharacterSchema', CharacterSchema)

export default Character
import { JTDDataType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";

const schemaCrafting = {
  properties: {
    type: {enum: ['action']},
    limit: {type: "boolean"},
    iterations: {type: 'uint32'},
    task: {enum: ['crafting']},

    args: { properties: {
      recipe: { type: 'string' },
      ingredients: { elements: { type: 'string' } }
    }}
  }
} as const

export type CraftingMsg = JTDDataType<typeof schemaCrafting>

export const validateCraftingMsg = ajv.compile<CraftingMsg>(schemaCrafting)
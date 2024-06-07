import { JTDDataType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";
import { dataLoader } from "../../data/dataLoader.js";
import { resourceIds } from "../dataValidator/validateResourceData.js";

const schemaCrafting = {
  properties: {
    type: {enum: ['crafting']},
    limit: {type: "boolean"},
    iterations: {type: 'uint32'},

    args: { properties: {
      recipe: { type: 'string' },
      ingredients: { elements: { enum: resourceIds } }
    }}
  }
} as const

export type CraftingMsg = JTDDataType<typeof schemaCrafting>


const validate = ajv.compile<CraftingMsg>(schemaCrafting)
// type inference is not supported for JTDDataType yet
export function validateCraftingMsg(data: any): CraftingMsg | null {
  if(validate(data) && dataLoader.resourceRecipeData[data.args.recipe]) {
    console.log("CraftingMsg is valid")
    return data as CraftingMsg
  }else{
    console.log("CraftingMsg not valid: ", validate.errors);
    if(!validate.errors) console.log("CraftingMsg not valid. 'recipe' not found! ");
    return null
  }
}
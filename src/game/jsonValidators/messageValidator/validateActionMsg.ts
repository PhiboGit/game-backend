import { JTDDataType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";

// Base schema with common properties and a discriminated union for args
const baseSchema = {
  properties: {
    type: { enum: ["action"] },
    limit: { type: "boolean" },
    iterations: { type: "uint32" },
    args: { ref: "gathering" }
  },
  definitions: {
    gathering: {
      properties: {
        node: { type: "string" }
      }
    },
    crafting: {
      properties: {
        recipe: { type: "string" },
        ingredients: { elements: { type: "string" } }
      }
    }
  }
} as const;

export type ActionMsg = JTDDataType<typeof baseSchema>;

// Compile the schema
export const validateActionMsg = ajv.compile<ActionMsg>(baseSchema);
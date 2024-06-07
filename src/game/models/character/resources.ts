import { Schema } from "mongoose";
import { ResourceId, Resources, resourceIds } from "../../jsonValidators/dataValidator/validateResourceData.js";


const resourcesSchemaDefinition = resourceIds.reduce((acc, resourceId) => {
  acc[resourceId] = { type: Number, default: 0 };
  return acc;
}, {} as Record<ResourceId, { type: NumberConstructor, default: number }>);

export const resourcesSchema = new Schema<Resources>({
  ...resourcesSchemaDefinition
}, {_id: false});
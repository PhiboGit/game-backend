import { Schema } from "mongoose";

export const resourceIds = [
  "woodT1", "woodT2", "woodT3", "woodT4", "woodT5",
  "fiberT1", "fiberT2", "fiberT3", "fiberT4", "fiberT5",
  "oreT1", "oreT2", "oreT3", "oreT4", "oreT5",
  "coal",
  "ingotT1", "ingotT2", "ingotT3", "ingotT4", "ingotT5",
  "plankT1", "plankT2", "plankT3", "plankT4", "plankT5",
  "textileT1", "textileT2", "textileT3", "textileT4", "textileT5",
  "sapT1", "sapT2", "sapT3", "sapT4", "sapT5",
  "stickT1", "stickT2", "stickT3", "stickT4", "stickT5",
  "chunkT1", "chunkT2", "chunkT3", "chunkT4", "chunkT5",
  "speed_mining_charm", "exp_mining_charm", "luck_mining_charm", "yieldMin_mining_charm", "yieldMax_mining_charm",
  "speed_woodcutting_charm", "exp_woodcutting_charm", "luck_woodcutting_charm", "yieldMin_woodcutting_charm", "yieldMax_woodcutting_charm",
  "speed_harvesting_charm", "exp_harvesting_charm", "luck_harvesting_charm", "yieldMin_harvesting_charm", "yieldMax_harvesting_charm",
  "con_charm", "int_charm", "str_charm", "foc_charm", "dex_charm",
] as const

export type ResourceId = typeof resourceIds[number];
export const isResourceId = (resource: string): resource is ResourceId => resourceIds.includes(resource as ResourceId)
export type Resources = Record<ResourceId, number>;

const resourcesSchemaDefinition = resourceIds.reduce((acc, resourceId) => {
  acc[resourceId] = { type: Number, default: 0 };
  return acc;
}, {} as Record<ResourceId, { type: NumberConstructor, default: number }>);

export const resourcesSchema = new Schema<Resources>({
  ...resourcesSchemaDefinition
}, {_id: false});
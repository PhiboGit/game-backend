import { Schema } from "mongoose";

export interface Resources {
  woodT1: number;
  woodT2: number;
  woodT3: number;
  woodT4: number;
  woodT5: number;
  fiberT1: number;
  fiberT2: number;
  fiberT3: number;
  fiberT4: number;
  fiberT5: number;
  oreT1: number;
  oreT2: number;
  oreT3: number;
  oreT4: number;
  oreT5: number;
  coal: number;
  ingotT1: number;
  ingotT2: number;
  ingotT3: number;
  ingotT4: number;
  ingotT5: number;
  plankT1: number;
  plankT2: number;
  plankT3: number;
  plankT4: number;
  plankT5: number;
  textileT1: number;
  textileT2: number;
  textileT3: number;
  textileT4: number;
  textileT5: number;
  sapT1: number;
  sapT2: number;
  sapT3: number;
  sapT4: number;
  sapT5: number;
  stickT1: number;
  stickT2: number;
  stickT3: number;
  stickT4: number;
  stickT5: number;
  chunkT1: number;
  chunkT2: number;
  chunkT3: number;
  chunkT4: number;
  chunkT5: number;
}

export const resourcesSchema = new Schema<Resources>({
  woodT1: { type: Number, default: 0 },
  woodT2: { type: Number, default: 0 },
  woodT3: { type: Number, default: 0 },
  woodT4: { type: Number, default: 0 },
  woodT5: { type: Number, default: 0 },
  fiberT1: { type: Number, default: 0 },
  fiberT2: { type: Number, default: 0 },
  fiberT3: { type: Number, default: 0 },
  fiberT4: { type: Number, default: 0 },
  fiberT5: { type: Number, default: 0 },
  oreT1: { type: Number, default: 0 },
  oreT2: { type: Number, default: 0 },
  oreT3: { type: Number, default: 0 },
  oreT4: { type: Number, default: 0 },
  oreT5: { type: Number, default: 0 },
  coal: { type: Number, default: 0 },
  ingotT1: { type: Number, default: 0 },
  ingotT2: { type: Number, default: 0 },
  ingotT3: { type: Number, default: 0 },
  ingotT4: { type: Number, default: 0 },
  ingotT5: { type: Number, default: 0 },
  plankT1: { type: Number, default: 0 },
  plankT2: { type: Number, default: 0 },
  plankT3: { type: Number, default: 0 },
  plankT4: { type: Number, default: 0 },
  plankT5: { type: Number, default: 0 },
  textileT1: { type: Number, default: 0 },
  textileT2: { type: Number, default: 0 },
  textileT3: { type: Number, default: 0 },
  textileT4: { type: Number, default: 0 },
  textileT5: { type: Number, default: 0 },
  sapT1: { type: Number, default: 0 },
  sapT2: { type: Number, default: 0 },
  sapT3: { type: Number, default: 0 },
  sapT4: { type: Number, default: 0 },
  sapT5: { type: Number, default: 0 },
  stickT1: { type: Number, default: 0 },
  stickT2: { type: Number, default: 0 },
  stickT3: { type: Number, default: 0 },
  stickT4: { type: Number, default: 0 },
  stickT5: { type: Number, default: 0 },
  chunkT1: { type: Number, default: 0 },
  chunkT2: { type: Number, default: 0 },
  chunkT3: { type: Number, default: 0 },
  chunkT4: { type: Number, default: 0 },
  chunkT5: { type: Number, default: 0 },
}, {_id: false});
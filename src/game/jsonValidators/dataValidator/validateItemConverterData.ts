import { ajv } from "../ajvInstance.js";
import { RarityType, rarities } from "./validateResourceData.js";
import ItemConverterDataJSON from "../../data/gameDataJSON/itemConverterData.json";
import { JTDSchemaType } from "ajv/dist/jtd.js";

export type ItemConverterData = {
  maxGearScoreStat: number;
  gearScoreConverter: {
    exp: {
      "integer/float": "float",
      min: number;
      max: number;
    },
    speed: {
      "integer/float": "float",
      min: number;
      max: number;
    },
    luck: {
      "integer/float": "integer",
      min: number;
      max: number;
    },
    yieldMin: {
      "integer/float": "float",
      min: number;
      max: number;
    },
    yieldMax: {
      "integer/float": "float",
      min: number;
      max: number;
    },

    str: {
      "integer/float": "integer",
      min: number;
      max: number;
    },
    dex: {
      "integer/float": "integer",
      min: number;
      max: number;
    },
    int: {
      "integer/float": "integer",
      min: number;
      max: number;
    },
    con: {
      "integer/float": "integer",
      min: number;
      max: number;
    },
    foc: {
      "integer/float": "integer",
      min: number;
      max: number;
    }
  }
}

const schemaItemRecipe: JTDSchemaType<ItemConverterData> =  {
  properties:{
    maxGearScoreStat: {type: "int32"},
    gearScoreConverter: {
      properties: {
        exp: {
          properties: {
            "integer/float": {enum: ["float"]},
            min: {type: "float32"},
            max: {type: "float32"}
          }
        },
        speed: {
          properties: {
            "integer/float": {enum: ["float"]},
            min: {type: "float32"},
            max: {type: "float32"}
          }
        },
        luck: {
          properties: {
            "integer/float": {enum: ["integer"]},
            min: {type: "float32"},
            max: {type: "float32"}
          }
        },
        yieldMin: {
          properties: {
            "integer/float": {enum: ["float"]},
            min: {type: "float32"},
            max: {type: "float32"}
          }
        },
        yieldMax: {
          properties: {
            "integer/float": {enum: ["float"]},
            min: {type: "float32"},
            max: {type: "float32"}
          }
        },
        str: {
          properties: {
            "integer/float": {enum: ["integer"]},
            min: {type: "float32"},
            max: {type: "float32"}
          }
        },
        dex: {
          properties: {
            "integer/float": {enum: ["integer"]},
            min: {type: "float32"},
            max: {type: "float32"}
          }
        },
        int: {
          properties: {
            "integer/float": {enum: ["integer"]},
            min: {type: "float32"},
            max: {type: "float32"}
          }
        },
        con: {
          properties: {
            "integer/float": {enum: ["integer"]},
            min: {type: "float32"},
            max: {type: "float32"}
          }
        },
        foc: {
          properties: {
            "integer/float": {enum: ["integer"]},
            min: {type: "float32"},
            max: {type: "float32"}
          }
        }
      }
    }
  }
  
};



const validate = ajv.compile<ItemConverterData>(schemaItemRecipe)

function validateItemConverterData (data: any): ItemConverterData {
  if (validate(data)) {
    console.log("ItemConverterData is valid")
    return data as ItemConverterData
  } else{
    console.error("Error validating ItemConverterData: ", validate.errors);
    throw new Error("Error validating ItemConverterData");
  }
}

export const itemConverterData = validateItemConverterData(ItemConverterDataJSON)
import { PART_TYPE_FROM_VALUE, DATA_TYPE } from "../constants.js";

class Part {
  constructor(row_data){
    this.type = PART_TYPE_FROM_VALUE[row_data[0]]
    this.name = row_data[1]
    this.active = row_data[2] === "1";
    this.created_at = row_data[3]
    this.color = row_data[4]
  }
}

class Completeset {
  constructor(row_data){
    this.filename = row_data[1];
    this.name = row_data[2];
    this.active = row_data[3] === "1";
    this.created_at = row_data[4];
    this.awheel1 = row_data[5];
    this.awheel2 = row_data[6];
    this.atruck = row_data[7];
    this.adeck = row_data[8];
    this.agrip = row_data[9];
    this.bwheel1 = row_data[10];
    this.bwheel2 = row_data[11];
    this.btruck = row_data[12];
    this.bdeck = row_data[13];
    this.bgrip = row_data[14];
    this.all_parts = [
      this.awheel1,
      this.awheel2,
      this.atruck,
      this.adeck,
      this.agrip,
      this.bwheel1,
      this.bwheel2,
      this.btruck,
      this.bdeck,
      this.bgrip,
    ];
  }
}


export function processDBData(db_data, data_type) {
  let processed_data = {}
  for (var key of Object.keys(db_data)){
    if(data_type === DATA_TYPE.PART){
      processed_data[key] = new Part(db_data[key]);
    } else if(data_type === DATA_TYPE.COMPLETE_SET){
      processed_data[key] = new Completeset(db_data[key]);
    } else {
      console.log("DATA_TYPE not provided or not recognized.");
    }
  }
  return processed_data;
}

/*
 * db_data is processed part data
 */
export function getDBDataByName(name, db_data){
  let result;
  Object.keys(db_data).forEach(function(key){
    if(db_data[key].name === name){
      result = {...db_data[key], id: key};
    }
  });
  return(result);
}

export function getCompletesetDescription(completesetID){
  return "Description"
}

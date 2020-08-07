import { PART_TYPE_FROM_VALUE } from "../constants.js";

class Part {
  constructor(row_data){
    this.type = PART_TYPE_FROM_VALUE[row_data[0]]
    this.name = row_data[1]
    this.active = row_data[2] === "1";
    this.created_at = row_data[3]
    this.uri = row_data[4]
  }
}


export function processParts(parts_data) {
  let processed_parts = {}
  for (var key of Object.keys(parts_data)){
    processed_parts[key] = new Part(parts_data[key])
  }
  return processed_parts;
}

export const PART_TYPE = {
  WHEEL: "wheel",
  TRUCK: "truck",
  DECK: "deck",
  GRIP: "grip",
  APPAREL: "apparel",
  OTHER: "other",
}

export const PART_TYPE_FROM_VALUE = {
  "wheel": PART_TYPE.WHEEL,
  "truck":  PART_TYPE.TRUCK,
  "deck": PART_TYPE.DECK,
  "grip": PART_TYPE.GRIP,
  "apparel": PART_TYPE.APPAREL,
  "other": PART_TYPE.OTHER,
}

export const ALL_PART_TYPES = [
  PART_TYPE.WHEEL,
  PART_TYPE.TRUCK,
  PART_TYPE.DECK,
  PART_TYPE.GRIP,
  PART_TYPE.APPAREL,
  PART_TYPE.OTHER,
]

export const COLOR = {
  Red: "#ed4134",
  Green: "#3df540",
  Yellow: "#fff712",
  Black: "#000000",
  Orange: "#f07c00",
  Marine: "#004fed",
  Cyan: "#00a0db",
  Pink: "#e8179b",
  Lavender: "#ae52ff",
  Violet: "#a600ff",
  White: "#ffffff",
  Chrome: "#828282",
  Mint: "#3bffb7",
  Gold: "#e8d151",
  Transparent: "#b0b0b0",
}

export const ALL_COLORS = Object.keys(COLOR)

export const DATA_TYPE = {
  PART: "Part",
  COMPLETE_SET: "Completeset",
}

export const server_url = "http://192.168.1.8:5000/"
//export const server_url = "http://127.0.0.1:5000/"
export const api_path = "api/v1/"


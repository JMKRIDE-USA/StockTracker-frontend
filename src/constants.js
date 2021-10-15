export const AUTH_STATE = {
  NONE: 0,
  READONLY: 1,
  READWRITE: 5,
  ADMIN: 500,
};

export const authStateToString = ( state ) => (
  {
    0: "None",
    1: "Read Only",
    5: "Read Write",
    500: "Admin",
  }[state]
);

export const permissionLevelToAuthState = (permissionLevel) => (
  {
    "none": AUTH_STATE.NONE,
    "user": AUTH_STATE.READONLY,
    "ambassador": AUTH_STATE.READWRITE,
    "admin": AUTH_STATE.ADMIN,
  }[permissionLevel]
);

export const allColors = {
  Black: "#000000",
  White: "#ffffff",
  Cyan: "#00a0db",
  Pink: "#ec008c",
  Red: "#ed1c24",
  Yellow: "#fff200",
  Orange: "#f26522",
  Lavender: "#a98ec3",
  Green: "#9ccb3b",
  Marine: "#276cdb",
  Violet: "#ac519f",
  Mint: "#8fd0b8",
  Chrome: "#88898a",
  Silver: "#c1c1c1",
  Gold: "#ffc20e",
  Sakura: "#efbedf",
  Brown: "#977348",
}

export const colorNameToHex = (color) => allColors[color];
export const colorNames = Object.keys(allColors);

export const colorNameToTransparentHex = (color, alpha) => {
  const hex = allColors[color];
  const r = parseInt(hex.slice(1,3), 16)
  const g = parseInt(hex.slice(3,5), 16)
  const b = parseInt(hex.slice(5,7), 16)
  return 'rgba(' + [r,g,b].join(',') + ',' + alpha + ')';
}

export const colorIsDark = color => (
  [
    "Black", "Cyan", "Pink", "Orange", "Marine",
    "Violet", "Green", "Red", "Chrome",
  ].includes(color)
);

export const CSPartPropertyList = [
  'lwheel1', 'lwheel2', 'ltruck', 'ldeck', 'lgrip',
  'rwheel1', 'rwheel2', 'rtruck', 'rdeck', 'rgrip',
]

export const PartTypes = {
  WHEEL: "wheel",
  TRUCK: "truck",
  DECK: "deck",
  GRIP: "grip",
}

export const AUTH_STATE = {
  "NONE": 0,
  "READONLY": 1,
  "READWRITE": 5,
  "ADMIN": 500,
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

export const colorNameToHex = (color) => (
  {
    Black: "#000000",
    White: "#ffffff",
    Cyan: "#00a0db",
    Pink: "#ec008c",
    Red: "#ed1c24",
    Yellow: "#fff200",
    Orange: "#f26522",
    Lavender: "#a98ec3",
    Green: "#9ccb3b",
    Marine: "#0083ca",
    Purple: "#ac519f",
    Mint: "#8fd0b8",
    Chrome: "#afafaf",
    Silver: "#c1c1c1",
    Gold: "#ffc20e",
    Sakura: "#efbedf",
    Brown: "#977348",
  }[color]
);

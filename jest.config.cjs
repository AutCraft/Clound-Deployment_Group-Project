module.exports = {
  testEnvironment: "node",

  transform: { "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json", useESM: true }] },
  extensionsToTreatAsEsm: [".ts"],

  moduleNameMapper: { "^(\\.{1,2}/.*)\\.js$": "$1" },

  testMatch: ["**/?(*.)+(spec|test).ts"],
};

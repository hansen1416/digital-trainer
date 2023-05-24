import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
    Counter: {
      keySchema: {},
      schema: "uint32",
    },
    Report: {
      keySchema: {},
      schema: {
        name: "string",
      },
    },
  },
});

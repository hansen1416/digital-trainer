import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
    Report: {
      keySchema: {},
      schema: {
        name: "string",
      },
    },
  },
});

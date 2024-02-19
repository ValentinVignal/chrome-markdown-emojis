global.chrome = require("sinon-chrome");
import "isomorphic-fetch";
import { emojisMap, fetchEmojisMap } from "./background";

describe("background", () => {
  describe("fetchEmojisMap", () => {
    test("It should fetch the map of emojis", async () => {
      await fetchEmojisMap();
      expect(emojisMap).toBeDefined();
      expect(emojisMap).toMatchObject({
        tada: "🎉",
        upside_down_face: "🙃",
        poop: "💩",
      });
    });
  });
});

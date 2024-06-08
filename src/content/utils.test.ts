import { safeSliceText, safeTextLength } from "./utils";

describe("utils", () => {
  describe("safeSliceText", () => {
    it("should return the entire text when no end index is provided", () => {
      const text = "Hello 😊 world";
      const result = safeSliceText(text);
      expect(result).toBe(text);
    });

    it("should return an empty string when the end index is 0", () => {
      const text = "Hello 😊 world";
      const result = safeSliceText(text, 0);
      expect(result).toBe("");
    });

    it("should return a sliced text with emojis when the end index is provided", () => {
      const text = "Hello 😊 world";
      const endIndex = 5;
      const result = safeSliceText(text, endIndex);
      expect(result).toBe("Hello");
    });

    it("should handle emojis correctly when slicing the text", () => {
      const text = "Hello 😊 world";
      const endIndex = 10;
      const result = safeSliceText(text, endIndex);
      expect(result).toBe("Hello 😊 wo");
    });
  });

  describe("safeTextLength", () => {
    it("should return 0 for an empty string", () => {
      const text = "";
      const result = safeTextLength(text);
      expect(result).toBe(0);
    });

    it("should return the correct length for a string without emojis", () => {
      const text = "Hello world";
      const result = safeTextLength(text);
      expect(result).toBe(11);
    });

    it("should return the correct length for a string with emojis", () => {
      const text = "Hello 😊 world";
      const result = safeTextLength(text);
      expect(result).toBe(13);
    });
  });
});

import { setFacebookText } from "./handleText";

describe("handleText", () => {
  describe("setFacebookText", () => {
    test("It should get the selection, select the text to replace and insert the new text", () => {
      const document = {
        execCommand: jest.fn(),
      } as unknown as Document;
      const focusNode = {
        ownerDocument: document,
      } as Node;
      const selection = {
        focusNode,
        addRange: jest.fn(),
        removeAllRanges: jest.fn(),
        focusOffset: 20,
      } as unknown as Selection;
      jest.spyOn(window, "getSelection").mockReturnValue(selection);

      jest.spyOn(Range.prototype, "setStart").mockImplementation(() => {});
      jest.spyOn(Range.prototype, "setEnd").mockImplementation(() => {});

      setFacebookText("textToReplace", "emoji ");

      expect(Range.prototype.setStart).toHaveBeenCalledTimes(1);
      expect(Range.prototype.setStart).toHaveBeenCalledWith(focusNode, 7);
      expect(Range.prototype.setEnd).toHaveBeenCalledTimes(1);
      expect(Range.prototype.setEnd).toHaveBeenCalledWith(focusNode, 20);
      expect(selection.removeAllRanges).toHaveBeenCalledTimes(1);
      expect(document.execCommand).toHaveBeenCalledTimes(2);
      expect(document.execCommand).toHaveBeenCalledWith(
        1,
        "insertText",
        false,
        "emoji"
      );
      expect(document.execCommand).toHaveBeenCalledWith(
        2,
        "insertText",
        false,
        " "
      );
    });
  });
});

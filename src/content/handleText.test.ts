import * as handleText from "./handleText";

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

      handleText.setFacebookText("textToReplace", "emoji ");

      expect(Range.prototype.setStart).toHaveBeenCalledTimes(1);
      expect(Range.prototype.setStart).toHaveBeenCalledWith(focusNode, 7);
      expect(Range.prototype.setEnd).toHaveBeenCalledTimes(1);
      expect(Range.prototype.setEnd).toHaveBeenCalledWith(focusNode, 20);
      expect(selection.removeAllRanges).toHaveBeenCalledTimes(1);
      expect(document.execCommand).toHaveBeenCalledTimes(2);
      expect(document.execCommand).toHaveBeenNthCalledWith(
        1,
        "insertText",
        false,
        "emoji"
      );
      expect(document.execCommand).toHaveBeenNthCalledWith(
        2,
        "insertText",
        false,
        " "
      );
    });
  });

  describe("replaceEmoji", () => {
    test("It should call setFacebookText on twitter", () => {
      const setFacebookTextSpy = jest
        .spyOn(handleText, "setFacebookText")
        .mockReturnValue();
      jest.spyOn(handleText, "isFacebook").mockReturnValue(true);

      handleText.replaceEmoji("textToReplace", "emoji", 10);

      expect(setFacebookTextSpy).toHaveBeenCalledTimes(1);
      expect(setFacebookTextSpy).toHaveBeenCalledWith(
        "textToReplace",
        "emoji",
        10
      );
    });
  });
});

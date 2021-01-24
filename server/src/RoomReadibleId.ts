// "F" and "2" are not included
const codeChars = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "0",
  "1",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

export default class RoomReadibleId {
  // if you find three repeating alpha characters, replace last one with "2", or with repeating number characters, with "F"
  // ex AAAAA => AA2AA
  // ex 33333 => 33F33
  private _sourceId = "A".repeat(5);
  id = this._sourceId;

  incrementId() {
    const charMapCount: { [key: string]: number } = {};
    let displayId = this._sourceId.split("");

    // rotate
    displayId = this.rotateId(displayId).split("");
    this._sourceId = displayId.join("");

    displayId.some((char, idx) => {
      if (!charMapCount[char]) {
        charMapCount[char] = 1;
      } else {
        charMapCount[char]++;
      }

      if (charMapCount[char] >= 3) {
        if (char.match(/[a-z]/i)) {
          displayId[idx] = "2";
        }
        if (char.match(/[0-9]/)) {
          displayId[idx] = "F";
        }
        return true;
      }

      return false;
    });

    return displayId.join("");
  }

  private rotateId = (idArr: string[] | string, idx?: number): string => {
    if (!Array.isArray(idArr)) idArr = idArr.split("");
    if (idx == null) idx = idArr.length - 1;
    if (idx < 0) return idArr.join("");

    const foundCharIdx = codeChars.indexOf(idArr[idx]);
    const charsAmount = codeChars.length - 1;
    let hasRotated = false;

    if (foundCharIdx === charsAmount) {
      if (idx === 0) {
        // reset to starting code
        idArr.forEach((_, idx) => ((idArr as string[])[idx] = codeChars[0]));
        return idArr.join("");
      }

      hasRotated = true;
      idArr[idx] = codeChars[0];
    }

    if (!hasRotated) {
      idArr[idx] = codeChars[foundCharIdx + 1];
      return idArr.join("");
    }

    const result = this.rotateId(idArr, idx - 1);
    // this.id = result;
    return result;
    // this.id = result
  };
}

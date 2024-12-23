export const beginsWithVowel = (text: string) => {
  const firstLetter = text[0].toLowerCase();
  return (
    firstLetter === "a" ||
    firstLetter === "e" ||
    firstLetter === "i" ||
    firstLetter === "o" ||
    firstLetter === "u"
  );
};

export const generateRandString = (length: number) => {
  const chars: (string | number)[] = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
  ];
  const isUppercaseOptions: boolean[] = [true, false];

  let result = "";
  for (let i = 0; i < length; i++) {
    let randomChar = chars[Math.floor(Math.random() * chars.length)];
    let isUppercase =
      isUppercaseOptions[Math.floor(Math.random() * isUppercaseOptions.length)];

    if (typeof randomChar === "string" && isUppercase)
      result += randomChar.toUpperCase();
    else result += randomChar;
  }

  return result;
};

export const properString = (text: string) => {
  let charArr: string[] = text.split("");
  let result = "";
  for (let i = 0; i < charArr.length; i++) {
    let char = charArr[i];
    result += i === 0 ? char.toUpperCase() : char;
  }

  return result;
};

export const truncateString = (text: string, maxLength: number) => {
  if (text.length < maxLength) return text;

  let charArr: string[] = text.split("");
  let result: string = "";

  for (let i = 0; i < maxLength; i++) {
    const char = charArr[i];
    result += char;
  }

  return `${result.trim()}...`;
};

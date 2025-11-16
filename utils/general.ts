import { FirestoreDate } from "@/types/course";

export const beginsWithVowel = (text: string): boolean => {
  const firstLetter = text[0].toLowerCase();
  return (
    firstLetter === "a" ||
    firstLetter === "e" ||
    firstLetter === "i" ||
    firstLetter === "o" ||
    firstLetter === "u"
  );
};

export const generateRandString = (length: number): string => {
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

export const properString = (text: string): string => {
  let charArr: string[] = text.split("");
  let result = "";
  for (let i = 0; i < charArr.length; i++) {
    let char = charArr[i];
    result += i === 0 ? char.toUpperCase() : char;
  }

  return result;
};

export const truncateString = (text: string, maxLength: number): string => {
  if (text.length < maxLength) return text;

  let charArr: string[] = text.split("");
  let result: string = "";

  for (let i = 0; i < maxLength; i++) {
    const char = charArr[i];
    result += char;
  }

  return `${result.trim()}...`;
};

export const truncateEmail = (email: string, maxLength: number): string => {
  if (email.length < maxLength) return email;

  const [username, domain]: [username: string, domain: string] = [
    email.split("@")[0],
    email.split("@")[1],
  ];
  const ellipsis: string = "...";
  const delimiter: string = "@";

  let trailingChars: string = username.slice(-3);
  let leadingChars: string = username.slice(
    0,
    maxLength -
      (domain.length +
        ellipsis.length +
        trailingChars.length +
        delimiter.length)
  );

  return `${leadingChars}${ellipsis}${trailingChars}${delimiter}${domain}`;
};

export const isValidEmail = (email: string): boolean => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const listItemsAsString = (items: string[]): string => {
  let result = "";

  if (items.length <= 2) return items.join(" and ").trim();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const isLastItem = i === items.length - 1;

    if (!isLastItem) result += `${item}, `;
    else result += `and ${item}`;
  }
  return result.trim();
};

export const delay = (seconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

export const formatCurrency = (
  value: number,
  currencyCode: string = "USD"
): string => {
  // TODO: Change locale based on user?
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(value);
};

export const convertToSubcurrency = (amount: number, factor: number = 100) => {
  return Math.round(amount * factor);
};

export const getUniqueArr = (arr: any[]): any[] => {
  if (arr.length <= 1) return arr;

  const uniqueValues = new Set();
  const result = [];

  for (const val of arr) {
    if (!uniqueValues.has(val)) {
      uniqueValues.add(val);
      result.push(val);
    }
  }

  return result;
};

export const removeElementFromArr = (
  arr: string[],
  target: string
): string[] => {
  const result = [];

  for (const el of arr) {
    if (el !== target) result.push(el);
  }
  return result;
};

export const isEmptyObject = (obj: any): boolean => {
  if (!obj) return true;
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const formatFirestoreDate = (date: FirestoreDate): Date => {
  return new Date(1970, 0, 1, 0, 0, date.seconds, date.nanoseconds / 1000000);
};

export const convertArrToRange = (arr: number[]): string => {
  if (arr.length === 0) return "";
  if (arr.length === 1) return arr[0].toString();

  const sortedArr = arr.sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sortedArr[0];
  let end = start;

  for (let i = 1; i < sortedArr.length; i++) {
    if (sortedArr[i] === end + 1) {
      end = sortedArr[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = sortedArr[i];
      end = start;
    }
  }

  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join(", ");
};

export const alphabet: string[] = ["A", "B", "C", "D"];

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

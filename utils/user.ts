export function generateDisplayName(
  prefix: string,
  displayName: string,
  isPrefixIncluded: boolean
) {
  return `${
    isPrefixIncluded && prefix.trim() !== "" ? `${prefix} ` : ""
  }${displayName}`;
}

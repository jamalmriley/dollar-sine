import { SELECTED_COURSE_SCHEMA } from "@/types/course";
import { EMOJI_SKIN_TONES } from "@/utils/emoji";
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsJson,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";

export function useResetQueryState() {
  const [, setPronunciation] = useQueryState("pronunciation", {
    defaultValue: "",
  });
  const [, setPrefix] = useQueryState("prefix", { defaultValue: "" });
  const [, setIsPrefixIncluded] = useQueryState(
    "isPrefixIncluded",
    parseAsBoolean.withDefault(true)
  );
  const [, setIsCustomPrefix] = useQueryState(
    "isCustomPrefix",
    parseAsBoolean.withDefault(false)
  );
  const [, setDisplayName] = useQueryState("displayName", { defaultValue: "" });
  const [, setDisplayNameFormat] = useQueryState("displayNameFormat", {
    defaultValue: "",
  });
  const [, setJobTitle] = useQueryState("jobTitle", { defaultValue: "" });
  const [, setPronouns] = useQueryState("pronouns", { defaultValue: "" });
  const [, setHasCustomPronouns] = useQueryState(
    "hasCustomPronouns",
    parseAsBoolean.withDefault(false)
  );
  const [, setEmojiSkinTone] = useQueryState(
    "emojiSkinTone",
    parseAsStringLiteral(EMOJI_SKIN_TONES).withDefault("default")
  );
  const [, setOrgName] = useQueryState("orgName", { defaultValue: "" });
  const [, setOrgSlug] = useQueryState("orgSlug", { defaultValue: "" });
  const [, setOrgAddress] = useQueryState("orgAddress", { defaultValue: "" });
  const [, setOrgCategory] = useQueryState("orgCategory", { defaultValue: "" });
  const [, setIsCustomOrgCategory] = useQueryState(
    "isCustomOrgCategory",
    parseAsBoolean.withDefault(false)
  );
  const [, setIsTeacherPurchasingEnabled] = useQueryState(
    "isTeacherPurchasingEnabled",
    parseAsBoolean.withDefault(false)
  );
  const [, setCoursesToBuy] = useQueryState(
    "courses",
    parseAsArrayOf(parseAsJson(SELECTED_COURSE_SCHEMA.parse))
  );

  const reset = (): void => {
    // Profile
    setPronunciation("");
    setPrefix("");
    setIsPrefixIncluded(true);
    setIsCustomPrefix(false);
    setDisplayName("");
    setDisplayNameFormat("");
    setJobTitle("");
    setPronouns("");
    setHasCustomPronouns(false);
    setEmojiSkinTone("default");
    // Organization
    setOrgName("");
    setOrgSlug("");
    setOrgAddress("");
    setOrgCategory("");
    setIsCustomOrgCategory(false);
    setIsTeacherPurchasingEnabled(false);
    // Courses
    setCoursesToBuy(null);
  };

  return { reset };
}

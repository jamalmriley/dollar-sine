import { EmojiSkinTone } from "../utils/emoji";
import { SelectedCourse } from "./course";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const ROLES = ["admin", "teacher", "guardian", "student", null] as const;
export type Role = (typeof ROLES)[number];

export const ORG_CATEGORIES = [
  "School",
  "After-school program provider",
  "Childcare provider",
  "Community center",
  "Education company",
  "Library",
  "Nonprofit organization",
  "Park district",
  "Recreation center",
  "Religious organization",
  "Tutoring center",
] as const;

export type OrgCategory = (typeof ORG_CATEGORIES)[number];

export const EN_PRONOUNS = [
  "he",
  "him",
  "his",
  "she",
  "her",
  "hers",
  "they",
  "them",
  "theirs",
] as const;
export type EnglishPronoun = (typeof EN_PRONOUNS)[number];
export const ES_PRONOUNS = [
  "ella",
  "ellas",
  "elle",
  "elles",
  "el",
  "ellos",
] as const;
export type SpanishPronoun = (typeof ES_PRONOUNS)[number];
export const PRONOUNS = [...EN_PRONOUNS, ...ES_PRONOUNS] as const;
export type Pronoun = EnglishPronoun | SpanishPronoun;

export const GUARDIAN_TYPES = [
  "Parent",
  "Stepparent",
  "Grandparent",
  "Aunt",
  "Uncle",
  "Older sibling",
  "Foster parent",
  "Adoptive parent",
  "Family member",
  "Guardian",
  "Caregiver",
] as const;
export type GuardianType = (typeof GUARDIAN_TYPES)[number];

export type Status = "Rejected" | "Pending" | "Accepted";

export interface UserInvitation {
  createdAt: Date;
  status: Status;
  organizationId: string;
}

interface Class {
  id: string;
  name: string;
  classAdmins: string[];
}

interface TestScores {
  name: "i-Ready" | "MAP";
  overallScore: number;
  domain1Score: [domainName: string, domainScore: number];
  domain2Score: [domainName: string, domainScore: number];
  domain3Score: [domainName: string, domainScore: number];
  domain4Score: [domainName: string, domainScore: number];
}

export const STUDENT_BASIC_DETAILS_SCHEMA = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    emailAddress: z.string(),
    gradeLevel: z.string(),
  })
  .transform((data) => ({
    ...data,
    id: uuidv4(),
  }));

export type StudentBasicDetails = z.infer<typeof STUDENT_BASIC_DETAILS_SCHEMA>;

// Users
export interface UserMetadata {
  role: Role;
  pronunciation: string | null;
  currPronunciationOptions: string[];
  prevPronunciationOptions: string[];
  isOnboardingComplete: boolean;
  lastOnboardingStepCompleted: number;
  onboardingLink: string;
  pronouns: string;
  hasCustomPronouns: boolean;
  emojiSkinTone: EmojiSkinTone;
  organizations: string[] | null;
  courses: SelectedCourse[];
  classes: Class[] | null;
  invitations: UserInvitation[] | null;
}
export interface AdminMetadata extends TeacherMetadata {}
export interface TeacherMetadata extends GuardianMetadata {
  jobTitle?: string | null;
}
export interface GuardianMetadata extends UserMetadata {
  displayName?: string | null;
  displayNameFormat?: string | null;
  prefix?: string | null;
  isPrefixIncluded?: boolean | null;
  isCustomPrefix?: boolean | null;
  students?: string[] | null;
  studentInvitations?: StudentBasicDetails[] | null;
}
export interface StudentMetadata extends UserMetadata {
  gradeLevel: string;
  guardians?: any[] | null;
  track?: "Above grade level" | "At grade level" | "Below grade level" | null;
  tools?: string[] | null;
  testScores?: TestScores[] | null;
  livesWith?: GuardianType[] | null;
  pets?: string[] | null;
  methodOfTransportation?: string | null;
  interests?: string[] | null;
  spendingCategories?: string[] | null;
  savingsGoals?: string[] | null;
  summary?: string | null;
}

// Organizations
export interface OrganizationInvitation {
  createdAt: Date;
  status: Status;
  userId: string;
}
export interface OrganizationMetadata {
  name: string;
  slug: string;
  address: string;
  category: string;
  isTeacherPurchasingEnabled: boolean;
  courses: SelectedCourse[] | null;
  invitations: OrganizationInvitation[] | null;
  joinCode: string;
  ownerId: string;
}

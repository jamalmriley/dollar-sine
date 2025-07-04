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

export interface OrganizationInvitation {
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

// Metadata //
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
  organizations: OrganizationId[];
  courses: SelectedCourse[];
  classes: Class[] | null;
  invitations: OrganizationInvitation[] | null;
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

// Purchased courses go to org metadata, enrolled courses go to user metadata
type OrganizationId = string;
export interface UserInvitation {
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
  invitations: UserInvitation[] | null;
}

// Classes //
interface HasMetdataMethods {
  update(
    valuesToUpdate:
      | AdminMetadata
      | TeacherMetadata
      | GuardianMetadata
      | StudentMetadata
      | OrganizationMetadata
  ): void;
}
abstract class User implements HasMetdataMethods {
  constructor(
    protected role: Role,
    protected pronunciation: string | null,
    protected currPronunciationOptions: string[],
    protected prevPronunciationOptions: string[],
    protected isOnboardingComplete: boolean,
    protected lastOnboardingStepCompleted: number,
    protected onboardingLink: string,
    protected pronouns: string,
    protected hasCustomPronouns: boolean,
    protected emojiSkinTone: EmojiSkinTone,
    protected organizations: OrganizationId[],
    protected courses: SelectedCourse[],
    protected classes: Class[] | null
  ) {}
  get isAdmin(): boolean {
    return this.role === "admin";
  }
  abstract update(
    valuesToUpdate:
      | AdminMetadata
      | TeacherMetadata
      | GuardianMetadata
      | StudentMetadata
  ): void;
}
class Admin extends User {
  constructor(
    role: Role,
    pronunciation: string | null,
    currPronunciationOptions: string[],
    prevPronunciationOptions: string[],
    isOnboardingComplete: boolean,
    lastOnboardingStepCompleted: number,
    onboardingLink: string,
    pronouns: string,
    hasCustomPronouns: boolean,
    emojiSkinTone: EmojiSkinTone,
    organizations: OrganizationId[],
    courses: SelectedCourse[],
    classes: Class[] | null,
    private students: string[] | null,
    private displayName: string | null,
    private displayNameFormat: string | null,
    private prefix: string | null,
    private jobTitle: string | null
  ) {
    super(
      role,
      pronunciation,
      currPronunciationOptions,
      prevPronunciationOptions,
      isOnboardingComplete,
      lastOnboardingStepCompleted,
      onboardingLink,
      pronouns,
      hasCustomPronouns,
      emojiSkinTone,
      organizations,
      courses,
      classes
    );
  }

  update(valuesToUpdate: AdminMetadata): void {
    Object.keys(valuesToUpdate).forEach((key) => {
      if (key in this) {
        (this as any)[key] = valuesToUpdate[key as keyof AdminMetadata];
      }
    });
  }
}
class Teacher extends User {
  constructor(
    role: Role,
    pronunciation: string | null,
    currPronunciationOptions: string[],
    prevPronunciationOptions: string[],
    isOnboardingComplete: boolean,
    lastOnboardingStepCompleted: number,
    onboardingLink: string,
    pronouns: string,
    hasCustomPronouns: boolean,
    emojiSkinTone: EmojiSkinTone,
    organizations: OrganizationId[],
    courses: SelectedCourse[],
    classes: Class[] | null,
    private students: string[] | null,
    private displayName: string | null,
    private displayNameFormat: string | null,
    private prefix: string | null,
    private jobTitle: string | null
  ) {
    super(
      role,
      pronunciation,
      currPronunciationOptions,
      prevPronunciationOptions,
      isOnboardingComplete,
      lastOnboardingStepCompleted,
      onboardingLink,
      pronouns,
      hasCustomPronouns,
      emojiSkinTone,
      organizations,
      courses,
      classes
    );
  }

  update(valuesToUpdate: TeacherMetadata): void {
    Object.keys(valuesToUpdate).forEach((key) => {
      if (key in this) {
        (this as any)[key] = valuesToUpdate[key as keyof TeacherMetadata];
      }
    });
  }
}
class Guardian extends User {
  constructor(
    role: Role,
    pronunciation: string | null,
    currPronunciationOptions: string[],
    prevPronunciationOptions: string[],
    isOnboardingComplete: boolean,
    lastOnboardingStepCompleted: number,
    onboardingLink: string,
    pronouns: string,
    hasCustomPronouns: boolean,
    emojiSkinTone: EmojiSkinTone,
    organizations: OrganizationId[],
    courses: SelectedCourse[],
    classes: Class[] | null,
    private students: string[] | null
  ) {
    super(
      role,
      pronunciation,
      currPronunciationOptions,
      prevPronunciationOptions,
      isOnboardingComplete,
      lastOnboardingStepCompleted,
      onboardingLink,
      pronouns,
      hasCustomPronouns,
      emojiSkinTone,
      organizations,
      courses,
      classes
    );
  }

  update(valuesToUpdate: GuardianMetadata): void {
    Object.keys(valuesToUpdate).forEach((key) => {
      if (key in this) {
        (this as any)[key] = valuesToUpdate[key as keyof GuardianMetadata];
      }
    });
  }
}
class Student extends User {
  constructor(
    role: Role,
    pronunciation: string,
    currPronunciationOptions: string[],
    prevPronunciationOptions: string[],
    isOnboardingComplete: boolean,
    lastOnboardingStepCompleted: number,
    onboardingLink: string,
    pronouns: string,
    hasCustomPronouns: boolean,
    emojiSkinTone: EmojiSkinTone,
    organizations: OrganizationId[],
    courses: SelectedCourse[],
    classes: Class[] | null,
    private gradeLevel: string | null,
    private track:
      | "Above grade level"
      | "At grade level"
      | "Below grade level"
      | null,
    private tools: string[] | null,
    private testScores: TestScores[] | null,
    private livesWith: GuardianType[] | null,
    private pets: string[] | null,
    private methodOfTransportation: string | null,
    private interests: string[] | null,
    private spendingCategories: string[] | null,
    private savingsGoals: string[] | null,
    private summary: string | null
  ) {
    super(
      role,
      pronunciation,
      currPronunciationOptions,
      prevPronunciationOptions,
      isOnboardingComplete,
      lastOnboardingStepCompleted,
      onboardingLink,
      pronouns,
      hasCustomPronouns,
      emojiSkinTone,
      organizations,
      courses,
      classes
    );
  }

  update(valuesToUpdate: StudentMetadata): void {
    Object.keys(valuesToUpdate).forEach((key) => {
      if (key in this) {
        (this as any)[key] = valuesToUpdate[key as keyof StudentMetadata];
      }
    });
  }
}
class Orgnanization implements HasMetdataMethods {
  constructor(
    protected name: string,
    protected slug: string,
    protected address: string,
    protected isTeacherPurchasingEnabled: boolean,
    protected courses: SelectedCourse[] | null
  ) {}

  update(valuesToUpdate: OrganizationMetadata): void {
    Object.keys(valuesToUpdate).forEach((key) => {
      if (key in this) {
        (this as any)[key] = valuesToUpdate[key as keyof OrganizationMetadata];
      }
    });
  }
}

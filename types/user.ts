import { EmojiSkinTone } from "../utils/emoji";
import { SelectedCourse } from "./course";

export const ROLES = ["admin", "teacher", "guardian", "student", null] as const;
export type Role = (typeof ROLES)[number];

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

// TODO
type Pronouns =
  | "he/him/his"
  | "he/she"
  | "he/they"
  | "she/her/hers"
  | "she/they"
  | "they/them/theirs"
  | "I prefer not to say";

export type GuardianType =
  | "Parent"
  | "Stepparent"
  | "Grandparent"
  | "Aunt"
  | "Uncle"
  | "Older sibling"
  | "Foster parent"
  | "Adoptive parent"
  | "Family member"
  | "Guardian"
  | "Caregiver";

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

// Metadata //
export interface PublicMetadata {
  role: Role;
  pronunciation: string | null;
  currPronunciationOptions: string[];
  prevPronunciationOptions: string[];
  isOnboardingCompleted: boolean;
  lastOnboardingStepCompleted: number;
  onboardingLink: string;
  pronouns: string;
  emojiSkinTone: EmojiSkinTone;
  organizations: OrganizationId[];
  courses: SelectedCourse[];
  classes: Class[] | null;
}

export interface AdminMetadata extends PublicMetadata {
  students?: string[] | null;
  displayName?: string | null;
  displayNameFormat?: string | null;
  prefix?: string | null;
  isPrefixIncluded?: boolean | null;
  isCustomPrefix?: boolean | null;
  jobTitle?: string | null;
}

export interface TeacherMetadata extends PublicMetadata {
  students?: string[] | null;
  displayName?: string | null;
  displayNameFormat?: string | null;
  prefix?: string | null;
  isPrefixIncluded?: boolean | null;
  isCustomPrefix?: boolean | null;
  jobTitle?: string | null;
}

export interface GuardianMetadata extends PublicMetadata {
  students?: string[] | null;
}

export interface StudentMetadata extends PublicMetadata {
  gradeLevel?: string | null;
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

export interface OrganizationMetadata {
  name: string;
  slug: string;
  address: string;
  is2FARequired: boolean;
  courses: SelectedCourse[] | null;
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
  getDetails():
    | AdminMetadata
    | TeacherMetadata
    | GuardianMetadata
    | StudentMetadata
    | OrganizationMetadata;
}

abstract class User implements HasMetdataMethods {
  constructor(
    protected role: Role,
    protected pronunciation: string | null,
    protected currPronunciationOptions: string[],
    protected prevPronunciationOptions: string[],
    protected isOnboardingCompleted: boolean,
    protected lastOnboardingStepCompleted: number,
    protected onboardingLink: string,
    protected pronouns: string,
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
  abstract getDetails():
    | AdminMetadata
    | TeacherMetadata
    | GuardianMetadata
    | StudentMetadata;
}

class Admin extends User {
  constructor(
    role: Role,
    pronunciation: string | null,
    currPronunciationOptions: string[],
    prevPronunciationOptions: string[],
    isOnboardingCompleted: boolean,
    lastOnboardingStepCompleted: number,
    onboardingLink: string,
    pronouns: string,
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
      isOnboardingCompleted,
      lastOnboardingStepCompleted,
      onboardingLink,
      pronouns,
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

  getDetails(): AdminMetadata {
    return {
      role: this.role,
      pronunciation: this.pronunciation,
      currPronunciationOptions: this.currPronunciationOptions,
      prevPronunciationOptions: this.prevPronunciationOptions,
      isOnboardingCompleted: this.isOnboardingCompleted,
      lastOnboardingStepCompleted: this.lastOnboardingStepCompleted,
      onboardingLink: this.onboardingLink,
      pronouns: this.pronouns,
      emojiSkinTone: this.emojiSkinTone,
      organizations: this.organizations,
      courses: this.courses,
      classes: this.classes,
      students: this.students,
      displayName: this.displayName,
      displayNameFormat: this.displayNameFormat,
      prefix: this.prefix,
      jobTitle: this.jobTitle,
    };
  }
}

class Teacher extends User {
  constructor(
    role: Role,
    pronunciation: string | null,
    currPronunciationOptions: string[],
    prevPronunciationOptions: string[],
    isOnboardingCompleted: boolean,
    lastOnboardingStepCompleted: number,
    onboardingLink: string,
    pronouns: string,
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
      isOnboardingCompleted,
      lastOnboardingStepCompleted,
      onboardingLink,
      pronouns,
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

  getDetails(): TeacherMetadata {
    return {
      role: this.role,
      pronunciation: this.pronunciation,
      currPronunciationOptions: this.currPronunciationOptions,
      prevPronunciationOptions: this.prevPronunciationOptions,
      isOnboardingCompleted: this.isOnboardingCompleted,
      lastOnboardingStepCompleted: this.lastOnboardingStepCompleted,
      onboardingLink: this.onboardingLink,
      pronouns: this.pronouns,
      emojiSkinTone: this.emojiSkinTone,
      organizations: this.organizations,
      courses: this.courses,
      classes: this.classes,
      students: this.students,
      displayName: this.displayName,
      displayNameFormat: this.displayNameFormat,
      prefix: this.prefix,
      jobTitle: this.jobTitle,
    };
  }
}

class Guardian extends User {
  constructor(
    role: Role,
    pronunciation: string | null,
    currPronunciationOptions: string[],
    prevPronunciationOptions: string[],
    isOnboardingCompleted: boolean,
    lastOnboardingStepCompleted: number,
    onboardingLink: string,
    pronouns: string,
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
      isOnboardingCompleted,
      lastOnboardingStepCompleted,
      onboardingLink,
      pronouns,
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

  getDetails(): GuardianMetadata {
    return {
      role: this.role,
      pronunciation: this.pronunciation,
      currPronunciationOptions: this.currPronunciationOptions,
      prevPronunciationOptions: this.prevPronunciationOptions,
      isOnboardingCompleted: this.isOnboardingCompleted,
      lastOnboardingStepCompleted: this.lastOnboardingStepCompleted,
      onboardingLink: this.onboardingLink,
      pronouns: this.pronouns,
      emojiSkinTone: this.emojiSkinTone,
      organizations: this.organizations,
      courses: this.courses,
      classes: this.classes,
      students: this.students,
    };
  }
}

class Student extends User {
  constructor(
    role: Role,
    pronunciation: string,
    currPronunciationOptions: string[],
    prevPronunciationOptions: string[],
    isOnboardingCompleted: boolean,
    lastOnboardingStepCompleted: number,
    onboardingLink: string,
    pronouns: string,
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
      isOnboardingCompleted,
      lastOnboardingStepCompleted,
      onboardingLink,
      pronouns,
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

  getDetails(): StudentMetadata {
    return {
      role: this.role,
      pronunciation: this.pronunciation,
      currPronunciationOptions: this.currPronunciationOptions,
      prevPronunciationOptions: this.prevPronunciationOptions,
      isOnboardingCompleted: this.isOnboardingCompleted,
      lastOnboardingStepCompleted: this.lastOnboardingStepCompleted,
      onboardingLink: this.onboardingLink,
      pronouns: this.pronouns,
      emojiSkinTone: this.emojiSkinTone,
      organizations: this.organizations,
      courses: this.courses,
      classes: this.classes,
      gradeLevel: this.gradeLevel,
      track: this.track,
      tools: this.tools,
      testScores: this.testScores,
      livesWith: this.livesWith,
      pets: this.pets,
      methodOfTransportation: this.methodOfTransportation,
      interests: this.interests,
      spendingCategories: this.spendingCategories,
      savingsGoals: this.savingsGoals,
      summary: this.summary,
    };
  }
}

class Orgnanization implements HasMetdataMethods {
  constructor(
    protected name: string,
    protected slug: string,
    protected address: string,
    protected is2FARequired: boolean,
    protected courses: SelectedCourse[] | null
  ) {}

  update(valuesToUpdate: OrganizationMetadata): void {
    Object.keys(valuesToUpdate).forEach((key) => {
      if (key in this) {
        (this as any)[key] = valuesToUpdate[key as keyof OrganizationMetadata];
      }
    });
  }

  getDetails(): OrganizationMetadata {
    return {
      name: this.name,
      slug: this.slug,
      address: this.address,
      is2FARequired: this.is2FARequired,
      courses: this.courses,
    };
  }
}

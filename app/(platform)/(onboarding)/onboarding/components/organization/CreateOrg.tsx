/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { autocomplete } from "@/utils/google";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { parseAsBoolean, useQueryState } from "nuqs";
import { FormEventHandler, useEffect, useState } from "react";
import OrgLogoUpload from "./OrgLogoUpload";
import { toast } from "@/hooks/use-toast";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { generateRandString, isEmptyObject } from "@/utils/general";
import {
  ORG_CATEGORIES,
  OrganizationMetadata,
  UserMetadata,
} from "@/types/user";
import {
  ClerkErrorResponse,
  createOrganization,
  updateOrganization,
  updateUserMetadata,
} from "@/app/actions/onboarding";
import { Response } from "@/types/general";
import { StyledButton } from "@/components/StyledButton";
import { Organization } from "@clerk/nextjs/server";
import OrgAlreadyCompleted from "./OrgAlreadyCompleted";
import { useResetQueryState } from "@/hooks/use-resetQueryState";

export default function CreateOrg() {
  const { user, isLoaded } = useUser();
  const { currOnboardingStep, userMetadata } = useOnboardingContext();
  const { step, isEditing } = currOnboardingStep;
  const currStep = 2;

  if (!user || !isLoaded || !userMetadata) return;
  // Variables dependent on userMetadata go below the if guard.
  const isCompleted = userMetadata.lastOnboardingStepCompleted >= currStep;
  return (
    <>
      {!isCompleted || (step === currStep && isEditing) ? (
        <CreateOrgForm />
      ) : (
        <OrgAlreadyCompleted tab="create" />
      )}
    </>
  );
}

function CreateOrgForm() {
  const {
    currOnboardingStep,
    setCurrOnboardingStep,
    orgLogo,
    setOrgLogo,
    isLoading,
    setIsLoading,
    setLastUpdated,
    setOrg,
    userMetadata,
  } = useOnboardingContext();
  const [orgName, setOrgName] = useQueryState("orgName", {
    defaultValue: "",
  });
  const [orgSlug, setOrgSlug] = useQueryState("orgSlug", {
    defaultValue: "",
  });
  const [orgCategory, setOrgCategory] = useQueryState("orgCategory", {
    defaultValue: "",
  });
  const [isCustomOrgCategory, setIsCustomOrgCategory] = useQueryState(
    "isCustomOrgCategory",
    parseAsBoolean.withDefault(false)
  );
  const [orgAddress, setOrgAddress] = useQueryState("orgAddress", {
    defaultValue: "",
  });
  const [isTeacherPurchasingEnabled, setIsTeacherPurchasingEnabled] =
    useQueryState(
      "isTeacherPurchasingEnabled",
      parseAsBoolean.withDefault(false)
    );
  const { reset } = useResetQueryState();
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [showPredictions, setShowPredictions] = useState<boolean>(false);
  const [hasCustomOrgSlug, setHasCustomOrgSlug] = useState<boolean>(false);
  const { user, isLoaded } = useUser();

  const isUpdating =
    userMetadata &&
    userMetadata.lastOnboardingStepCompleted >= 2 &&
    currOnboardingStep.step === 2 &&
    currOnboardingStep.isEditing;

  const organization =
    user && user.organizationMemberships.length > 0
      ? user.organizationMemberships[0].organization
      : undefined;
  const hasOrgUpdated: boolean =
    !organization || isEmptyObject(organization.publicMetadata)
      ? false
      : organization.name !== orgName ||
        organization.slug !== orgSlug ||
        String(organization.publicMetadata.organizationAddress) !==
          orgAddress ||
        Boolean(organization.publicMetadata.isTeacherPurchasingEnabled) !==
          isTeacherPurchasingEnabled;

  const autoCreateOrgSlug = (text: string): string =>
    text
      .normalize("NFD") // Normalize to decompose accented characters
      .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s-]/g, "") // Remove special characters except hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-+|-+$/g, "") // Remove hyphens from start and end
      .toLowerCase(); // Convert to lowercase

  const getOrganizationIds = (): string[] => {
    if (!user) return [];
    const result: string[] = [];
    const orgMemberships = user.organizationMemberships;
    if (!orgMemberships.length) return result;

    for (const orgMembership of orgMemberships) {
      result.push(orgMembership.organization.id);
    }
    return result;
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    if (!user || !isLoaded) return;

    e.preventDefault();
    setIsLoading(true);

    const body: any = new FormData();
    await body.append("image", orgLogo || null); // TODO: add this to server function

    const orgIds = getOrganizationIds();
    const orgId = orgIds[0];
    const orgMetadata: OrganizationMetadata = {
      name: orgName,
      slug: orgSlug,
      address: orgAddress,
      category: orgCategory,
      isTeacherPurchasingEnabled,
      courses: null,
      invitations: null,
      joinCode: generateRandString(6),
      ownerId: user.id,
    };

    async function handleResponse(res: Response) {
      if (!user || !userMetadata) return;
      if (res.success) {
        const userId = user.id;
        const { lastOnboardingStepCompleted } = userMetadata;
        const org = JSON.parse(res.data) as Organization;
        const newMetadata: UserMetadata = {
          ...userMetadata,
          lastOnboardingStepCompleted: Math.max(lastOnboardingStepCompleted, 2),
          organizations: userMetadata.organizations
            ? [...userMetadata.organizations, org.id]
            : [org.id],
        };

        updateUserMetadata(userId, newMetadata)
          .then(() => {
            const org = JSON.parse(res.data) as Organization;
            if (res.data) setOrg(org);
            reset();
            setLastUpdated(new Date().toString()); // Triggers re-render.
            setOrgLogo(undefined);
            setCurrOnboardingStep({ step: 2, isEditing: false });

            toast({
              variant: res.success ? "default" : "destructive",
              title: res.message?.title,
              description: res.message?.description,
            });
          })
          .catch((err: ClerkErrorResponse) => {
            const error = err.errors[0];

            toast({
              variant: "destructive",
              title: error.message,
              description: error.long_message,
            });
          });
      } else {
        toast({
          variant: "destructive",
          title: res.message?.title,
          description: res.message?.description,
        });
      }

      setIsLoading(false);
    }

    const formData = new FormData();
    if (orgLogo) formData.append("orgLogo", orgLogo);

    if (isUpdating) {
      await updateOrganization(orgId, orgMetadata, formData).then((orgRes) => {
        handleResponse(orgRes);
      });
    } else {
      await createOrganization(user.id, orgMetadata, formData).then(
        (orgRes) => {
          handleResponse(orgRes);
        }
      );
    }
  };

  useEffect(() => {
    const fetchPredictions = async () => {
      const predictions = await autocomplete(orgAddress);
      setPredictions(predictions ?? []);
    };

    fetchPredictions();
  }, [orgAddress]);

  useEffect(() => {
    if (isUpdating) setHasCustomOrgSlug(true);
  }, [isUpdating]);

  if (!user || !isLoaded || !userMetadata) return;
  return (
    <form onSubmit={handleSubmit} className="size-full flex flex-col gap-5">
      {/* Org Name and Org ID */}
      <div className="flex gap-5">
        {/* Org Name */}
        <div className="grid gap-2 w-full">
          <Label htmlFor="org-name" className="text-sm font-bold">
            Organization Name
          </Label>
          <Input
            id="org-name"
            placeholder="Ex: Stark Industries"
            value={orgName}
            onChange={(e) => {
              setOrgName(e.target.value);
              if (!hasCustomOrgSlug)
                setOrgSlug(autoCreateOrgSlug(e.target.value));
            }}
            className="w-full"
          />
        </div>

        {/* Org ID */}
        {/* TODO: Validate this field to make sure org ID isn't taken. If conditions aren't met, disable the button */}
        <div className="grid gap-2 w-full">
          <Label htmlFor="org-id" className="text-sm font-bold">
            Organization ID
          </Label>
          <Input
            id="org-id"
            placeholder="Ex: stark-industries"
            value={orgSlug}
            onChange={(e) => {
              // const re = /^[a-zA-Z0-9_]+$/;
              setOrgSlug(e.target.value);
              setHasCustomOrgSlug(e.target.value !== "");
            }}
            className="w-full"
          />
        </div>
      </div>

      {/* Org Address and Org Category */}
      <div className="flex gap-5">
        {/* Org Address */}
        <div className="grid gap-2 w-full">
          <Label htmlFor="org-address" className="text-sm font-bold">
            Organization Address
          </Label>
          <div className="relative">
            <Command className="w-full" id="org-address">
              <CommandInput
                placeholder="Search an address..."
                value={orgAddress}
                onValueChange={(e) => {
                  setOrgAddress(e);
                }}
                onFocus={() => setShowPredictions(true)}
                onBlur={() => setShowPredictions(false)}
                autoComplete="street-address"
              />
              <CommandList
                className={`absolute left-0 top-full w-full bg-primary-foreground rounded-b-md ${
                  showPredictions && "border-b border-x"
                } shadow-lg z-50`}
              >
                {showPredictions && (
                  <CommandEmpty>
                    <span className="text-muted-foreground font-medium select-none">
                      {orgAddress === ""
                        ? "Start typing to search an address."
                        : "No results found."}
                    </span>
                  </CommandEmpty>
                )}
                {predictions.length > 0 && showPredictions && (
                  <CommandGroup heading="Suggestions">
                    {predictions.map((prediction) => (
                      <CommandItem
                        key={prediction.place_id}
                        onMouseDown={() => {
                          setOrgAddress(prediction.description);
                          setShowPredictions(false);
                        }}
                      >
                        {prediction.description}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </div>
        </div>

        {/* Org Category */}
        <div className="grid gap-2 w-full">
          <Label
            htmlFor="org-category"
            className="text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis"
          >
            Which category best describes your organization?
          </Label>
          <div className="h-12 flex items-center overflow-x-scroll scrollbar-custom">
            {ORG_CATEGORIES.map((category) => (
              <div key={category} className="whitespace-nowrap px-2">
                <button
                  className={`chip ${
                    category === orgCategory ? "border-default-color" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsCustomOrgCategory(false);
                    setOrgCategory(category);
                  }}
                >
                  {category}
                </button>
              </div>
            ))}
            <span className={`whitespace-nowrap px-2`}>
              <button
                className={
                  isCustomOrgCategory
                    ? "chip-no-animation border-primary rounded-r-none border-r-0 pr-2"
                    : "chip"
                }
                onClick={(e) => {
                  e.preventDefault();
                  setIsCustomOrgCategory(true);
                  setOrgCategory("");
                }}
              >
                <span>Other{isCustomOrgCategory && ":"}</span>
              </button>
              <input
                className={
                  isCustomOrgCategory
                    ? "border border-primary rounded-full rounded-l-none border-l-0 text-xs py-1 max-w-24"
                    : "hidden"
                }
                value={orgCategory}
                placeholder="Please specify"
                onChange={(e) => setOrgCategory(e.target.value)}
              />
            </span>
          </div>
        </div>
      </div>

      {/* Org Logo */}
      <OrgLogoUpload />

      {/* Settings */}
      <div className="w-full flex justify-between items-center border p-3 rounded-md">
        <div className="flex flex-col gap-0.5">
          <Label
            htmlFor="isTeacherPurchasingEnabled"
            className="text-sm font-bold"
          >
            Allow
            {userMetadata.role === "admin" ? " " : " other "}
            teachers to purchase courses.
          </Label>
          <span className="text-xs text-muted-foreground">
            Payment methods and info are not shared across users.
          </span>
        </div>
        <Switch
          id="isTeacherPurchasingEnabled"
          checked={isTeacherPurchasingEnabled}
          onClick={() => {
            setIsTeacherPurchasingEnabled((prev) => !prev);
          }}
        />
      </div>

      <div className="flex grow items-end gap-5">
        <StyledButton
          buttonType="action"
          type="submit"
          className={`w-full ${isLoading && "cursor-progress"}`}
          disabled={
            isLoading ||
            (isUpdating
              ? orgLogo
                ? false
                : !orgName ||
                  !orgAddress ||
                  !orgSlug ||
                  !orgCategory ||
                  !hasOrgUpdated
              : !orgName || !orgAddress || !orgCategory || !orgSlug)
          }
          // If the organization information is being updated, see if at least a new logo has been uploaded.
          // If so, the button should not be disabled.
          // If not, make sure no text fields are blank and that there is at least one change to update.
        >
          {isLoading && <Loader2 className="animate-spin" />}
          {isUpdating
            ? isLoading
              ? "Updating organization..."
              : "Update organization"
            : isLoading
              ? "Creating organization..."
              : "Create organization"}
        </StyledButton>
      </div>
    </form>
  );
}

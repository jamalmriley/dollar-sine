import { Button } from "@/components/ui/button";
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
import { isEmptyObject } from "@/utils/general";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MdClose } from "react-icons/md";
import { AdminMetadata, OrganizationMetadata } from "@/types/user";
import {
  ClerkErrorResponse,
  createOrganization,
  Response,
  updateOrganization,
  updateUserMetadata,
} from "@/app/actions/onboarding";

export default function CreateOrUpdateOrg() {
  const {
    currOnboardingStep,
    setCurrOnboardingStep,
    orgLogo,
    setOrgLogo,
    isLoading,
    setIsLoading,
  } = useOnboardingContext();
  const { user, isLoaded } = useUser();
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [showPredictions, setShowPredictions] = useState<boolean>(false);
  const [hasCustomOrgSlug, setHasCustomOrgSlug] = useState<boolean>(false);

  const [orgName, setOrgName] = useQueryState("orgName", {
    defaultValue: "",
  });

  const [orgSlug, setOrgSlug] = useQueryState("orgSlug", {
    defaultValue: "",
  });

  const [orgAddress, setOrgAddress] = useQueryState("orgAddress", {
    defaultValue: "",
  });

  const [is2FARequired, setIs2FARequired] = useQueryState(
    "is2FARequired",
    parseAsBoolean.withDefault(false)
  );

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
        Boolean(organization.publicMetadata.is2FARequired) !== is2FARequired;

  if (!user || !isLoaded) return;
  const userMetadata = user.publicMetadata as any as AdminMetadata;

  const isUpdating =
    userMetadata.lastOnboardingStepCompleted >= 2 &&
    currOnboardingStep.step === 2 &&
    currOnboardingStep.isEditing;

  const header = {
    title: isUpdating
      ? "Update your organization."
      : "Create your organization.",
    description: isUpdating
      ? "Need to make a quick edit? Update your organization's details below."
      : "Enter your organization's details below.",
  };

  const createOrgSlug = (text: string) =>
    text.replaceAll(" ", "-").toLowerCase();

  // TODO
  /* const validate = (value: string) => {
    // ^               ->  Assert the start of the string
    // (?![-_])        ->  Negative lookahead to assert that the string does not start with a hyphen or underscore.
    // (?!.*[-_]$)     ->  Negative lookahead to assert that the string does not end with a hyphen or underscore.
    // [a-zA-Z0-9-_]+  ->  Allowable characters
    // $               ->  Assert the end of the string
    const pattern = /^(?![-_])(?!.*[-_]$)[a-zA-Z0-9-_]+$/;
    return pattern.test(value);
  }; */

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    if (!isLoaded || !user) return;

    e.preventDefault();
    setIsLoading(true);

    const body: any = new FormData();
    await body.append("image", orgLogo || null); // TODO: add this to server function

    const orgMetadata: OrganizationMetadata = {
      name: orgName,
      slug: orgSlug,
      address: orgAddress,
      is2FARequired,
      courses: [],
    };

    async function handleResponse(res: Response) {
      if (user && res.success) {
        setOrgName("");
        setOrgAddress("");
        setOrgSlug("");
        setOrgLogo(undefined);
        setIs2FARequired(false);
        setCurrOnboardingStep({ step: 2, isEditing: false });

        const userId = user.id;
        const {
          role,
          isOnboardingCompleted,
          onboardingLink,
          pronouns,
          emojiSkinTone,
          courses,
          classes,
        } = userMetadata;
        const newMetadata: AdminMetadata = {
          role,
          isOnboardingCompleted,
          lastOnboardingStepCompleted: 2,
          onboardingLink,
          pronouns,
          emojiSkinTone,
          organizations: [orgMetadata],
          courses,
          classes,
        };

        updateUserMetadata(userId, newMetadata)
          .then(() => {
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
      }

      setIsLoading(false);
    }

    if (isUpdating) {
      const orgId = user.organizationMemberships[0].organization.id;
      await updateOrganization(orgId, orgMetadata).then((orgRes) => {
        handleResponse(orgRes);
      });
    } else {
      await createOrganization(user.id, orgMetadata).then((orgRes) => {
        handleResponse(orgRes);
      });
    }
  };

  useEffect(() => {
    const fetchPredictions = async () => {
      const predictions = await autocomplete(orgAddress);
      // console.log(predictions); // {description: string}[]
      setPredictions(predictions ?? []);
    };

    fetchPredictions();
  }, [orgAddress]);

  return (
    <Card className="w-full h-full mx-10 max-w-3xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="h2">{header.title}</CardTitle>
          {isUpdating && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full size-5 lg:size-6"
              onClick={() => {
                setCurrOnboardingStep({ step: 2, isEditing: false });
                setOrgName("");
                setOrgAddress("");
                setOrgSlug("");
                setOrgLogo(undefined);
                setIs2FARequired(false);
              }}
            >
              <span className="sr-only">Cancel updating my organization</span>
              <MdClose />
            </Button>
          )}
        </div>
        {header.description !== "" && (
          <CardDescription className="subtitle">
            {header.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="w-full h-full flex flex-col gap-5"
        >
          {/* Org Name and Org ID */}
          <div className="flex gap-5">
            {/* Org Name */}
            <div className="grid gap-2 w-full">
              <Label htmlFor="org-name" className="text-sm font-bold">
                Organization Name
              </Label>
              <Input
                id="org-name"
                value={orgName}
                onChange={(e) => {
                  setOrgName(e.target.value);
                  if (!hasCustomOrgSlug)
                    setOrgSlug(createOrgSlug(e.target.value));
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
                value={orgSlug}
                onChange={(e) => {
                  // const re = /^[a-zA-Z0-9_]+$/;
                  setOrgSlug(e.target.value);
                  setHasCustomOrgSlug(e.target.value !== "");
                }}
                className="w-full"
              />
              {
                // error && (
                // <p className="text-red-700 text-sm" >
                // {/* {error} */}
                // </p>
                // )
              }
            </div>
          </div>

          {/* Org Address */}
          <div className="grid gap-2 w-full">
            <Label htmlFor="org-address" className="text-sm font-bold">
              Address
            </Label>
            <Command className="border" id="org-address">
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
              <CommandList>
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

          {/* Org Logo */}
          <OrgLogoUpload />

          {/* Settings */}
          <div className="w-full flex justify-between items-center border p-3 rounded-md">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="2fa" className="text-sm font-bold">
                Two-factor authentication
              </Label>
              <span className="text-xs text-muted-foreground">
                Require two-factor authentication (2FA) for users in your
                organization.
              </span>
            </div>
            <Switch
              id="2fa"
              checked={is2FARequired}
              onClick={() => {
                setIs2FARequired((prev) => !prev);
              }}
            />
          </div>

          <div className="flex grow items-end">
            <Button
              type="submit"
              className={`w-full ${
                isLoading &&
                "disabled:pointer-events-auto cursor-progress hover:bg-primary"
              }`}
              disabled={
                isLoading ||
                (isUpdating
                  ? orgLogo
                    ? false
                    : !orgName || !orgAddress || !orgSlug || !hasOrgUpdated
                  : !orgName || !orgAddress || !orgSlug)
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
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

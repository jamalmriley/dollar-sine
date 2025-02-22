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
import { Response } from "@/utils/api";

export default function CreateOrUpdateOrg() {
  const {
    orgLogo,
    setOrgLogo,
    isUpdatingOrg,
    setIsUpdatingOrg,
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

  const createOrgSlug = (text: string) =>
    text.replaceAll(" ", "-").toLowerCase();

  // TODO
  const validate = (value: string) => {
    // ^               ->  Assert the start of the string
    // (?![-_])        ->  Negative lookahead to assert that the string does not start with a hyphen or underscore.
    // (?!.*[-_]$)     ->  Negative lookahead to assert that the string does not end with a hyphen or underscore.
    // [a-zA-Z0-9-_]+  ->  Allowable characters
    // $               ->  Assert the end of the string
    const pattern = /^(?![-_])(?!.*[-_]$)[a-zA-Z0-9-_]+$/;
    return pattern.test(value);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    if (!isLoaded || !user) return;

    e.preventDefault();
    setIsLoading(true);

    const body: any = new FormData();
    await body.append("image", orgLogo || null);

    await fetch(
      `/api/organizations/create?orgName=${orgName}&orgSlug=${orgSlug}&userId=${user.id}&orgAddress=${orgAddress}&is2FARequired=${is2FARequired}`,
      {
        method: "POST",
        body,
      }
    )
      .then((res) => res.json())
      .then((json: Response) => {
        setOrgName("");
        setOrgAddress("");
        setOrgSlug("");
        setOrgLogo(undefined);
        setIs2FARequired(false);
        setIsLoading(false);
        setIsUpdatingOrg(false);

        toast({
          variant: json.success ? "default" : "destructive",
          title: json.message.title,
          description: json.message.description,
        });
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
        setIsUpdatingOrg(false);
      });
  };

  const organization =
    user && user.organizationMemberships.length > 0
      ? user.organizationMemberships[0].organization
      : undefined;
  const organizationId = organization?.id;
  const hasOrgUpdated: boolean = !organization
    ? false
    : organization.name !== orgName ||
      organization.slug !== orgSlug ||
      String(organization.publicMetadata.organizationAddress) !== orgAddress ||
      Boolean(organization.publicMetadata.is2FARequired) !== is2FARequired;

  useEffect(() => {
    const fetchPredictions = async () => {
      const predictions = await autocomplete(orgAddress);
      // console.log(predictions); // {description: string}[]
      setPredictions(predictions ?? []);
    };

    fetchPredictions();
  }, [orgAddress]);

  return (
    <form onSubmit={handleSubmit} className="w-full h-full flex flex-col gap-5">
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
              if (!hasCustomOrgSlug) setOrgSlug(createOrgSlug(e.target.value));
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
              const re = /^[a-zA-Z0-9_]+$/;
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
          className="w-full"
          disabled={
            isLoading ||
            (isUpdatingOrg
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
          {isUpdatingOrg
            ? isLoading
              ? "Updating organization..."
              : "Update organization"
            : isLoading
            ? "Creating organization..."
            : "Create organization"}
        </Button>
      </div>
    </form>
  );
}

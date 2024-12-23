"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateRandString } from "@/utils/general";
import { autocomplete } from "@/utils/google";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { parseAsBoolean, useQueryState } from "nuqs";
import { FormEventHandler, useEffect, useState } from "react";
import { VscDebugRestart } from "react-icons/vsc";
import { useMediaQuery } from "usehooks-ts";
import OrgLogoUpload from "./OrgLogoUpload";
import { useUser } from "@clerk/nextjs";
import { useActiveUserContext } from "@/contexts/active-user-context";
import { toast } from "@/hooks/use-toast";
import { useOnboardingContext } from "@/contexts/onboarding-context";

export default function CreateOrJoinOrg() {
  return (
    <Tabs defaultValue="create" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="create">Create</TabsTrigger>
        <TabsTrigger value="join">Join</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle>Create an organization</CardTitle>
            <CardDescription>
              Is your organization new to Dollar Sine? Add it now while
              finishing your onboarding.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <CreateOrgDrawerDialog />
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="join">
        <Card>
          <CardHeader>
            <CardTitle>Join an organization</CardTitle>
            <CardDescription>
              Does your organization already exist in Dollar Sine? Find and join
              it here.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <JoinOrgDrawerDialog />
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function CreateOrgDrawerDialog() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create new organization</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create new organization</DialogTitle>
            <DialogDescription>
              Add your organization info here.
            </DialogDescription>
          </DialogHeader>
          <CreateOrgForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Create new organization</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left px-5">
          <DrawerTitle>Create new organization</DrawerTitle>
          <DrawerDescription>
            Add your organization info here.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-5">
          <CreateOrgForm />
        </div>
        <DrawerFooter className="pt-3 px-5">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function CreateOrgForm() {
  const { setHasClickedOrTyped } = useActiveUserContext();
  const { orgLogo, setOrgLogo } = useOnboardingContext();
  const { user, isLoaded } = useUser();
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [showPredictions, setShowPredictions] = useState<boolean>(false);
  const [hasCustomOrgSlug, setHasCustomOrgSlug] = useState<boolean>(false);

  const [orgName, setOrgName] = useQueryState("orgName", {
    defaultValue: "",
  });

  const [orgAddress, setOrgAddress] = useQueryState("orgAddress", {
    defaultValue: "",
  });

  const [orgSlug, setOrgSlug] = useQueryState("orgSlug", {
    defaultValue: "",
  });

  const [orgJoinCode, setOrgJoinCode] = useQueryState("orgJoinCode", {
    defaultValue: "",
  });

  const [is2FARequired, setIs2FARequired] = useQueryState(
    "is2FARequired",
    parseAsBoolean.withDefault(false)
  );

  const createOrgSlug = (text: string) =>
    text.replaceAll(" ", "-").toLowerCase();

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
    e.preventDefault();
    if (!isLoaded || !user) return;

    const body: any = new FormData();
    await body.append("image", orgLogo);

    await fetch(
      `/api/organizations/create?orgName=${orgName}&orgSlug=${orgSlug}&userId=${user.id}&orgAddress=${orgAddress}&orgJoinCode=${orgJoinCode}&is2FARequired=${is2FARequired}`,
      {
        method: "POST",
        body,
      }
    )
      .then((res) => res.json())
      .then((json) => {
        setOrgName("");
        setOrgAddress("");
        setOrgSlug("");
        setOrgJoinCode("");
        setOrgLogo(undefined);
        setIs2FARequired(false);

        toast({
          variant: "default",
          title: json.message,
        });
      })
      .catch((err) => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Error creating organization",
        });
      });
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
    <form onSubmit={handleSubmit} className="w-full h-full flex flex-col gap-5">
      {/* Org Name */}
      <div className="grid gap-2 w-full">
        <Label htmlFor="org-name" className="text-sm font-bold">
          Organization Name
        </Label>
        <Input
          id="org-name"
          value={orgName}
          onChange={(e) => {
            setHasClickedOrTyped(true);
            setOrgName(e.target.value);
            if (!hasCustomOrgSlug) setOrgSlug(createOrgSlug(e.target.value));
          }}
          className="w-full"
        />
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
              setHasClickedOrTyped(true);
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

      {/* Org ID and Join Code */}
      {/* TODO: Validate these fields and make sure org ID isn't taken. If conditions aren't met, disable the button */}
      <div className="flex gap-5">
        {/* Org ID */}
        <div className="grid gap-2 w-full">
          <Label htmlFor="org-id" className="text-sm font-bold">
            Organization ID
          </Label>
          <Input
            id="org-id"
            value={orgSlug}
            onChange={(e) => {
              const re = /^[a-zA-Z0-9_]+$/;
              setHasClickedOrTyped(true);
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

        {/* Join Code */}
        <div className="grid gap-2 w-full">
          <Label htmlFor="join-code" className="text-sm font-bold">
            Join Code
          </Label>
          <div className="relative">
            <Input
              id="join-code"
              value={orgJoinCode}
              placeholder={generateRandString(6)}
              onChange={(e) => {
                setHasClickedOrTyped(true);
                setOrgJoinCode(e.target.value);
              }}
              className="w-full"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setOrgJoinCode(generateRandString(6))}
            >
              <VscDebugRestart className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Generate new join code</span>
            </Button>
          </div>
        </div>
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
            setHasClickedOrTyped(true);
            setIs2FARequired((prev) => !prev);
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={!orgName || !orgAddress || !orgSlug || !orgJoinCode}
      >
        Create organization
      </Button>
    </form>
  );
}

function JoinOrgDrawerDialog() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Join organization</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Join organization</DialogTitle>
            <DialogDescription>Find your organization here.</DialogDescription>
          </DialogHeader>
          <JoinOrgForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Join organization</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left px-5">
          <DrawerTitle>Join organization</DrawerTitle>
          <DrawerDescription>Find your organization here.</DrawerDescription>
        </DrawerHeader>
        <div className="px-5">
          <JoinOrgForm />
        </div>
        <DrawerFooter className="pt-3 px-5">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function JoinOrgForm() {
  const { setHasClickedOrTyped } = useActiveUserContext();
  const { user, isLoaded } = useUser();

  const [orgName, setOrgName] = useQueryState("orgName", {
    defaultValue: "",
  });

  const [orgJoinCode, setOrgJoinCode] = useQueryState("orgJoinCode", {
    defaultValue: "",
  });

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
    e.preventDefault();
    if (!isLoaded || !user) return;

    await fetch(
      `/api/organizations/create?&userId=${user.id}&orgName=${orgName}&orgJoinCode=${orgJoinCode}`,
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((json) => {
        setOrgName("");
        setOrgJoinCode("");

        toast({
          variant: "default",
          title: json.message,
        });
      })
      .catch((err) => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Error joining organization",
        });
      });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full h-full flex flex-col gap-5">
      {/* Org Name and Join Code */}
      {/* TODO: Validate these fields and make sure org ID isn't taken. If conditions aren't met, disable the button */}
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
              setHasClickedOrTyped(true);
              setOrgName(e.target.value);
            }}
            className="w-full"
          />
        </div>

        {/* Join Code */}
        <div className="grid gap-2 w-full">
          <Label htmlFor="join-code" className="text-sm font-bold">
            Join Code
          </Label>
          <Input
            id="join-code"
            value={orgJoinCode}
            placeholder="abc123"
            onChange={(e) => {
              setHasClickedOrTyped(true);
              setOrgJoinCode(e.target.value);
            }}
            className="w-full"
          />
        </div>
      </div>

      <Button type="submit" disabled={!orgName || !orgJoinCode}>
        Join organization
      </Button>
    </form>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { algoliasearch } from "algoliasearch";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import {
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch";

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const algoliaApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
const searchClient = algoliasearch(
  algoliaAppId as string,
  algoliaApiKey as string
);

export function OrgSearch() {
  const { showOrgResults, orgSearch, setOrgSearch } = useOnboardingContext();

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="organizations"
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Configure hitsPerPage={10} />
      <div className="ais-InstantSearch-inline">
        <ControlledSearchBox value={orgSearch} setValue={setOrgSearch} />
        {showOrgResults && (
          <EmptyQueryBoundary fallback={null}>
            <NoResultsBoundary fallback={<NoResults />}>
              <Hits
                hitComponent={Hit}
                classNames={{
                  list: "ais-Hits-list-inline",
                  item: "ais-Hits-item-inline",
                }}
              />
            </NoResultsBoundary>
          </EmptyQueryBoundary>
        )}
      </div>
    </InstantSearch>
  );
}

function ControlledSearchBox({
  value,
  setValue,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}) {
  const { orgSearch, setOrgSearch, setShowOrgResults } = useOnboardingContext();
  const { query, refine } = useSearchBox();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep Algolia's internal state in sync with `value` prop
  useEffect(() => {
    if (value !== query) {
      refine(value);
    }
  }, [value]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setShowOrgResults(true)}
        onBlur={() => setShowOrgResults(false)}
        placeholder="Search for an organization..."
        className={`border p-2 rounded-md text-xs ${orgSearch !== "" && "focus:rounded-b-none"}`}
      />

      {orgSearch !== "" && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={(e) => {
            e.preventDefault();
            setOrgSearch("");
            inputRef.current?.focus();
          }}
        >
          <MdClose className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Clear search bar</span>
        </Button>
      )}
    </div>
  );
}

function Hit({ hit }: { hit: any }) {
  const { setOrgSearch, setShowOrgResults } = useOnboardingContext();
  return (
    <Button
      variant="ghost"
      className="size-full flex flex-col items-start gap-1 rounded-none"
      onMouseDown={() => {
        setOrgSearch(hit.publicMetadata.slug);
        setShowOrgResults(false);
      }}
    >
      {/* Name and Slug */}
      <div className="flex gap-1.5 items-baseline">
        <div className="text-sm font-bold">
          <Highlight
            attribute="publicMetadata.name"
            hit={hit}
            classNames={{ highlighted: "highlighted-hits" }}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {"@"}
          <Highlight
            attribute="publicMetadata.slug"
            hit={hit}
            classNames={{ highlighted: "highlighted-hits" }}
          />
        </div>
      </div>

      {/* Category */}
      <div className="text-xs text-muted-foreground">
        <Highlight
          attribute="publicMetadata.category"
          hit={hit}
          classNames={{ highlighted: "highlighted-hits" }}
        />
      </div>
    </Button>
  );
}

function EmptyQueryBoundary({
  children,
  fallback,
}: {
  children: any;
  fallback: any;
}) {
  const { indexUiState } = useInstantSearch();

  if (!indexUiState.query) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
}

function NoResultsBoundary({
  children,
  fallback,
}: {
  children: any;
  fallback: any;
}) {
  const { results } = useInstantSearch();

  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
}

function NoResults() {
  const { indexUiState } = useInstantSearch();

  return (
    <div className="ais-Hits-list-inline flex-row justify-center text-xs text-muted-foreground p-3">
      No results for &quot;{indexUiState.query}&quot;
    </div>
  );
}

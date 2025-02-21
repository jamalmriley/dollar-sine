"use client";

import { Button } from "@/components/ui/button";
import { algoliasearch } from "algoliasearch";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import {
  Configure,
  Hits,
  InstantSearch,
  SearchBox,
  useInstantSearch,
} from "react-instantsearch";

export default function Pronouns() {
  const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const algoliaApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
  const searchClient = algoliasearch(
    algoliaAppId as string,
    algoliaApiKey as string
  );

  const [pronouns, setPronouns] = useQueryState("pronouns", {
    defaultValue: "",
  });

  const [showHits, setShowHits] = useState(false);
  // const esPronouns: string[] = ["ella", "elle", "elli", "su"];

  function Hit({ hit }: { hit: any }) {
    const pronoun = hit.name;

    return (
      <div>
        <button
          className={`${
            pronouns.split("/").indexOf(pronoun) !== -1
              ? "ais-Hits-item-inline-disabled"
              : "ais-Hits-item-inline"
          }`}
          disabled={pronouns.split("/").indexOf(pronoun) !== -1}
          onClick={() => {
            setPronouns((pronouns) =>
              [
                ...pronouns.split("/").filter((el: string) => el !== ""),
                pronoun,
              ].join("/")
            );
          }}
        >
          {pronoun}
        </button>
      </div>
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
      <div>
        <p>
          No results for <q>{indexUiState.query}</q>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-5 items-start">
        <div className="flex flex-col">
          <span
            className={`text-sm font-semibold ${
              pronouns !== "" ? "text-muted-foreground line-through" : ""
            }`}
          >
            Add your pronouns.
          </span>
          <span className="text-xs font-medium text-muted-foreground mb-2">
            Choose 2 or 3.
          </span>
        </div>

        {/* Pronoun Search */}
        <InstantSearch
          searchClient={searchClient}
          indexName="en-pronouns"
          future={{ preserveSharedStateOnUnmount: true }}
        >
          <Configure hitsPerPage={10} />
          <div className="ais-InstantSearch-inline">
            <SearchBox
              onFocus={() => setShowHits(true)}
              // onBlur={() => setShowHits(false)}
              classNames={{
                form: "relative",
                input: "inline-search-box",
                submitIcon: "inline-search-submit-icon",
                resetIcon: "inline-search-reset-icon",
              }}
              placeholder="Add your pronouns..."
            />
            {showHits && (
              <EmptyQueryBoundary fallback={null}>
                <NoResultsBoundary fallback={<NoResults />}>
                  <Hits
                    hitComponent={Hit}
                    classNames={{
                      list: "ais-Hits-list-inline",
                      item: "",
                    }}
                  />
                </NoResultsBoundary>
              </EmptyQueryBoundary>
            )}
          </div>
        </InstantSearch>
      </div>

      {/* Selected Pronouns */}
      {pronouns !== "" && (
        <div className="flex items-baseline px-3 py-2 border rounded-lg gap-2">
          <span className="text-xs font-semibold">My pronouns are:</span>
          {pronouns.split("/").map((pronoun) => (
            <span
              key={pronoun}
              className="chip flex justify-between items-center px-2 py-0.5 gap-2"
            >
              {pronoun}
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full w-auto h-auto p-0.5"
                onClick={() => {
                  const newPronouns = pronouns
                    .split("/")
                    .filter((el) => el !== pronoun)
                    .join("/");
                  setPronouns(newPronouns);
                }}
              >
                <MdClose />
              </Button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

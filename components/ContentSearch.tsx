/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from "@/components/ui/input";
import { Lesson } from "@/types/course";
import { algoliasearch } from "algoliasearch";
import { useQueryState } from "nuqs";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import {
  Hits,
  InstantSearch,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch";
import { useMediaQuery } from "usehooks-ts";
import { LessonCard } from "./LessonCard";

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const algoliaApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
const searchClient = algoliasearch(
  algoliaAppId as string,
  algoliaApiKey as string
);

export function ContentSearch() {
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const showResults = search.length > 0;

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="global-lessons-search"
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <div className="w-full flex flex-col gap-10">
        <ControlledSearchBox value={search} setValue={setSearch} />
        {showResults && (
          <EmptyQueryBoundary fallback={null}>
            <NoResultsBoundary fallback={<NoResults />}>
              <Hits
                hitComponent={Hit}
                classNames={{
                  list: "content-search-list",
                  // item: "content-search-item",
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { query, refine } = useSearchBox();
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setShowResults] = useState<boolean>(false);

  // Keep Algolia's internal state in sync with `value` prop
  useEffect(() => {
    if (value !== query) {
      refine(value);
    }
  }, [value]);

  return (
    <div className="relative">
      <IoSearchSharp className="absolute left-0 top-0 size-20 p-4" />
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setShowResults(true)}
        onBlur={() => setShowResults(false)}
        placeholder={
          isDesktop ? "Search for lessons, topics, and more..." : "Search..."
        }
        style={{ fontSize: "3rem" }}
        className="h-20 border-default py-2 pl-20 pr-3 rounded-lg font-extrabold bg-primary-foreground"
      />

      {value !== "" && (
        <button
          className="absolute right-0 top-0 size-20 flex items-center justify-center p-4 hover:bg-transparent"
          onClick={(e) => {
            e.preventDefault();
            setValue("");
            inputRef.current?.focus();
          }}
        >
          <MdClose className="size-full" />
          <span className="sr-only">Clear search bar</span>
        </button>
      )}
    </div>
  );
}

function Hit({ hit }: { hit: any }) {
  const lesson = hit as Lesson;
  return <LessonCard lesson={lesson} />;
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

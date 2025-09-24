/* eslint-disable @typescript-eslint/no-explicit-any */
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { useMediaQuery } from "usehooks-ts";
import Link from "next/link";
import {
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  SearchBox,
  useInstantSearch,
} from "react-instantsearch";
import { Lesson } from "@/types/course";
// import 'instantsearch.css/themes/satellite.css';

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const algoliaApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
const searchClient = algoliasearch(
  algoliaAppId as string,
  algoliaApiKey as string
);

function Hit({ hit }: { hit: any }) {
  const lesson = hit as Lesson;
  return (
    <Link href={`${lesson.pathname}`} className="flex flex-col gap-1">
      {/* Lesson Name */}
      <div className="font-bold text-sm">
        <Highlight
          attribute="name"
          hit={hit}
          classNames={{ highlighted: "highlighted-hits" }}
        />
      </div>

      {/* Lesson Number and Course Name */}
      <div className="flex gap-1.5 text-xs text-muted-foreground">
        {/* Lesson Number */}
        <div>
          <span>Lesson </span>
          <Highlight
            attribute="number"
            hit={hit}
            classNames={{ highlighted: "highlighted-hits" }}
          />
        </div>
        <span>|</span>
        {/* Course Name */}
        <div>
          <Highlight
            attribute="courseName"
            hit={hit}
            classNames={{ highlighted: "highlighted-hits" }}
          />
        </div>
      </div>

      {/* Lesson Description */}
      <div className="text-xs line-clamp-1">
        <Highlight
          attribute="description"
          hit={hit}
          classNames={{ highlighted: "highlighted-hits" }}
        />
      </div>

      {/* TODO: Only display for teacher/admin accounts. */}
      {lesson.standards && lesson.standards.length > 0 && (
        <div className="flex gap-3 mt-3">
          {lesson.standards.map((standard) => (
            <div key={standard.id} className="badge-2">
              {standard.id}
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}

export default function Search() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="global-lessons-search"
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Configure hitsPerPage={10} />
      <div className="ais-InstantSearch">
        {/* <div> */}
        <SearchBox
          classNames={{
            form: "relative",
            input: "search-box",
            submitIcon: "search-submit-icon",
            resetIcon: "search-reset-icon",
          }}
          placeholder={
            isDesktop ? "Search for lessons, topics, and more..." : "Search..."
          }
        />
        <EmptyQueryBoundary fallback={null}>
          <NoResultsBoundary fallback={<NoResults />}>
            <Hits
              hitComponent={Hit}
              classNames={{
                list: "ais-Hits-list-global",
                item: "ais-Hits-item-global",
              }}
            />
          </NoResultsBoundary>
        </EmptyQueryBoundary>
      </div>
    </InstantSearch>
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

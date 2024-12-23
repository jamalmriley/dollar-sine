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
// import 'instantsearch.css/themes/satellite.css';

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const algoliaApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
const searchClient = algoliasearch(
  algoliaAppId as string,
  algoliaApiKey as string
);

function Hit({ hit }: { hit: any }) {
  return (
    <Link href={`${hit.pathname}`} className="flex flex-col gap-1">
      <div className="hit-name font-bold">
        <Highlight
          attribute="name"
          hit={hit}
          classNames={{ highlighted: "highlighted-hits" }}
        />
      </div>

      <div className="hit-description text-xs">
        <Highlight
          attribute="description"
          hit={hit}
          classNames={{ highlighted: "highlighted-hits" }}
        />
      </div>
      {/* TODO: Only display for teacher/admin accounts. */}
      {hit.standards.filter((standard: string) => standard !== "").length >
        0 && (
        <div className="flex gap-3 mt-3">
          {hit.standards.map((standard: string, i: number) => (
            <div key={i} className="badge-2">
              {standard}
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
      indexName="test-search-data"
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
            isDesktop ? "Search for a lesson or topic..." : "Search..."
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

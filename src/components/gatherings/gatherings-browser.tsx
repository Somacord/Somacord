"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterPill } from "@/components/ui/filter-pill";
import { GatheringCard } from "@/components/ui/gathering-card";
import { Input } from "@/components/ui/input";
import { getGatheringHref, type MockGathering } from "@/data/gatherings";

type FilterKey = "all" | "speed-connect" | "community" | "partner";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "speed-connect", label: "Speed Connect" },
  { key: "community", label: "Community-created" },
  { key: "partner", label: "Partner experiences" },
];

function matchesFilter(gathering: MockGathering, filter: FilterKey) {
  if (filter === "all") return true;
  if (filter === "speed-connect") return gathering.category === "Start here";
  if (filter === "community") return gathering.category === "Community";
  return gathering.category === "Partner";
}

export interface GatheringsBrowserProps {
  gatherings: MockGathering[];
}

/**
 * Client-side search + category filter pills over the gatherings list —
 * docs/design/website-mockups.md ("Gatherings (discovery)"). All data is
 * passed in from the server as static, approved example content.
 */
export function GatheringsBrowser({ gatherings }: GatheringsBrowserProps) {
  const [query, setQuery] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<FilterKey>("all");

  const results = gatherings.filter((gathering) => {
    if (!matchesFilter(gathering, activeFilter)) return false;
    if (!query.trim()) return true;
    const haystack =
      `${gathering.title} ${gathering.shortDescription} ${gathering.location}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2.5">
          {filters.map((filter) => (
            <FilterPill
              key={filter.key}
              active={activeFilter === filter.key}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </FilterPill>
          ))}
        </div>
        <Input
          type="search"
          placeholder="Search gatherings…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="sm:max-w-[240px]"
          aria-label="Search gatherings"
        />
      </div>

      {results.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((gathering) => (
            <GatheringCard
              key={gathering.slug}
              title={gathering.title}
              description={gathering.shortDescription}
              category={gathering.category}
              imageSrc={gathering.imageSrc}
              imageAlt={gathering.imageAlt}
              meta={[`📍 ${gathering.location}`, `🗓 ${gathering.schedule}`]}
              href={getGatheringHref(gathering)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No gatherings match yet"
          description="Try a different category or search term — or start with a free Speed Connect while you wait for the right gathering to come along."
          action={
            <Button
              variant="secondary-light"
              onClick={() => {
                setQuery("");
                setActiveFilter("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      )}
    </div>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { DestinationCard } from "@/components/shared/DestinationCard";
import { CountryFlagCards, buildCountryOptions } from "@/components/shared/CountryFlagCards";
import { PackageCard } from "@/domains/packages/components/PackageCard";
import type { Destination, TourPackage } from "@/lib/content/types";

type Props =
  | { destinations: Destination[]; packages?: never }
  | { packages: TourPackage[]; destinations?: never };

export function DiscoveryGrid(props: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const isDestinations = !!props.destinations;
  const records = props.destinations || props.packages || [];

  const categoryOptions = [
    ...new Set(
      records
        .map((r) => ("category" in r ? r.category : undefined))
        .filter((v): v is string => !!v),
    ),
  ].sort();
  // Packages get proper flag cards; destinations keep the plain select because
  // their categories are not always countries.
  const countryOptions = !isDestinations
    ? buildCountryOptions(records as TourPackage[])
    : [];
  const durationOptions = !isDestinations
    ? [...new Set(records.map((r) => (r as TourPackage).duration).filter((v): v is string => !!v))].sort()
    : [];

  const results = records.filter((r) => {
    const title = "name" in r ? r.name : r.title;
    const description = "description" in r ? r.description : r.overview;
    const matchesCategory = !category || ("category" in r && (r.category || "") === category);
    const matchesDuration = !duration || ("duration" in r && (r.duration || "") === duration);
    const matchesQuery = `${title} ${description} ${r.location || ""}`
      .toLowerCase()
      .includes(query.toLowerCase().trim());
    return matchesCategory && matchesDuration && matchesQuery;
  });

  return (
    <div>
      {countryOptions.length > 0 && (
        <div className="mb-8">
          <CountryFlagCards
            options={countryOptions}
            selected={category}
            onSelect={(c) => {
              setCategory(c);
              setQuery("");
            }}
          />
        </div>
      )}
      <div className="discovery-toolbar">
        <label htmlFor="discovery-search">
          Find your {isDestinations ? "destination" : "journey"}
          <input
            id="discovery-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isDestinations ? "Search destinations…" : "Search tours, places, experiences…"}
          />
        </label>
        {categoryOptions.length > 1 && isDestinations && (
          <label htmlFor="discovery-category">
            Explore by category
            <select id="discovery-category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">{isDestinations ? "All destinations" : "All countries"}</option>
              {categoryOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        )}
        {durationOptions.length > 1 && (
          <label htmlFor="discovery-duration">
            Filter by duration
            <select id="discovery-duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="">All journeys</option>
              {durationOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        )}
        <p className="discovery-results" aria-live="polite">
          {results.length} {isDestinations ? "destinations" : "journeys"} to explore
        </p>
      </div>
      {results.length ? (
        <div className="discovery-grid">
          {results.map((r) =>
            "name" in r ? (
              <DestinationCard key={r.slug} destination={r} />
            ) : (
              <PackageCard key={r.slug} pkg={r} />
            )
          )}
        </div>
      ) : (
        <div className="discovery-empty">
          <h2>{records.length ? "A different path awaits." : "Let's create a journey for you."}</h2>
          <p className="mt-4">
            {records.length
              ? "Try another search or explore the full collection."
              : "Tell us your interests and we'll help you plan your trip."}
          </p>
          {records.length ? (
            <button
              className="safari-button mt-6"
              onClick={() => {
                setQuery("");
                setCategory("");
                setDuration("");
              }}
            >
              Clear filters
            </button>
          ) : (
            <Link className="safari-button mt-6" href="/plan-your-trip">
              Plan Your Trip
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Search, SlidersHorizontal } from "lucide-react";

import { getAllMatches } from "@/features/matches/services/matchApi";
import { AdminMatchCard } from "./AdminMatchCard";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Match = {
    id: number;
    match_no: number;
    team_a: string | null;
    team_b: string | null;
    team_a_placeholder: string | null;
    team_b_placeholder: string | null;
    match_date: string;
    match_time: string;
    stage: "group" | "knockout";
    round_name: string;
    group_name: string | null;
    venue: string;
    status: string;
    actual_team_a_score: number | null;
    actual_team_b_score: number | null;
    actual_qualifier: string | null;
};

const getDateOnly = (dateValue: string) => {
    if (!dateValue) return "";
    return dateValue.slice(0, 10);
};

export const AdminMatchList = () => {
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [stageFilter, setStageFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");

    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-matches"],
        queryFn: getAllMatches,
    });

    const filteredMatches = useMemo(() => {
        if (!data) return [];

        return data.filter((match: Match) => {
            const searchableText = [
                match.team_a,
                match.team_b,
                match.team_a_placeholder,
                match.team_b_placeholder,
                match.round_name,
                match.group_name,
                match.venue,
                String(match.match_no),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch = searchableText.includes(searchText.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || match.status === statusFilter;

            const matchesStage = stageFilter === "all" || match.stage === stageFilter;

            const matchDateOnly = getDateOnly(match.match_date);
            const matchesDate = !dateFilter || matchDateOnly === dateFilter;

            return matchesSearch && matchesStatus && matchesStage && matchesDate;
        });
    }, [data, searchText, statusFilter, stageFilter, dateFilter]);

    const resetFilters = () => {
        setSearchText("");
        setStatusFilter("all");
        setStageFilter("all");
        setDateFilter("");
    };

    if (isLoading) {
        return (
            <div className="dark-panel p-8 text-center text-muted-foreground">
                Loading matches...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-3xl border border-destructive/40 bg-card/80 p-8 text-center text-destructive">
                Failed to load matches.
            </div>
        );
    }

    return (
        <section className="space-y-5">
            <div className="dark-panel p-5">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-secondary">
                            <SlidersHorizontal className="h-5 w-5 text-emerald-400" />
                        </div>

                        <div>
                            <h2 className="font-heading text-xl font-black">
                                Fixture Control
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Search, filter, and manage all tournament matches.
                            </p>
                        </div>
                    </div>

                    <div className="hidden rounded-full border bg-secondary/40 px-3 py-1 text-xs font-semibold text-muted-foreground md:block">
                        Showing {filteredMatches.length} of {data?.length || 0}
                    </div>
                </div>

                <div className="grid gap-3 md:grid-cols-5">
                    <div className="relative md:col-span-2">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search team, match no, venue..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="soft-input h-11 pl-9"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-11 rounded-2xl border bg-background/60 px-3 py-2 text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                        <option value="live">Live</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <select
                        value={stageFilter}
                        onChange={(e) => setStageFilter(e.target.value)}
                        className="h-11 rounded-2xl border bg-background/60 px-3 py-2 text-sm"
                    >
                        <option value="all">All Stage</option>
                        <option value="group">Group</option>
                        <option value="knockout">Knockout</option>
                    </select>

                    <Input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="soft-input h-11"
                    />
                </div>

                <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <p className="text-sm text-muted-foreground">
                        {filteredMatches.length} matches match your filters.
                    </p>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        className="smooth-button rounded-full"
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        Reset Filters
                    </Button>
                </div>
            </div>

            {filteredMatches.length === 0 ? (
                <div className="dark-panel p-8 text-center text-muted-foreground">
                    No matches found with selected filters.
                </div>
            ) : (
                <div className="grid gap-5">
                    {filteredMatches.map((match: Match) => (
                        <AdminMatchCard key={match.id} match={match} />
                    ))}
                </div>
            )}
        </section>
    );
};
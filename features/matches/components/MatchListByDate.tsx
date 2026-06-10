"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    CalendarDays,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Filter,
    RotateCcw,
    Search,
} from "lucide-react";

import { api } from "@/lib/axios";
import { getStoredToken } from "@/lib/auth";
import { getMyPredictions } from "@/features/predictions/services/predictionApi";

import { MatchCard } from "./MatchCard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MATCHES_PER_PAGE = 8;

const getAllMatches = async () => {
    const response = await api.get("/matches");
    return response.data.data;
};

export const MatchListByDate = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [stageFilter, setStageFilter] = useState("all");
    const [selectedDate, setSelectedDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const token = getStoredToken();

    const {
        data: matches,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["matches"],
        queryFn: getAllMatches,
    });

    const { data: myPredictions } = useQuery({
        queryKey: ["my-predictions"],
        queryFn: getMyPredictions,
        enabled: Boolean(token),
    });

    const findPredictionForMatch = (matchId: number) => {
        return myPredictions?.find(
            (prediction: any) => prediction.match_id === matchId,
        );
    };

    const filteredMatches = useMemo(() => {
        const allMatches = matches || [];
        const searchValue = search.toLowerCase().trim();

        return allMatches.filter((match: any) => {
            const matchesSearch =
                !searchValue ||
                match.team_a?.toLowerCase().includes(searchValue) ||
                match.team_b?.toLowerCase().includes(searchValue) ||
                match.team_a_placeholder?.toLowerCase().includes(searchValue) ||
                match.team_b_placeholder?.toLowerCase().includes(searchValue) ||
                match.group_name?.toLowerCase().includes(searchValue) ||
                match.round_name?.toLowerCase().includes(searchValue) ||
                match.venue?.toLowerCase().includes(searchValue) ||
                String(match.match_no || "").includes(searchValue);

            const matchesStatus =
                statusFilter === "all" || match.status === statusFilter;

            const matchesStage =
                stageFilter === "all" || match.stage === stageFilter;

            const matchDate = match.match_date?.split("T")[0];

            const matchesDate = !selectedDate || matchDate === selectedDate;

            return matchesSearch && matchesStatus && matchesStage && matchesDate;
        });
    }, [matches, search, statusFilter, stageFilter, selectedDate]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredMatches.length / MATCHES_PER_PAGE),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const startIndex = (safeCurrentPage - 1) * MATCHES_PER_PAGE;
    const endIndex = startIndex + MATCHES_PER_PAGE;

    const paginatedMatches = filteredMatches.slice(startIndex, endIndex);

    const scrollToResults = () => {
        setTimeout(() => {
            const section = document.getElementById("match-results");
            section?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };

    const resetToFirstPage = () => {
        setCurrentPage(1);
        scrollToResults();
    };

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("all");
        setStageFilter("all");
        setSelectedDate("");
        setCurrentPage(1);
        scrollToResults();
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
        scrollToResults();
    };

    const getPageNumbers = () => {
        const pages: number[] = [];

        const start = Math.max(1, safeCurrentPage - 2);
        const end = Math.min(totalPages, safeCurrentPage + 2);

        for (let page = start; page <= end; page++) {
            pages.push(page);
        }

        return pages;
    };

    return (
        <section className="space-y-5">
            {/* Sticky Filter + Pagination Wrapper */}
            <div className="sticky top-20 z-30 space-y-3">
                {/* Filter Panel */}
                <div className="dark-panel p-4 backdrop-blur-xl md:p-5">
                    <div className="flex flex-col gap-4 md:mb-5 md:flex-row md:items-start md:justify-between">
                        <div>
                            <h2 className="font-heading text-2xl font-black md:text-3xl">
                                Prediction Center
                            </h2>

                            <p className="mt-1 hidden text-sm text-muted-foreground md:block">
                                Search, filter, and find tournament matches.
                            </p>
                        </div>

                        <div className="flex items-center justify-between gap-3 md:block">
                            <div className="rounded-2xl border bg-background/50 px-4 py-2 text-sm font-bold">
                                Showing {paginatedMatches.length} of {filteredMatches.length}
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsFilterOpen((prev) => !prev)}
                                className="h-10 rounded-full md:hidden"
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                Filter
                                <ChevronDown
                                    className={`ml-2 h-4 w-4 transition ${isFilterOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </Button>
                        </div>
                    </div>

                    <div
                        className={`mt-4 space-y-3 md:mt-0 md:block md:space-y-4 ${isFilterOpen ? "block" : "hidden"
                            }`}
                    >
                        <div className="grid gap-3 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        resetToFirstPage();
                                    }}
                                    placeholder="Search team, match no, venue..."
                                    className="soft-input h-11 pl-11"
                                />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    resetToFirstPage();
                                }}
                                className="h-11 rounded-2xl border bg-background px-4 text-sm font-semibold outline-none"
                            >
                                <option value="all">All Matches</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="live">Live</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>

                            <select
                                value={stageFilter}
                                onChange={(e) => {
                                    setStageFilter(e.target.value);
                                    resetToFirstPage();
                                }}
                                className="h-11 rounded-2xl border bg-background px-4 text-sm font-semibold outline-none"
                            >
                                <option value="all">All Stage</option>
                                <option value="group">Group</option>
                                <option value="knockout">Knockout</option>
                            </select>

                            <div className="relative">
                                <Input
                                    id="fixture-date-input"
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        resetToFirstPage();
                                    }}
                                    className="soft-input h-11 pr-11 text-foreground [color-scheme:dark]"
                                />

                                <CalendarDays
                                    onClick={() => {
                                        const input = document.getElementById(
                                            "fixture-date-input",
                                        ) as HTMLInputElement;

                                        input?.showPicker?.();
                                        input?.focus();
                                    }}
                                    className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-emerald-400"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <p className="text-sm text-muted-foreground">
                                {filteredMatches.length} matches match your filters.
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        refetch();
                                        scrollToResults();
                                    }}
                                    className="h-10 rounded-full"
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    Search
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resetFilters}
                                    className="h-10 rounded-full"
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pagination Panel */}
                {!isLoading && filteredMatches.length > 0 && (
                    <div className="dark-panel flex flex-col gap-3 border bg-background/90 p-3 shadow-xl backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-4">
                        <p className="text-center text-xs text-muted-foreground md:text-left md:text-sm">
                            Page {safeCurrentPage} of {totalPages} • Showing{" "}
                            {startIndex + 1}-{Math.min(endIndex, filteredMatches.length)} of{" "}
                            {filteredMatches.length}
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={safeCurrentPage === 1}
                                onClick={() => goToPage(safeCurrentPage - 1)}
                                className="h-9 rounded-full px-3 md:h-10"
                            >
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                Prev
                            </Button>

                            {safeCurrentPage > 3 && (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => goToPage(1)}
                                        className="h-9 w-9 rounded-full p-0 md:h-10 md:w-10"
                                    >
                                        1
                                    </Button>

                                    <span className="px-1 text-muted-foreground">...</span>
                                </>
                            )}

                            {getPageNumbers().map((page) => (
                                <Button
                                    key={page}
                                    type="button"
                                    variant={page === safeCurrentPage ? "default" : "outline"}
                                    onClick={() => goToPage(page)}
                                    className="h-9 w-9 rounded-full p-0 text-sm font-bold md:h-10 md:w-10"
                                >
                                    {page}
                                </Button>
                            ))}

                            {safeCurrentPage < totalPages - 2 && (
                                <>
                                    <span className="px-1 text-muted-foreground">...</span>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => goToPage(totalPages)}
                                        className="h-9 w-9 rounded-full p-0 md:h-10 md:w-10"
                                    >
                                        {totalPages}
                                    </Button>
                                </>
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                disabled={safeCurrentPage === totalPages}
                                onClick={() => goToPage(safeCurrentPage + 1)}
                                className="h-9 rounded-full px-3 md:h-10"
                            >
                                Next
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="dark-panel p-8 text-center text-muted-foreground">
                    Loading matches...
                </div>
            )}

            {isError && (
                <div className="rounded-3xl border border-destructive/40 bg-card/80 p-8 text-center text-destructive">
                    Failed to load matches. Try again.
                </div>
            )}

            {!isLoading && filteredMatches.length === 0 && (
                <div className="dark-panel p-8 text-center text-muted-foreground">
                    <p className="font-bold">No matches found.</p>
                    <p className="mt-1 text-sm">
                        Try changing your search, date, or filters.
                    </p>
                </div>
            )}

            <div
                id="match-results"
                className="grid gap-5 scroll-mt-[330px] md:scroll-mt-[350px]"
            >
                {paginatedMatches.map((match: any) => (
                    <MatchCard
                        key={match.id}
                        match={match}
                        existingPrediction={findPredictionForMatch(match.id)}
                    />
                ))}
            </div>
        </section>
    );
};
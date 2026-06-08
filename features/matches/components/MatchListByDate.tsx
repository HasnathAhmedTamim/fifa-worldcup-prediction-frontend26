"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarSearch, Search } from "lucide-react";

import { getMatchesByDate } from "../services/matchApi";
import { getMyPredictions } from "@/features/predictions/services/predictionApi";
import { MatchCard } from "./MatchCard";
import { getStoredToken } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const MatchListByDate = () => {
    const [selectedDate, setSelectedDate] = useState("2026-06-12");

    const token = getStoredToken();

    const {
        data: matches,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["matches-by-date", selectedDate],
        queryFn: () => getMatchesByDate(selectedDate),
    });

    const { data: myPredictions } = useQuery({
        queryKey: ["my-predictions"],
        queryFn: getMyPredictions,
        enabled: Boolean(token),
    });

    const findPredictionForMatch = (matchId: number) => {
        return myPredictions?.find(
            (prediction: any) => prediction.match_id === matchId
        );
    };

    return (
        <section className="space-y-5">
            <div className="dark-panel p-5">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border bg-secondary/50 px-3 py-1 text-xs font-semibold text-muted-foreground">
                            <CalendarSearch className="h-3.5 w-3.5 text-emerald-400" />
                            Match Center
                        </div>

                        <div>
                            <h2 className="font-heading text-2xl font-black md:text-3xl">
                                Fixtures by Date
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Select a Bangladesh date and submit or update your prediction.
                            </p>
                        </div>
                    </div>

                    <div className="flex w-full gap-2 md:w-auto">
                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="soft-input h-11 md:w-48"
                        />

                        <Button
                            onClick={() => refetch()}
                            className="smooth-button h-11 rounded-full"
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>
                    </div>
                </div>
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

            {!isLoading && matches?.length === 0 && (
                <div className="dark-panel p-8 text-center text-muted-foreground">
                    No matches found for this date.
                </div>
            )}

            <div className="grid gap-5">
                {matches?.map((match: any) => (
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
"use client";

import { useQuery } from "@tanstack/react-query";
import { Flame } from "lucide-react";

import { getPredictionTicker } from "../services/predictionApi";

export const PredictionTicker = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["prediction-ticker"],
        queryFn: getPredictionTicker,
        refetchInterval: 10000,
    });

    if (isLoading || isError) {
        return null;
    }

    if (!data?.match) {
        return null;
    }

    const match = data.match;
    const predictions = data.predictions || [];

    const teamA = match.team_a || match.team_a_placeholder || "TBD";
    const teamB = match.team_b || match.team_b_placeholder || "TBD";

    const tickerItems =
        predictions.length > 0
            ? predictions.map((prediction: any) => {
                return `${prediction.user_name} says ${teamA} ${prediction.predicted_team_a_score} - ${prediction.predicted_team_b_score} ${teamB}`;
            })
            : [`No predictions yet for ${teamA} vs ${teamB}`];

    return (
        <div className="overflow-hidden rounded-3xl border bg-card/80 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-3 whitespace-nowrap">
                <div className="z-10 flex shrink-0 items-center gap-2 border-r bg-background px-4 py-3 text-sm font-black text-emerald-400">
                    <Flame className="h-4 w-4" />
                    Prediction Buzz
                </div>

                <div className="ticker-track flex min-w-max gap-8 py-3 text-sm font-semibold">
                    {[...tickerItems, ...tickerItems, ...tickerItems].map(
                        (item, index) => (
                            <span key={`${item}-${index}`} className="text-muted-foreground">
                                🔥 {item}
                            </span>
                        ),
                    )}
                </div>
            </div>
        </div>
    );
};
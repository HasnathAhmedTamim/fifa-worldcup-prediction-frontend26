"use client";

import { useQuery } from "@tanstack/react-query";
import { Flame } from "lucide-react";

import { getPredictionTicker } from "../services/predictionApi";

type Prediction = {
    user_name: string;
    predicted_team_a_score: number;
    predicted_team_b_score: number;
    predicted_qualifier?: string | null;
};

type Match = {
    team_a?: string | null;
    team_b?: string | null;
    team_a_placeholder?: string | null;
    team_b_placeholder?: string | null;
};

type PredictionTickerItem = {
    match: Match;
    predictions: Prediction[];
};

export const PredictionTicker = () => {
    const { data, isLoading, isError } = useQuery<PredictionTickerItem[]>({
        queryKey: ["prediction-ticker"],
        queryFn: getPredictionTicker,
        refetchInterval: 10000,
    });

    if (isLoading || isError || !data || data.length === 0) {
        return null;
    }

    const tickerItems: string[] = [];

    data.forEach((ticker) => {
        const { match, predictions } = ticker;

        const teamA = match.team_a || match.team_a_placeholder || "TBD";
        const teamB = match.team_b || match.team_b_placeholder || "TBD";

        if (predictions.length === 0) {
            tickerItems.push(`No predictions yet for ${teamA} vs ${teamB}`);
            return;
        }

        predictions.forEach((prediction) => {
            let text = `${prediction.user_name} predicts ${teamA} ${prediction.predicted_team_a_score}-${prediction.predicted_team_b_score} ${teamB}`;

            if (prediction.predicted_qualifier) {
                text += ` • Qualifier: ${prediction.predicted_qualifier}`;
            }

            tickerItems.push(text);
        });
    });

    if (tickerItems.length === 0) {
        return null;
    }

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
                            <span
                                key={`ticker-${index}`}
                                className="text-muted-foreground"
                            >
                                🔥 {item}
                            </span>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
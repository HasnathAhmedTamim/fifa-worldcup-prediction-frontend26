"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, UserRoundCheck } from "lucide-react";
import { getMatchPredictions } from "../services/adminApi";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
    matchId: number;
};

type Prediction = {
    prediction_id: number;
    user_name: string;
    user_email: string;
    predicted_team_a_score: number;
    predicted_team_b_score: number;
    predicted_qualifier: string | null;
    points: number;
    is_exact_score: boolean;
    is_correct_winner: boolean;
    is_correct_qualifier: boolean;
};

type MatchPredictionsResponse = {
    match: {
        status: string;
    };
    total_predictions: number;
    predictions: Prediction[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

const getPredictionBadge = (prediction: Prediction, matchStatus: string) => {
    if (prediction.is_exact_score) {
        return <Badge>Exact Score</Badge>;
    }

    if (prediction.is_correct_winner) {
        return <Badge variant="secondary">Correct Winner</Badge>;
    }

    if (prediction.is_correct_qualifier) {
        return <Badge variant="secondary">Correct Qualifier</Badge>;
    }

    if (matchStatus === "completed") {
        return <Badge variant="destructive">Wrong</Badge>;
    }

    return <Badge variant="outline">Pending</Badge>;
};

export const MatchPredictionsPanel = ({ matchId }: Props) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data, isLoading, isError } = useQuery<MatchPredictionsResponse>({
        queryKey: ["admin-match-predictions", matchId, page, limit],
        queryFn: () => getMatchPredictions({ matchId, page, limit }),
    });

    const predictions = data?.predictions || [];
    const meta = data?.meta;

    const handleLimitChange = (value: string) => {
        setLimit(Number(value));
        setPage(1);
    };

    const goToPreviousPage = () => {
        setPage((current) => Math.max(current - 1, 1));
    };

    const goToNextPage = () => {
        if (!meta) return;
        setPage((current) => Math.min(current + 1, meta.totalPages));
    };

    if (isLoading) {
        return (
            <div className="dark-panel p-6 text-center text-muted-foreground">
                Loading predictions...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-3xl border border-destructive/40 bg-card/80 p-6 text-center text-destructive">
                Failed to load predictions.
            </div>
        );
    }

    if (!data || predictions.length === 0) {
        return (
            <Card className="modern-card">
                <CardContent className="py-8">
                    <p className="text-center text-sm text-muted-foreground">
                        No users predicted this match yet.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="form-panel space-y-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-secondary">
                        <BarChart3 className="h-5 w-5 text-emerald-400" />
                    </div>

                    <div>
                        <p className="font-heading font-bold">User Predictions</p>
                        <p className="text-xs text-muted-foreground">
                            Showing {predictions.length} of {meta?.total || 0} predictions.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Rows</span>

                    <select
                        value={limit}
                        onChange={(e) => handleLimitChange(e.target.value)}
                        className="h-10 rounded-2xl border bg-background/60 px-3 py-2 text-sm"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>

                    <Badge variant="secondary" className="rounded-full">
                        Total: {data.total_predictions}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-3">
                {predictions.map((prediction) => (
                    <div
                        key={prediction.prediction_id}
                        className="rounded-3xl border bg-background/40 p-4 transition hover:bg-background/60"
                    >
                        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_0.6fr_1fr] md:items-center">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-secondary">
                                    <UserRoundCheck className="h-5 w-5 text-emerald-400" />
                                </div>

                                <div>
                                    <p className="font-semibold">{prediction.user_name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {prediction.user_email}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-muted-foreground">
                                    Prediction
                                </p>
                                <p className="font-heading text-xl font-black">
                                    {prediction.predicted_team_a_score} -{" "}
                                    {prediction.predicted_team_b_score}
                                </p>

                                {prediction.predicted_qualifier && (
                                    <p className="text-xs text-muted-foreground">
                                        Qualifier: {prediction.predicted_qualifier}
                                    </p>
                                )}
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-muted-foreground">
                                    Points
                                </p>
                                <p
                                    className={`font-heading text-xl font-black ${prediction.points < 0
                                            ? "text-destructive"
                                            : "text-emerald-400"
                                        }`}
                                >
                                    {prediction.points}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {getPredictionBadge(prediction, data.match.status)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col justify-between gap-3 border-t pt-4 md:flex-row md:items-center">
                <p className="text-sm text-muted-foreground">
                    Page {meta?.page || 1} of {meta?.totalPages || 1}
                </p>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={goToPreviousPage}
                        disabled={!meta || meta.page <= 1}
                        className="smooth-button rounded-full"
                    >
                        Previous
                    </Button>

                    <Button
                        variant="outline"
                        onClick={goToNextPage}
                        disabled={!meta || meta.page >= meta.totalPages}
                        className="smooth-button rounded-full"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};
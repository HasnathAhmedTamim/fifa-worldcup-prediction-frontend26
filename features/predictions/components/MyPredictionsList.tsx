"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays, MapPin, Target } from "lucide-react";
import { getMyPredictions } from "../services/predictionApi";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Prediction = {
    id: number;
    match_id: number;
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
    predicted_team_a_score: number;
    predicted_team_b_score: number;
    predicted_qualifier: string | null;
    actual_team_a_score: number | null;
    actual_team_b_score: number | null;
    actual_qualifier: string | null;
    points: number;
    is_exact_score: boolean;
    is_correct_winner: boolean;
    is_correct_qualifier: boolean;
};

const getDateOnly = (date: string) => date?.slice(0, 10);

const getPredictionBadge = (prediction: Prediction) => {
    if (prediction.is_exact_score) {
        return <Badge>Exact Score</Badge>;
    }

    if (prediction.is_correct_winner) {
        return <Badge variant="secondary">Correct Winner</Badge>;
    }

    if (prediction.is_correct_qualifier) {
        return <Badge variant="secondary">Correct Qualifier</Badge>;
    }

    if (prediction.status === "completed") {
        return <Badge variant="destructive">Wrong</Badge>;
    }

    return <Badge variant="outline">Pending</Badge>;
};

export const MyPredictionsList = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["my-predictions"],
        queryFn: getMyPredictions,
    });

    if (isLoading) {
        return (
            <div className="dark-panel p-8 text-center text-muted-foreground">
                Loading your predictions...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-3xl border border-destructive/40 bg-card/80 p-8 text-center text-destructive">
                Failed to load predictions. Please login again.
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card className="modern-card">
                <CardContent className="py-10">
                    <p className="text-center text-muted-foreground">
                        You have not submitted any prediction yet.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-5">
            {data.map((prediction: Prediction) => {
                const teamA = prediction.team_a || prediction.team_a_placeholder || "TBD";
                const teamB = prediction.team_b || prediction.team_b_placeholder || "TBD";

                const actualResult =
                    prediction.actual_team_a_score !== null &&
                        prediction.actual_team_b_score !== null
                        ? `${prediction.actual_team_a_score} - ${prediction.actual_team_b_score}`
                        : "Not updated";

                return (
                    <Card key={prediction.id} className="modern-card overflow-hidden">
                        <CardContent className="p-0">
                            <div className="grid gap-0 lg:grid-cols-[1fr_0.85fr]">
                                <div className="space-y-5 p-5 md:p-6">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge
                                            variant={
                                                prediction.status === "completed"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className="capitalize"
                                        >
                                            {prediction.status}
                                        </Badge>

                                        <Badge variant="outline" className="capitalize">
                                            {prediction.stage}
                                        </Badge>

                                        {prediction.group_name && (
                                            <Badge variant="secondary">{prediction.group_name}</Badge>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-muted-foreground">
                                            Match {prediction.match_no} • {prediction.round_name}
                                        </p>

                                        <h3 className="mt-2 font-heading text-2xl font-black">
                                            {teamA} <span className="text-muted-foreground">vs</span>{" "}
                                            {teamB}
                                        </h3>
                                    </div>

                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div className="flex items-center gap-2 rounded-2xl border bg-background/40 p-3 text-sm text-muted-foreground">
                                            <CalendarDays className="h-4 w-4 text-emerald-400" />
                                            <span>
                                                {getDateOnly(prediction.match_date)} at{" "}
                                                {prediction.match_time}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 rounded-2xl border bg-background/40 p-3 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4 text-emerald-400" />
                                            <span>{prediction.venue}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t bg-background/25 p-5 md:p-6 lg:border-l lg:border-t-0">
                                    <div className="mb-4 flex items-center gap-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-card">
                                            <Target className="h-5 w-5 text-emerald-400" />
                                        </div>

                                        <div>
                                            <p className="font-heading font-bold">
                                                Prediction Summary
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Points update after result
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-3">
                                        <div className="rounded-3xl border bg-card/60 p-4">
                                            <p className="text-xs font-semibold text-muted-foreground">
                                                Your Prediction
                                            </p>
                                            <p className="mt-1 font-heading text-3xl font-black">
                                                {prediction.predicted_team_a_score} -{" "}
                                                {prediction.predicted_team_b_score}
                                            </p>

                                            {prediction.predicted_qualifier && (
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Qualifier: {prediction.predicted_qualifier}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="rounded-3xl border bg-card/60 p-4">
                                                <p className="text-xs font-semibold text-muted-foreground">
                                                    Actual
                                                </p>
                                                <p className="mt-1 font-heading text-xl font-black">
                                                    {actualResult}
                                                </p>

                                                {prediction.actual_qualifier && (
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Qualified: {prediction.actual_qualifier}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="rounded-3xl border bg-card/60 p-4">
                                                <p className="text-xs font-semibold text-muted-foreground">
                                                    Points
                                                </p>
                                                <p
                                                    className={`mt-1 font-heading text-xl font-black ${prediction.points < 0
                                                            ? "text-destructive"
                                                            : "text-emerald-400"
                                                        }`}
                                                >
                                                    {prediction.points}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {getPredictionBadge(prediction)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};
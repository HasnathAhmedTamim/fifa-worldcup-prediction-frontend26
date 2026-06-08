"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { submitPrediction } from "../services/predictionApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Match = {
    id: number;
    team_a: string;
    team_b: string;
    stage: "group" | "knockout";
};

type ExistingPrediction = {
    predicted_team_a_score: number;
    predicted_team_b_score: number;
    predicted_qualifier?: string | null;
};

type Props = {
    match: Match;
    existingPrediction?: ExistingPrediction | null;
};

export const PredictionForm = ({ match, existingPrediction }: Props) => {
    const queryClient = useQueryClient();

    const [teamAScore, setTeamAScore] = useState(
        existingPrediction ? String(existingPrediction.predicted_team_a_score) : ""
    );

    const [teamBScore, setTeamBScore] = useState(
        existingPrediction ? String(existingPrediction.predicted_team_b_score) : ""
    );

    const [qualifier, setQualifier] = useState(
        existingPrediction?.predicted_qualifier || ""
    );

    const [errorMessage, setErrorMessage] = useState("");

    const mutation = useMutation({
        mutationFn: submitPrediction,
        onSuccess: () => {
            setErrorMessage("");

            queryClient.invalidateQueries({ queryKey: ["my-predictions"] });
            queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
            queryClient.invalidateQueries({ queryKey: ["matches-by-date"] });

            toast.success(
                existingPrediction
                    ? "Prediction updated successfully"
                    : "Prediction submitted successfully"
            );
        },
        onError: (error: any) => {
            const message =
                error.response?.data?.message || "Failed to submit prediction";

            setErrorMessage(message);
            toast.error(message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setErrorMessage("");

        if (teamAScore === "" || teamBScore === "") {
            setErrorMessage("Both scores are required");
            toast.error("Both scores are required");
            return;
        }

        if (match.stage === "knockout" && !qualifier) {
            setErrorMessage("Please select qualifier");
            toast.error("Please select qualifier");
            return;
        }

        mutation.mutate({
            match_id: match.id,
            predicted_team_a_score: Number(teamAScore),
            predicted_team_b_score: Number(teamBScore),
            predicted_qualifier: qualifier || undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {existingPrediction && (
                <div className="rounded-3xl border bg-secondary/40 p-4 text-sm">
                    <p className="font-semibold">Current Prediction</p>
                    <p className="mt-1 text-muted-foreground">
                        {match.team_a} {existingPrediction.predicted_team_a_score} -{" "}
                        {existingPrediction.predicted_team_b_score} {match.team_b}
                    </p>

                    {existingPrediction.predicted_qualifier && (
                        <p className="mt-1 text-xs text-muted-foreground">
                            Qualifier: {existingPrediction.predicted_qualifier}
                        </p>
                    )}
                </div>
            )}

            {errorMessage && (
                <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-3 text-sm font-medium text-destructive">
                    {errorMessage}
                </div>
            )}

            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
                <div>
                    <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                        {match.team_a}
                    </label>
                    <Input
                        type="number"
                        min={0}
                        value={teamAScore}
                        onChange={(e) => setTeamAScore(e.target.value)}
                        placeholder="0"
                        className="soft-input h-12 text-center text-lg font-black"
                    />
                </div>

                <div className="pb-3 text-center text-xl font-black text-muted-foreground">
                    -
                </div>

                <div>
                    <label className="mb-2 block text-right text-xs font-semibold text-muted-foreground">
                        {match.team_b}
                    </label>
                    <Input
                        type="number"
                        min={0}
                        value={teamBScore}
                        onChange={(e) => setTeamBScore(e.target.value)}
                        placeholder="0"
                        className="soft-input h-12 text-center text-lg font-black"
                    />
                </div>
            </div>

            {match.stage === "knockout" && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                        Who will qualify?
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            type="button"
                            variant={qualifier === match.team_a ? "default" : "secondary"}
                            className="smooth-button rounded-2xl"
                            onClick={() => setQualifier(match.team_a)}
                        >
                            {match.team_a}
                        </Button>

                        <Button
                            type="button"
                            variant={qualifier === match.team_b ? "default" : "secondary"}
                            className="smooth-button rounded-2xl"
                            onClick={() => setQualifier(match.team_b)}
                        >
                            {match.team_b}
                        </Button>
                    </div>
                </div>
            )}

            <Button
                type="submit"
                disabled={mutation.isPending}
                className="smooth-button h-12 w-full rounded-2xl font-bold"
            >
                {mutation.isPending
                    ? "Saving..."
                    : existingPrediction
                        ? "Update Prediction"
                        : "Submit Prediction"}
            </Button>
        </form>
    );
};
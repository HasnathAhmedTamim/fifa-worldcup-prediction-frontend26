"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { confirmKnockoutTeams } from "../services/adminApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ConfirmKnockoutTeamsForm = ({ matchId }: { matchId: number }) => {
    const queryClient = useQueryClient();

    const [teamA, setTeamA] = useState("");
    const [teamB, setTeamB] = useState("");

    const mutation = useMutation({
        mutationFn: confirmKnockoutTeams,
        onSuccess: () => {
            toast.success("Knockout teams confirmed");

            queryClient.invalidateQueries({ queryKey: ["admin-matches"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            queryClient.invalidateQueries({ queryKey: ["matches-by-date"] });

            setTeamA("");
            setTeamB("");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to confirm teams");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!teamA || !teamB) {
            toast.error("Both teams are required");
            return;
        }

        mutation.mutate({
            matchId,
            payload: {
                team_a: teamA,
                team_b: teamB,
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="form-panel space-y-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-secondary">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>

                <div>
                    <p className="font-heading font-bold">Confirm Knockout Teams</p>
                    <p className="text-xs text-muted-foreground">
                        This opens prediction for this knockout fixture.
                    </p>
                </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                        Team A
                    </label>
                    <Input
                        value={teamA}
                        onChange={(e) => setTeamA(e.target.value)}
                        placeholder="Argentina"
                        className="soft-input h-11"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                        Team B
                    </label>
                    <Input
                        value={teamB}
                        onChange={(e) => setTeamB(e.target.value)}
                        placeholder="Brazil"
                        className="soft-input h-11"
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={mutation.isPending}
                className="smooth-button h-11 w-full rounded-2xl font-bold"
            >
                {mutation.isPending ? "Confirming..." : "Confirm Teams"}
            </Button>
        </form>
    );
};
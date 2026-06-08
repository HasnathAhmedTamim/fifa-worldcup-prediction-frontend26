"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarPlus, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

import { createMatch } from "../services/adminApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const CreateMatchForm = () => {
    const queryClient = useQueryClient();

    const [showAdvanced, setShowAdvanced] = useState(false);

    const [matchNo, setMatchNo] = useState("");
    const [stage, setStage] = useState<"group" | "knockout">("group");
    const [teamA, setTeamA] = useState("");
    const [teamB, setTeamB] = useState("");
    const [teamAPlaceholder, setTeamAPlaceholder] = useState("");
    const [teamBPlaceholder, setTeamBPlaceholder] = useState("");
    const [matchDate, setMatchDate] = useState("");
    const [matchTime, setMatchTime] = useState("");
    const [roundName, setRoundName] = useState("");
    const [groupName, setGroupName] = useState("");
    const [venue, setVenue] = useState("");

    const mutation = useMutation({
        mutationFn: createMatch,
        onSuccess: () => {
            toast.success("Match created successfully");

            queryClient.invalidateQueries({ queryKey: ["admin-matches"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            queryClient.invalidateQueries({ queryKey: ["matches-by-date"] });

            setMatchNo("");
            setStage("group");
            setTeamA("");
            setTeamB("");
            setTeamAPlaceholder("");
            setTeamBPlaceholder("");
            setMatchDate("");
            setMatchTime("");
            setRoundName("");
            setGroupName("");
            setVenue("");
            setShowAdvanced(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create match");
        },
    });

    const getKickoffAtUTC = (date: string, time: string) => {
        const bangladeshDateTime = new Date(`${date}T${time}:00+06:00`);
        return bangladeshDateTime.toISOString();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!matchDate || !matchTime) {
            toast.error("Match date and time are required");
            return;
        }

        if (stage === "group" && (!teamA || !teamB)) {
            toast.error("Team A and Team B are required for group match");
            return;
        }

        if (stage === "knockout" && !teamA && !teamB) {
            if (!teamAPlaceholder || !teamBPlaceholder) {
                toast.error("Placeholders are required for pending knockout match");
                return;
            }
        }

        mutation.mutate({
            match_no: matchNo ? Number(matchNo) : undefined,
            team_a: teamA || undefined,
            team_b: teamB || undefined,
            team_a_placeholder: teamAPlaceholder || undefined,
            team_b_placeholder: teamBPlaceholder || undefined,
            match_date: matchDate,
            match_time: matchTime,
            kickoff_at: getKickoffAtUTC(matchDate, matchTime),
            stage,
            round_name: roundName || undefined,
            group_name: groupName || undefined,
            venue: venue || undefined,
            status: teamA && teamB ? "upcoming" : "pending",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="form-panel space-y-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-secondary">
                        <CalendarPlus className="h-5 w-5 text-emerald-400" />
                    </div>

                    <div>
                        <h2 className="font-heading text-xl font-black">
                            Create Custom Match
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Add a group fixture or knockout placeholder.
                        </p>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAdvanced((prev) => !prev)}
                    className="smooth-button rounded-full"
                >
                    {showAdvanced ? (
                        <ChevronUp className="mr-2 h-4 w-4" />
                    ) : (
                        <ChevronDown className="mr-2 h-4 w-4" />
                    )}
                    {showAdvanced ? "Hide Advanced" : "Advanced"}
                </Button>
            </div>

            <div className="rounded-3xl border bg-background/30 p-4">
                <p className="mb-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Basic Match Info
                </p>

                <div className="grid gap-3 md:grid-cols-3">
                    <div>
                        <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                            Stage
                        </label>
                        <select
                            value={stage}
                            onChange={(e) => setStage(e.target.value as "group" | "knockout")}
                            className="h-11 w-full rounded-2xl border bg-background/60 px-3 py-2 text-sm"
                        >
                            <option value="group">Group</option>
                            <option value="knockout">Knockout</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                            Bangladesh Date
                        </label>
                        <Input
                            type="date"
                            value={matchDate}
                            onChange={(e) => setMatchDate(e.target.value)}
                            className="soft-input h-11"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                            Bangladesh Time
                        </label>
                        <Input
                            type="time"
                            value={matchTime}
                            onChange={(e) => setMatchTime(e.target.value)}
                            className="soft-input h-11"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border bg-background/30 p-4">
                <p className="mb-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Teams
                </p>

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

                {stage === "knockout" && (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                                Team A Placeholder
                            </label>
                            <Input
                                value={teamAPlaceholder}
                                onChange={(e) => setTeamAPlaceholder(e.target.value)}
                                placeholder="Winner Match 89"
                                className="soft-input h-11"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                                Team B Placeholder
                            </label>
                            <Input
                                value={teamBPlaceholder}
                                onChange={(e) => setTeamBPlaceholder(e.target.value)}
                                placeholder="Winner Match 90"
                                className="soft-input h-11"
                            />
                        </div>
                    </div>
                )}
            </div>

            {showAdvanced && (
                <div className="rounded-3xl border bg-background/30 p-4">
                    <p className="mb-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Advanced Details
                    </p>

                    <div className="grid gap-3 md:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                                Match No
                            </label>
                            <Input
                                type="number"
                                value={matchNo}
                                onChange={(e) => setMatchNo(e.target.value)}
                                placeholder="105"
                                className="soft-input h-11"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                                Round Name
                            </label>
                            <Input
                                value={roundName}
                                onChange={(e) => setRoundName(e.target.value)}
                                placeholder="Group Stage"
                                className="soft-input h-11"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                                Group
                            </label>
                            <Input
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder="Group A"
                                className="soft-input h-11"
                            />
                        </div>
                    </div>

                    <div className="mt-3">
                        <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                            Venue
                        </label>
                        <Input
                            value={venue}
                            onChange={(e) => setVenue(e.target.value)}
                            placeholder="New Jersey, USA"
                            className="soft-input h-11"
                        />
                    </div>
                </div>
            )}

            <Button
                type="submit"
                disabled={mutation.isPending}
                className="smooth-button h-12 w-full rounded-2xl font-bold"
            >
                {mutation.isPending ? "Creating..." : "Create Match"}
            </Button>
        </form>
    );
};
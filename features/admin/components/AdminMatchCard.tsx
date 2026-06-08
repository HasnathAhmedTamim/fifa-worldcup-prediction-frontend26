"use client";

import { useState } from "react";
import {
    CalendarDays,
    ChevronDown,
    ChevronUp,
    Eye,
    MapPin,
    Pencil,
    ShieldCheck,
    Trophy,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { UpdateResultForm } from "./UpdateResultForm";
import { ConfirmKnockoutTeamsForm } from "./ConfirmKnockoutTeamsForm";
import { MatchPredictionsPanel } from "./MatchPredictionsPanel";
import { UpdateMatchStatusForm } from "./UpdateMatchStatusForm";

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

const getDateOnly = (date: string) => date?.slice(0, 10);

export const AdminMatchCard = ({ match }: { match: Match }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activePanel, setActivePanel] = useState<
        "predictions" | "result" | "confirm" | "status" | null
    >(null);

    const isTeamConfirmed = Boolean(match.team_a && match.team_b);

    const teamA = match.team_a || match.team_a_placeholder || "TBD";
    const teamB = match.team_b || match.team_b_placeholder || "TBD";

    const result =
        match.actual_team_a_score !== null && match.actual_team_b_score !== null
            ? `${match.actual_team_a_score} - ${match.actual_team_b_score}`
            : "Not updated";

    const getStatusVariant = () => {
        if (match.status === "completed") return "default";
        if (match.status === "cancelled") return "destructive";
        if (match.status === "upcoming") return "secondary";
        return "outline";
    };

    const openPanel = (
        panel: "predictions" | "result" | "confirm" | "status"
    ) => {
        setIsExpanded(true);
        setActivePanel((prev) => (prev === panel ? null : panel));
    };

    return (
        <Card className="modern-card overflow-hidden">
            <CardContent className="p-0">
                {/* Compact Header */}
                <div className="p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="min-w-0 flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant={getStatusVariant()} className="capitalize">
                                    {match.status}
                                </Badge>

                                <Badge variant="outline" className="capitalize">
                                    {match.stage}
                                </Badge>

                                {match.group_name && (
                                    <Badge variant="secondary">{match.group_name}</Badge>
                                )}

                                <span className="text-xs font-semibold text-muted-foreground">
                                    Match {match.match_no}
                                </span>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-muted-foreground">
                                    {match.round_name}
                                </p>

                                <h3 className="mt-1 truncate font-heading text-xl font-black md:text-2xl">
                                    {teamA} <span className="text-muted-foreground">vs</span>{" "}
                                    {teamB}
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1 rounded-full border bg-background/40 px-3 py-1.5">
                                    <CalendarDays className="h-3.5 w-3.5 text-emerald-400" />
                                    {getDateOnly(match.match_date)} • {match.match_time}
                                </div>

                                <div className="flex items-center gap-1 rounded-full border bg-background/40 px-3 py-1.5">
                                    {match.stage === "knockout" ? (
                                        <Trophy className="h-3.5 w-3.5 text-amber-400" />
                                    ) : (
                                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                                    )}
                                    Result: {result}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-2 xl:justify-end">
                            <Button
                                variant={activePanel === "predictions" ? "default" : "secondary"}
                                size="sm"
                                onClick={() => openPanel("predictions")}
                                className="smooth-button rounded-full"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Predictions
                            </Button>

                            {match.stage === "knockout" && !isTeamConfirmed && (
                                <Button
                                    variant={activePanel === "confirm" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => openPanel("confirm")}
                                    className="smooth-button rounded-full"
                                >
                                    Confirm Teams
                                </Button>
                            )}

                            {isTeamConfirmed && (
                                <Button
                                    variant={activePanel === "result" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => openPanel("result")}
                                    className="smooth-button rounded-full"
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Result
                                </Button>
                            )}

                            <Button
                                variant={activePanel === "status" ? "default" : "outline"}
                                size="sm"
                                onClick={() => openPanel("status")}
                                className="smooth-button rounded-full"
                            >
                                Status
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsExpanded((prev) => !prev)}
                                className="rounded-full"
                            >
                                {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                    <div className="border-t bg-background/25 p-5 md:p-6">
                        <div className="mb-5 grid gap-3 md:grid-cols-2">
                            <div className="flex items-center gap-2 rounded-2xl border bg-background/40 p-3 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 text-emerald-400" />
                                <span>{match.venue || "No venue added"}</span>
                            </div>

                            <div className="flex items-center gap-2 rounded-2xl border bg-background/40 p-3 text-sm text-muted-foreground">
                                {match.stage === "knockout" ? (
                                    <Trophy className="h-4 w-4 text-amber-400" />
                                ) : (
                                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                )}
                                <span>
                                    {match.stage === "knockout"
                                        ? "Knockout fixture"
                                        : "Group stage fixture"}
                                </span>
                            </div>
                        </div>

                        {!activePanel && (
                            <div className="rounded-3xl border bg-card/60 p-6 text-center text-sm text-muted-foreground">
                                Select an action above to manage this fixture.
                            </div>
                        )}

                        <div className="grid gap-4">
                            {activePanel === "confirm" && (
                                <ConfirmKnockoutTeamsForm matchId={match.id} />
                            )}

                            {activePanel === "result" && (
                                <UpdateResultForm
                                    matchId={match.id}
                                    stage={match.stage}
                                    teamA={match.team_a}
                                    teamB={match.team_b}
                                />
                            )}

                            {activePanel === "status" && (
                                <UpdateMatchStatusForm
                                    matchId={match.id}
                                    currentStatus={match.status}
                                />
                            )}

                            {activePanel === "predictions" && (
                                <MatchPredictionsPanel matchId={match.id} />
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Crown, Medal, Trophy } from "lucide-react";
import { getLeaderboard } from "../services/leaderboardApi";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LeaderboardUser = {
    rank: number;
    id: number;
    name: string;
    email: string;
    total_points: number;
    exact_scores: number;
    correct_winners: number;
    wrong_predictions: number;
    champion_correct: boolean;
};

type LeaderboardResponse = {
    players: LeaderboardUser[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4 text-amber-400" />;
    if (rank === 2) return <Medal className="h-4 w-4 text-zinc-300" />;
    if (rank === 3) return <Trophy className="h-4 w-4 text-orange-400" />;
    return null;
};

export const LeaderboardTable = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data, isLoading, isError } = useQuery<LeaderboardResponse>({
        queryKey: ["leaderboard", page, limit],
        queryFn: () => getLeaderboard({ page, limit }),
    });

    const players = data?.players || [];
    const meta = data?.meta;

    const goToPreviousPage = () => {
        setPage((current) => Math.max(current - 1, 1));
    };

    const goToNextPage = () => {
        if (!meta) return;
        setPage((current) => Math.min(current + 1, meta.totalPages));
    };

    const handleLimitChange = (value: string) => {
        setLimit(Number(value));
        setPage(1);
    };

    if (isLoading) {
        return (
            <div className="dark-panel p-8 text-center text-muted-foreground">
                Loading leaderboard...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-3xl border border-destructive/40 bg-card/80 p-8 text-center text-destructive">
                Failed to load leaderboard.
            </div>
        );
    }

    if (!data || players.length === 0) {
        return (
            <Card className="modern-card">
                <CardContent className="py-10">
                    <p className="text-center text-muted-foreground">
                        No leaderboard data yet.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="modern-card overflow-hidden">
            <CardHeader className="border-b bg-background/30">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <CardTitle className="font-heading text-2xl font-black">
                            League Table
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Showing {players.length} of {meta?.total || 0} players.
                        </p>
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
                            {meta?.total || 0} Players
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-secondary/40">
                            <TableRow>
                                <TableHead className="w-[90px]">Rank</TableHead>
                                <TableHead>Player</TableHead>
                                <TableHead className="text-center">Points</TableHead>
                                <TableHead className="text-center">Exact</TableHead>
                                <TableHead className="text-center">Correct</TableHead>
                                <TableHead className="text-center">Wrong</TableHead>
                                <TableHead className="text-center">Champion</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {players.map((user) => (
                                <TableRow
                                    key={user.id}
                                    className="transition hover:bg-secondary/30"
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={user.rank === 1 ? "default" : "secondary"}
                                                className="rounded-full"
                                            >
                                                #{user.rank}
                                            </Badge>
                                            {getRankIcon(user.rank)}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-secondary text-sm font-black">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>

                                            <div>
                                                <p className="font-semibold">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <span className="font-heading text-xl font-black">
                                            {user.total_points}
                                        </span>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="rounded-full">
                                            {user.exact_scores}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="rounded-full">
                                            {user.correct_winners}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <Badge variant="destructive" className="rounded-full">
                                            {user.wrong_predictions}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {user.champion_correct ? "✅" : "—"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex flex-col justify-between gap-3 border-t bg-background/30 p-4 md:flex-row md:items-center">
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
            </CardContent>
        </Card>
    );
};
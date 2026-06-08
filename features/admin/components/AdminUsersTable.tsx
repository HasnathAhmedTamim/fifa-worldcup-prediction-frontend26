"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UsersRound } from "lucide-react";
import { getAdminUsers } from "../services/adminApi";

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

type AdminUser = {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
    total_points: number;
    exact_scores: number;
    correct_winners: number;
    wrong_predictions: number;
    champion_correct: boolean;
    created_at: string;
};

type AdminUsersResponse = {
    users: AdminUser[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export const AdminUsersTable = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data, isLoading, isError } = useQuery<AdminUsersResponse>({
        queryKey: ["admin-users", page, limit],
        queryFn: () => getAdminUsers({ page, limit }),
    });

    const users = data?.users || [];
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
                Loading users...
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="rounded-3xl border border-destructive/40 bg-card/80 p-6 text-center text-destructive">
                Failed to load users.
            </div>
        );
    }

    return (
        <Card className="modern-card overflow-hidden">
            <CardHeader className="border-b bg-background/30">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-secondary">
                            <UsersRound className="h-5 w-5 text-emerald-400" />
                        </div>

                        <div>
                            <CardTitle className="font-heading text-xl font-black">
                                Users
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Showing {users.length} of {meta?.total || 0} registered users
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
                            {meta?.total || 0} Users
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {users.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No users found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-secondary/40">
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-center">Points</TableHead>
                                    <TableHead className="text-center">Exact</TableHead>
                                    <TableHead className="text-center">Correct</TableHead>
                                    <TableHead className="text-center">Wrong</TableHead>
                                    <TableHead>Joined</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-secondary/30">
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

                                        <TableCell>
                                            <Badge
                                                variant={user.role === "admin" ? "default" : "secondary"}
                                                className="rounded-full"
                                            >
                                                {user.role}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-center font-heading text-lg font-black">
                                            {user.total_points}
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

                                        <TableCell className="text-muted-foreground">
                                            {user.created_at ? user.created_at.slice(0, 10) : "—"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

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
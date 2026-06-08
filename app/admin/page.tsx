"use client";

import { useState } from "react";

import { AuthGuard } from "@/components/shared/AuthGuard";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdminMatchList } from "@/features/admin/components/AdminMatchList";
import { AdminStatsCards } from "@/features/admin/components/AdminStatsCards";
import { AdminUsersTable } from "@/features/admin/components/AdminUsersTable";
import { CreateMatchForm } from "@/features/admin/components/CreateMatchForm";
import { Button } from "@/components/ui/button";

type AdminTab = "overview" | "fixtures" | "create";

const tabs: {
  label: string;
  value: AdminTab;
}[] = [
  {
    label: "Overview",
    value: "overview",
  },
  {
    label: "Fixtures",
    value: "fixtures",
  },
  {
    label: "Create Match",
    value: "create",
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  return (
    <AuthGuard requireAdmin>
      <section className="space-y-8">
        <PageHeader
          badge="Admin Control Center"
          title="Tournament Dashboard"
          description="Manage fixtures, update results, monitor users, and track every prediction from one clean dashboard."
        />

        <div className="dark-panel p-2">
          <div className="grid gap-2 md:grid-cols-3">
            {tabs.map((tab) => (
              <Button
                key={tab.value}
                type="button"
                variant={activeTab === tab.value ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.value)}
                className="smooth-button h-11 rounded-2xl font-bold"
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8">
            <AdminStatsCards />
            <AdminUsersTable />
          </div>
        )}

        {activeTab === "fixtures" && <AdminMatchList />}

        {activeTab === "create" && (
          <div className="mx-auto max-w-4xl">
            <CreateMatchForm />
          </div>
        )}
      </section>
    </AuthGuard>
  );
}
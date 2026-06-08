import { ReactNode } from "react";

type PageHeaderProps = {
    badge?: string;
    title: string;
    description?: string;
    action?: ReactNode;
};

export const PageHeader = ({
    badge,
    title,
    description,
    action,
}: PageHeaderProps) => {
    return (
        <div className="dark-panel subtle-grid relative overflow-hidden p-6 md:p-8">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-24 left-10 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div className="space-y-3">
                    {badge && (
                        <div className="inline-flex rounded-full border bg-secondary/50 px-3 py-1 text-xs font-semibold text-muted-foreground">
                            {badge}
                        </div>
                    )}

                    <div className="space-y-2">
                        <h1 className="page-title">{title}</h1>
                        {description && <p className="page-description">{description}</p>}
                    </div>
                </div>

                {action && <div className="shrink-0">{action}</div>}
            </div>
        </div>
    );
};
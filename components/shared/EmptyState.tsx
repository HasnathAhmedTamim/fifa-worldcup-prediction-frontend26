export const EmptyState = ({ text = "No data found." }: { text?: string }) => {
    return (
        <div className="rounded-lg border p-6 text-center text-muted-foreground">
            {text}
        </div>
    );
};
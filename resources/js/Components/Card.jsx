export default function Card({ className = "", children, ...props }) {
    return (
        <div
            {...props}
            className={
                "rounded-xl border border-border bg-card shadow-sm " + className
            }
        >
            {children}
        </div>
    );
}

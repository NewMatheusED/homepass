export default function Checkbox({ className = "", ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                "rounded border-input bg-secondary text-primary shadow-sm focus:ring-ring/40 focus:ring-offset-background " +
                className
            }
        />
    );
}

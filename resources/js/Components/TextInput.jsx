import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export default forwardRef(function TextInput(
    { type = "text", className = "", isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                "block rounded-lg border-input bg-secondary/60 text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:bg-secondary focus:ring-ring/40 " +
                className
            }
            ref={localRef}
        />
    );
});

import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";

function CheckCircleIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 7.53-4.5 4.5a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 1 1 1.06-1.06l1.72 1.72 3.97-3.97a.75.75 0 1 1 1.06 1.06Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function XCircleIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3.03 6.72a.75.75 0 0 0-1.06-1.06L12 9.879 10.03 7.91a.75.75 0 0 0-1.06 1.06L10.94 10.94l-1.97 1.97a.75.75 0 1 0 1.06 1.06L12 12l1.97 1.97a.75.75 0 0 0 1.06-1.06l-1.97-1.97 1.97-1.97Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function InformationCircleIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.75 5.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 10.5a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0v-5.25a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function ExclamationTriangleIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.198 0l7.58 13.126c1.154 2-.29 4.5-2.599 4.5H4.42c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function XMarkIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

const ToastContext = createContext(null);

const VARIANTS = {
    success: {
        icon: CheckCircleIcon,
        classes: "border-success/30 bg-success/10 text-success",
        iconClasses: "text-success",
    },
    error: {
        icon: XCircleIcon,
        classes: "border-destructive/30 bg-destructive/10 text-destructive",
        iconClasses: "text-destructive",
    },
    info: {
        icon: InformationCircleIcon,
        classes: "border-primary/30 bg-primary/10 text-primary",
        iconClasses: "text-primary",
    },
    warning: {
        icon: ExclamationTriangleIcon,
        classes: "border-warning/30 bg-warning/10 text-warning",
        iconClasses: "text-warning",
    },
};

function ToastItem({ id, type = "info", message, onDismiss }) {
    const variant = VARIANTS[type] ?? VARIANTS.info;
    const Icon = variant.icon;

    return (
        <div
            role="alert"
            className={`animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border bg-popover/95 px-4 py-3 shadow-lg backdrop-blur-sm ${variant.classes}`}
        >
            <Icon
                className={`mt-0.5 h-5 w-5 shrink-0 ${variant.iconClasses}`}
            />
            <p className="flex-1 text-sm font-medium text-popover-foreground">
                {message}
            </p>
            <button
                type="button"
                onClick={() => onDismiss(id)}
                className="shrink-0 rounded-md p-0.5 text-muted-foreground transition hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
                <XMarkIcon className="h-4 w-4" />
            </button>
        </div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    const dismiss = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
        clearTimeout(timers.current[id]);
        delete timers.current[id];
    }, []);

    const push = useCallback(
        (type, message, duration = 4000) => {
            const id = crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()}`;

            setToasts((current) => [...current, { id, type, message }]);

            if (duration) {
                timers.current[id] = setTimeout(() => dismiss(id), duration);
            }

            return id;
        },
        [dismiss],
    );

    const toast = {
        success: (message, duration) => push("success", message, duration),
        error: (message, duration) => push("error", message, duration),
        info: (message, duration) => push("info", message, duration),
        warning: (message, duration) => push("warning", message, duration),
        dismiss,
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}

            <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6">
                {toasts.map((item) => (
                    <ToastItem key={item.id} {...item} onDismiss={dismiss} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast deve ser usado dentro de um ToastProvider");
    }

    return context;
}

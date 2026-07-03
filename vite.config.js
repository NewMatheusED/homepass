import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
    ],
    server: {
        watch: {
            // WSL2/Linux nativo: o watch por inotify funciona e e mais rapido (default).
            // Windows nativo (Docker Desktop bind mount) nao propaga os eventos ao
            // container -> rode com VITE_USE_POLLING=true para forcar o polling.
            usePolling: process.env.VITE_USE_POLLING === "true",
        },
    },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    root: './', // frontend folder is the root
    server: {
        port: 5173, // optional, matches Vite default
    },
});

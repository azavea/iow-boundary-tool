import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: process.env.PORT,
        host: true,
        proxy: {
            '/api': 'http://django:8181',
            '/media': 'http://django:8181',
            '/web': 'http://django:8181',
        }
    },
});

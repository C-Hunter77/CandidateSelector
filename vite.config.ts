import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development, production)
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    base: './', // Needed for static deployment like Render

    define: {
      // This allows you to use process.env.VITE_... in your frontend code
      'process.env': Object.entries(env).reduce((prev, [key, val]) => {
        prev[key] = JSON.stringify(val);
        return prev;
      }, {} as Record<string, string>),
    },
  };
});

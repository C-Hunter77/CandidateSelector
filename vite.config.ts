import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '');

  for (const k of Object.keys(env)) {
    process.env[k] = env[k];
  }

  return {
    plugins: [react()],

    define: {
      'process.env': process.env
    }
  };
});

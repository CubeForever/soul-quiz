import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    root: '.',
    base: './',           // 相对路径，确保部署到子目录也能工作
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'esbuild',
      target: 'es2015',   // 兼容旧浏览器
      rollupOptions: {
        output: {
          manualChunks: undefined  // 全部打包为一个文件（小项目）
        }
      }
    },
    server: {
      port: 3000,
      open: true,
      watch: {
        // 避免 node_modules 和 dist 触发重载
        ignored: ['**/node_modules/**', '**/dist/**']
      }
    },
    // 构建时环境变量注入（在 .env 文件或 CI 中配置）
    define: {
      '__WEBHOOK_URL__': JSON.stringify(env.VITE_WEBHOOK_URL || ''),
      '__PROXY_URL__': JSON.stringify(env.VITE_PROXY_URL || ''),
      '__WEBHOOK_ENABLED__': JSON.stringify(env.VITE_WEBHOOK_ENABLED || 'false'),
    }
  };
});
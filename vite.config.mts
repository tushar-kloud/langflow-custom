import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import {
  API_ROUTES,
  BASENAME,
  PORT,
  PROXY_TARGET,
} from "./src/customization/config-constants";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const apiRoutes = API_ROUTES || ["^/api/v1/", "/health"];

  // const target =
  //   env.VITE_PROXY_TARGET || PROXY_TARGET || "http://127.0.0.1:7860";

  const port = Number(env.VITE_PORT) || PORT || 3000;

  const proxyTargets = apiRoutes.reduce((proxyObj, route) => {
    proxyObj[route] = {
      // target: target,
      target: env.VITE_KLOUDSTAC_LANGFLOW_BACKEND_URL,
      changeOrigin: true,
      secure: false,
      withCredentials: true,
      ws: true,
    };
    return proxyObj;
  }, {});

  return {
    base: BASENAME || "",
    build: {
      outDir: "build",
    },
    define: {
      "process.env.BACKEND_URL": JSON.stringify(env.VITE_KLOUDSTAC_LANGFLOW_BACKEND_URL),
      // "process.env.BACKEND_URL": JSON.stringify('http://20.197.53.99:8000'),
      "process.env.ACCESS_TOKEN_EXPIRE_SECONDS": JSON.stringify(
        env.ACCESS_TOKEN_EXPIRE_SECONDS,
      ),
      "process.env.CI": JSON.stringify(env.CI),
    },
    plugins: [react(), svgr(), tsconfigPaths()],
    server: {
      port: port,
      host: true,
      allowedHosts: true,
      proxy: {
        ...proxyTargets,
      },
    },
  };
});

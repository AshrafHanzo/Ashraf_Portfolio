import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Dev-only bridge so /api/send-email works under `npm run dev`
// (in production Vercel serves the same handler from /api/send-email.js).
function devMailerPlugin(env: Record<string, string>) {
  return {
    name: "dev-mailer",
    configureServer(server: any) {
      process.env.GMAIL_USER = env.GMAIL_USER || process.env.GMAIL_USER;
      process.env.GMAIL_APP_PASSWORD = env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD;
      process.env.CONTACT_TO = env.CONTACT_TO || process.env.CONTACT_TO;

      server.middlewares.use("/api/send-email", async (req: any, res: any) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          return res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
        }
        let body = "";
        req.on("data", (c: any) => (body += c));
        req.on("end", async () => {
          res.setHeader("Content-Type", "application/json");
          try {
            const { sendPortfolioEmail } = await import("./api/send-email.js");
            await sendPortfolioEmail(JSON.parse(body || "{}"));
            res.end(JSON.stringify({ ok: true }));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ ok: false, error: e?.message || "Failed to send" }));
          }
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: true,
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      mode === "development" && devMailerPlugin(env),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

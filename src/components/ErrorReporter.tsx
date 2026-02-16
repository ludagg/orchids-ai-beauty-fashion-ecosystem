"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCcw, Home, Hammer, ShieldAlert } from "lucide-react";

type ReporterProps = {
  /*  ⎯⎯ props are only provided on the global-error page ⎯⎯ */
  error?: Error & { digest?: string };
  reset?: () => void;
};

export default function ErrorReporter({ error, reset }: ReporterProps) {
  /* ─ instrumentation shared by every route ─ */
  const lastOverlayMsg = useRef("");
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const inIframe = window.parent !== window;
    if (!inIframe) return;

    const send = (payload: unknown) => window.parent.postMessage(payload, "*");

    const onError = (e: ErrorEvent) =>
      send({
        type: "ERROR_CAPTURED",
        error: {
          message: e.message,
          stack: e.error?.stack,
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno,
          source: "window.onerror",
        },
        timestamp: Date.now(),
      });

    const onReject = (e: PromiseRejectionEvent) =>
      send({
        type: "ERROR_CAPTURED",
        error: {
          message: e.reason?.message ?? String(e.reason),
          stack: e.reason?.stack,
          source: "unhandledrejection",
        },
        timestamp: Date.now(),
      });

    const pollOverlay = () => {
      const overlay = document.querySelector("[data-nextjs-dialog-overlay]");
      const node =
        overlay?.querySelector(
          "h1, h2, .error-message, [data-nextjs-dialog-body]"
        ) ?? null;
      const txt = node?.textContent ?? node?.innerHTML ?? "";
      if (txt && txt !== lastOverlayMsg.current) {
        lastOverlayMsg.current = txt;
        send({
          type: "ERROR_CAPTURED",
          error: { message: txt, source: "nextjs-dev-overlay" },
          timestamp: Date.now(),
        });
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onReject);
    pollRef.current = setInterval(pollOverlay, 1000);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onReject);
      pollRef.current && clearInterval(pollRef.current);
    };
  }, []);

  /* ─ extra postMessage when on the global-error route ─ */
  useEffect(() => {
    if (!error) return;
    window.parent.postMessage(
      {
        type: "global-error-reset",
        error: {
          message: error.message,
          stack: error.stack,
          digest: error.digest,
          name: error.name,
        },
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      },
      "*"
    );
  }, [error]);

  /* ─ ordinary pages render nothing ─ */
  if (!error) return null;

  /* ─ global-error UI ─ */
  return (
    <html>
      <body className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 antialiased">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-destructive/[0.05] blur-[100px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/[0.05] blur-[100px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-xl w-full relative"
        >
          <div className="bg-card border border-border rounded-[40px] p-8 md:p-12 shadow-2xl shadow-foreground/5 space-y-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-destructive" />

            <div className="space-y-6">
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-24 h-24 bg-destructive/10 rounded-[32px] flex items-center justify-center mx-auto text-destructive"
              >
                <ShieldAlert className="w-12 h-12" />
              </motion.div>

              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight">
                  System Encountered a Glitch
                </h1>
                <p className="text-muted-foreground text-lg max-w-sm mx-auto leading-relaxed">
                  We&apos;ve hit an unexpected roadblock. Don&apos;t worry, our team has been notified.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => reset?.()}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-all active:scale-[0.98] shadow-xl shadow-primary/10"
              >
                <RefreshCcw className="w-5 h-5" />
                Try Again
              </button>
              <a href="/" className="flex items-center justify-center gap-2 px-8 py-4 bg-muted text-foreground border border-border rounded-2xl font-bold hover:bg-muted/80 transition-all active:scale-[0.98]">
                <Home className="w-5 h-5" />
                Back to Home
              </a>
            </div>

            {process.env.NODE_ENV === "development" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-left"
              >
                <details className="group">
                  <summary className="cursor-pointer text-xs font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 uppercase tracking-widest list-none">
                    <Hammer className="w-3 h-3" />
                    Technical Details
                  </summary>
                  <div className="mt-4 p-6 bg-muted rounded-3xl border border-border overflow-auto max-h-60 no-scrollbar">
                    <p className="text-sm font-bold text-destructive mb-2">{error.name}: {error.message}</p>
                    {error.stack && (
                      <pre className="text-[10px] text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    )}
                    {error.digest && (
                      <div className="mt-4 pt-4 border-t border-border/50 text-[10px] text-muted-foreground font-bold">
                        Error ID: {error.digest}
                      </div>
                    )}
                  </div>
                </details>
              </motion.div>
            )}
          </div>

          <p className="text-center mt-8 text-sm text-muted-foreground/50 font-medium">
            Error Reporting by Rare Intelligence Engine
          </p>
        </motion.div>
      </body>
    </html>
  );
}

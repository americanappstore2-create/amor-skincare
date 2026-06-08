import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

// Replace "Made with Manus" with "Made with Love"
if (typeof window !== 'undefined') {
  const replaceManusBadge = () => {
    // Search all elements for "Made with Manus" text
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent?.includes('Made with Manus')) {
        // Hide the original element
        el.style.display = 'none !important';
        el.style.visibility = 'hidden';
        
        // Create our custom badge
        const customBadge = document.createElement('div');
        customBadge.style.cssText = `
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-family: system-ui, -apple-system, sans-serif;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 4px;
          pointer-events: none;
        `;
        customBadge.innerHTML = '❤️ Made with Love';
        
        // Add to body if not already there
        if (!document.querySelector('[data-custom-badge]')) {
          customBadge.setAttribute('data-custom-badge', 'true');
          document.body.appendChild(customBadge);
        }
      }
    }
  };
  
  // Run on page load
  window.addEventListener('load', replaceManusBadge);
  
  // Also run after delays to catch dynamically injected elements
  setTimeout(replaceManusBadge, 100);
  setTimeout(replaceManusBadge, 500);
  setTimeout(replaceManusBadge, 1000);
  
  // Watch for DOM changes
  const observer = new MutationObserver(replaceManusBadge);
  observer.observe(document.body, { childList: true, subtree: true });
}

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);

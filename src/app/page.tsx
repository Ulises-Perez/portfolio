import { Desktop } from "@/components/orbi/desktop";
import { Fallback } from "@/components/orbi/fallback";
import { WindowManagerProvider } from "@/components/orbi/window-manager";

/**
 * Orbi OS: the desktop environment is the site.
 *
 * The document is also rendered without the script, so the portfolio survives
 * a browser that never runs the shell and a crawler that never opens a window.
 */
export default function Home() {
  return (
    <>
      <noscript>
        <Fallback />
      </noscript>
      <WindowManagerProvider>
        <Desktop />
      </WindowManagerProvider>
    </>
  );
}

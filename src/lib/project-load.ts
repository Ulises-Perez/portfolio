/**
 * The loading screen of a project app.
 *
 * It is a per-session flag, not a per-window one: the first time a project is
 * opened the window shows its mark and its ring while the application chunk is
 * fetched, and reopening it from the dock or restoring it from the taskbar
 * goes straight to the content.
 */

/** How long the project loading screen lasts. One number to tune it. */
export const PROJECT_LOAD_MS = 1000;

/** The exit: the content is shown while the loading screen fades away. */
export const PROJECT_LOAD_EXIT_MS = 260;

const key = (project: string) => `orbi-app-${project.toLowerCase()}`;

/** Whether this project already opened its loading screen this session. */
export function hasLoaded(project: string): boolean {
  try {
    return sessionStorage.getItem(key(project)) === "1";
  } catch {
    // Private mode: the screen simply shows every time, which is correct.
    return false;
  }
}

export function markLoaded(project: string): void {
  try {
    sessionStorage.setItem(key(project), "1");
  } catch {
    /* nothing to remember */
  }
}

/** The sentence the screen shows while the app opens. */
export function loadingLine(project: string): string {
  return `Opening ${project}…`;
}

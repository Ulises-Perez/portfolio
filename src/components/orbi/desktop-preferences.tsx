"use client";

import { useEffect, useRef } from "react";

import { WALLPAPERS, type WallpaperId } from "@/lib/wallpaper";

/**
 * The preferences of the desktop: the wallpaper, what the icons are filed as,
 * and the tools that keep the desktop tidy.
 *
 * It is a panel, not a window: it opens over the desktop, and the desktop
 * underneath is inert while it is up. Escape closes it, as does a click on the
 * scrim, and the first control takes focus on open.
 */
export function DesktopPreferences({
  wallpaper,
  onWallpaper,
  onClose,
  onTidy,
  onReset,
}: {
  wallpaper: WallpaperId;
  onWallpaper: (id: WallpaperId) => void;
  onClose: () => void;
  onTidy: () => void;
  onReset: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>("button, [href]")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="os-scrim"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        className="os-prefs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prefs-title"
      >
        <div className="os-prefs__head">
          <div>
            <p className="os-label">system preferences</p>
            <h2 id="prefs-title" className="os-prefs__title">
              Desktop
            </h2>
          </div>
          <button type="button" className="os-btn" onClick={onClose}>
            close
          </button>
        </div>

        <section className="os-prefs__section" aria-labelledby="prefs-wallpaper">
          <p id="prefs-wallpaper" className="os-label">
            wallpaper
          </p>
          <div className="os-prefs__wallpapers" role="radiogroup" aria-label="Wallpaper">
            {WALLPAPERS.map((option) => (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={wallpaper === option.id}
                className="os-prefs__wallpaper"
                data-active={wallpaper === option.id ? "" : undefined}
                onClick={() => onWallpaper(option.id)}
              >
                <span className="os-prefs__swatch" data-swatch={option.id} aria-hidden="true" />
                <span className="os-prefs__wallpaper-name">{option.label}</span>
                <span className="os-prefs__wallpaper-hint">{option.hint}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="os-prefs__section" aria-labelledby="prefs-icons">
          <p id="prefs-icons" className="os-label">
            icons
          </p>
          <div className="os-prefs__actions">
            <button type="button" className="os-btn" onClick={onTidy}>
              tidy up
            </button>
            <button type="button" className="os-btn" onClick={onReset}>
              restore all positions
            </button>
          </div>
          <p className="os-prefs__note">
            Drag a tile to place it, or right click the desktop for the same
            commands. Double click a tile to open its application.
          </p>
        </section>
      </div>
    </div>
  );
}

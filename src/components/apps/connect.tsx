"use client";

import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components/orbi/icons";
import { site } from "@/data/site.config";
import { OPENERS, reply, type Answer } from "@/lib/assistant";
import { profile } from "@/lib/github";

type Turn = {
  from: "visitor" | "desk";
  text?: string;
  answer?: Answer;
};

const first = reply("");

/**
 * Connect — the desk where a visitor can talk.
 *
 * The assistant answers in the browser, from the site config: a deterministic
 * conversation that covers services, price, timing, stack and availability and
 * always ends with a way to reach the person. It never invents an answer; when
 * it does not understand it says so and offers the real channels.
 *
 * The transcript is a live region, so a screen reader follows the conversation.
 */
export function ConnectApp() {
  const [turns, setTurns] = useState<Turn[]>([
    { from: "desk", answer: first },
  ]);
  const [value, setValue] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [turns]);

  const ask = (question: string) => {
    const clean = question.trim();
    if (!clean) return;

    setTurns((list) => [
      ...list,
      { from: "visitor", text: clean },
      { from: "desk", answer: reply(clean) },
    ]);
    setValue("");
  };

  return (
    <div className="os-app h-full">
      <div className="os-app__head flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="os-app__eyebrow">connect · {profile.login}</p>
          <h2 className="os-app__title">Tell me what you need built</h2>
        </div>
        <span className="os-chip">
          <span className="os-status__dot" aria-hidden="true" />
          available
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className="os-chat"
          role="log"
          aria-live="polite"
          aria-label="Conversation"
        >
          {turns.map((turn, index) =>
            turn.from === "visitor" ? (
              <div key={index} className="os-chat__turn" data-from="visitor">
                <span className="os-chat__bubble">{turn.text}</span>
              </div>
            ) : (
              <div key={index} className="os-chat__turn" data-from="desk">
                <span className="os-chat__who">
                  <Icon name="connect" size={13} />
                  desk
                </span>
                <div className="os-chat__card">
                  {turn.answer?.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}

                  {turn.answer?.links?.length ? (
                    <div className="os-chat__links">
                      {turn.answer.links.map((link) => (
                        <a
                          key={link.href}
                          className="os-btn"
                          href={link.href}
                          target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                          rel="noreferrer"
                        >
                          {link.label}
                          <Icon name="arrow" size={12} />
                        </a>
                      ))}
                    </div>
                  ) : null}

                  {turn.answer?.quick?.length ? (
                    <div className="os-chat__quick">
                      {turn.answer.quick.map((question) => (
                        <button
                          key={question}
                          type="button"
                          className="os-chat__suggestion"
                          onClick={() => ask(question)}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ),
          )}

          <div ref={endRef} />
        </div>

        <form
          className="os-chat__form"
          onSubmit={(event) => {
            event.preventDefault();
            ask(value);
          }}
        >
          <input
            className="os-chat__input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Ask about a project, a price, a date…"
            aria-label="Ask the desk"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" className="os-btn" data-primary>
            send
          </button>
        </form>

        <div className="os-chat__openers">
          {OPENERS.slice(0, 4).map((question) => (
            <button
              key={question}
              type="button"
              className="os-chat__suggestion"
              onClick={() => ask(question)}
            >
              {question}
            </button>
          ))}
        </div>

        <a
          className="os-chat__mail"
          href={site.contact.email ? `mailto:${site.contact.email}` : site.contact.github}
        >
          {site.contact.email || site.contact.github}
        </a>
      </div>
    </div>
  );
}

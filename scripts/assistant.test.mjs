import assert from "node:assert/strict";
import { test } from "node:test";

import { OPENERS, reply, score, tokens } from "../src/lib/assistant.ts";

test("a landing page question gets a real answer", () => {
  const answer = reply("Can you build a landing page?");

  assert.equal(answer.id, "landing");
  assert.ok(answer.lines.length > 0);
  assert.ok(answer.quick.length > 0, "the desk offers a next question");
});

test("the same question in Spanish reaches the same desk", () => {
  assert.equal(reply("¿Cuánto cuesta una web?").id, "price");
  assert.equal(reply("¿Trabajas en remoto?").id, "remote");
  assert.equal(reply("hola").id, "greeting");
});

test("price, timing and availability are each reachable", () => {
  assert.equal(reply("what do you charge?").id, "price");
  assert.equal(reply("how long does it take?").id, "time");
  assert.equal(reply("are you available?").id, "availability");
});

test("the trades the desk sells are covered", () => {
  assert.equal(reply("can you make an online store with payments?").id, "ecommerce");
  assert.equal(reply("I need a scraper that runs every night").id, "automation");
  assert.equal(reply("could you add an AI chatbot to my site?").id, "ai");
  assert.equal(reply("can you maintain an existing site?").id, "maintenance");
});

test("a contact question always carries the real channels", () => {
  const answer = reply("how do I contact you?");

  assert.equal(answer.id, "contact");
  assert.ok(answer.links.length > 0);
  assert.ok(answer.links.some((link) => link.href.startsWith("mailto:")));
});

test("an unknown question is admitted, never invented", () => {
  const answer = reply("what is the airspeed velocity of an unladen swallow?");

  assert.equal(answer.id, "fallback");
  assert.ok(answer.lines[0].toLowerCase().includes("could not match"));
  assert.ok(answer.links.length > 0, "the fallback still offers a way out");
});

test("an empty question is an invitation, not an error", () => {
  const answer = reply("   ");

  assert.equal(answer.id, "empty");
  assert.ok(answer.quick.length > 0);
});

test("every opener the desk shows is answerable", () => {
  for (const question of OPENERS) {
    assert.notEqual(reply(question).id, "fallback", `unanswered opener: ${question}`);
  }
});

test("tokens drop the words that carry no meaning", () => {
  assert.deepEqual(tokens("Can you build me a landing page?"), ["build", "landing", "page"]);
  assert.deepEqual(tokens("¿Cuánto cuesta una web?"), ["cuanto", "cuesta", "web"]);
});

test("scoring prefers the phrase over the stray word", () => {
  const landing = { id: "l", words: ["landing"], answer: () => ({}) };
  const multi = { id: "m", words: ["one page"], answer: () => ({}) };

  assert.equal(score(landing, "one page"), 0);
  assert.equal(score(multi, "one page"), 3);
});

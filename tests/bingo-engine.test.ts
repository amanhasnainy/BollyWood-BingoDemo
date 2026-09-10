import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SONGS } from "../client/src/data/songs.ts";
import { generateBingoCard } from "../client/src/utils/generateBingoCard.ts";
import {
  callNextSong,
  checkDiagonal,
  checkFullHouse,
  checkHorizontal,
  checkVertical,
  checkWinner,
  createInitialGameState,
  markSong,
  startGame,
  toggleCellMark,
  T_INDICES,
  L_INDICES,
  U_INDICES,
  H_INDICES,
  BOX_INDICES,
  DIAMOND_INDICES,
} from "../client/src/utils/bingoEngine.ts";

describe("generateBingoCard", () => {
  it("creates a 5x5 card with FREE center and 24 unique songs", () => {
    let seed = 0;
    const random = () => {
      seed = (seed * 16807 + 0) % 2147483647;
      return seed / 2147483647;
    };

    const card = generateBingoCard(SONGS, random);
    assert.equal(card.cells.length, 25);
    assert.equal(card.cells[12].isFree, true);
    assert.equal(card.cells[12].title, "FREE");
    assert.equal(card.cells[12].marked, true);

    const songIds = card.cells.filter((c) => !c.isFree).map((c) => c.id);
    assert.equal(songIds.length, 24);
    assert.equal(new Set(songIds).size, 24);
  });

  it("generates different cards with different seeds", () => {
    const cardA = generateBingoCard(SONGS, () => 0.1);
    const cardB = generateBingoCard(SONGS, () => 0.9);
    const idsA = cardA.cells.map((c) => c.id).join(",");
    const idsB = cardB.cells.map((c) => c.id).join(",");
    assert.notEqual(idsA, idsB);
  });
});

describe("bingoEngine", () => {
  const songIds = SONGS.map((s) => s.id);

  it("startGame sets status to playing", () => {
    const state = createInitialGameState("Bollywood", songIds);
    assert.equal(state.status, "waiting");
    const playing = startGame(state);
    assert.equal(playing.status, "playing");
  });

  it("callNextSong never repeats songs", () => {
    let state = startGame(createInitialGameState("Bollywood", [1, 2, 3, 4, 5]));
    const called = new Set<number>();

    for (let i = 0; i < 5; i++) {
      const result = callNextSong(state);
      assert.ok(result);
      assert.ok(!called.has(result.song.id));
      called.add(result.song.id);
      state = result.state;
    }

    assert.equal(state.remainingSongs.length, 0);
    assert.equal(state.status, "finished");
    assert.equal(callNextSong(state), null);
  });

  it("detects horizontal win", () => {
    const card = generateBingoCard(SONGS, () => 0.5);
    const marked = {
      cells: card.cells.map((cell, i) => ({
        ...cell,
        marked: i < 5 || cell.isFree === true,
      })),
    };
    assert.equal(checkHorizontal(marked, 0), true);
    assert.ok(checkWinner(marked, ["single-line", "horizontal"]));
  });

  it("detects vertical win", () => {
    const card = generateBingoCard(SONGS, () => 0.5);
    const marked = {
      cells: card.cells.map((cell, i) => ({
        ...cell,
        marked: i % 5 === 0 || cell.isFree === true,
      })),
    };
    assert.equal(checkVertical(marked, 0), true);
  });

  it("detects diagonal win", () => {
    const card = generateBingoCard(SONGS, () => 0.5);
    const marked = {
      cells: card.cells.map((cell, i) => ({
        ...cell,
        marked: i % 6 === 0 || cell.isFree === true,
      })),
    };
    assert.equal(checkDiagonal(marked, "main"), true);
  });

  it("detects full house", () => {
    const card = generateBingoCard(SONGS, () => 0.5);
    const marked = {
      cells: card.cells.map((cell) => ({ ...cell, marked: true })),
    };
    assert.equal(checkFullHouse(marked), true);
    assert.ok(checkWinner(marked));
  });

  it("detects custom T pattern win", () => {
    const card = generateBingoCard(SONGS, () => 0.5);
    const marked = {
      cells: card.cells.map((cell, i) => ({
        ...cell,
        marked: T_INDICES.includes(i) || cell.isFree === true,
      })),
    };
    assert.equal(checkWinner(marked, ["pattern-t"])?.pattern, "pattern-t");
  });

  it("detects custom Diamond pattern win", () => {
    const card = generateBingoCard(SONGS, () => 0.5);
    const marked = {
      cells: card.cells.map((cell, i) => ({
        ...cell,
        marked: DIAMOND_INDICES.includes(i) || cell.isFree === true,
      })),
    };
    assert.equal(checkWinner(marked, ["pattern-diamond"])?.pattern, "pattern-diamond");
  });

  it("markSong marks by song id", () => {
    const card = generateBingoCard(SONGS, () => 0.5);
    const target = card.cells.find((c) => !c.isFree)!;
    const updated = markSong(card, target.id);
    const found = updated.cells.find((c) => c.id === target.id);
    assert.equal(found?.marked, true);
  });

  it("toggleCellMark toggles non-free cells", () => {
    const card = generateBingoCard(SONGS, () => 0.5);
    const index = card.cells.findIndex((c) => !c.isFree);
    const toggled = toggleCellMark(card, index);
    assert.equal(toggled.cells[index].marked, true);
    const untoggled = toggleCellMark(toggled, index);
    assert.equal(untoggled.cells[index].marked, false);
  });
});

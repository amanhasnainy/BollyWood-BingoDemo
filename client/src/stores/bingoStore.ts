import { create } from "zustand";
import { SONGS, getSongById } from "@/data/songs";
import type { GameState, PlayerCard, WinResult } from "@/types/bingo";
import {
  callNextSong as callNextSongEngine,
  checkWinner,
  createInitialGameState,
  getWinningCellIndices,
  startGame as startGameEngine,
  toggleCellMark,
} from "@/utils/bingoEngine";
import { generateBingoCard } from "@/utils/generateBingoCard";
import { getRoomByCode, nextSong, startRoomGame } from "@/global/roomsApi";
import { ROOM_INFO } from "@/components/bingo-game/bingoGameData";

function getRoomCodeFromUrl(): string {
  try {
    const hash = window.location.hash || "";
    const parts = hash.replace(/^#/, "").split("/").filter(Boolean);
    if ((parts[0] === "bingo-game" || parts[0] === "room") && parts[1]) {
      return parts[1];
    }
  } catch {
    // ignore
  }
  return ROOM_INFO.roomCode;
}

const DEFAULT_CATEGORY = "Bollywood";
const STORAGE_PREFIX = "bollywood_bingo_room_";
const ALL_PATTERN_IDS = [
  "single-line",
  "vertical-line",
  "diagonal",
  "four-corners",
  "x-pattern",
  "plus-cross",
  "full-house",
  "pattern-t",
  "pattern-l",
  "pattern-u",
  "pattern-h",
  "pattern-z",
  "pattern-box",
  "pattern-diamond",
  "early-five",
  "top-line",
  "middle-line",
  "bottom-line",
];

function buildSongPool(category: string): number[] {
  const filtered = SONGS.filter((s) => s.category === category);
  return (filtered.length >= 24 ? filtered : SONGS).map((s) => s.id);
}

function createFreshState(category: string = DEFAULT_CATEGORY) {
  const songIds = buildSongPool(category);
  const firstCard = generateBingoCard(SONGS.filter((s) => songIds.includes(s.id)));
  return {
    gameState: {
      ...createInitialGameState(category, songIds),
      enabledPatterns: [...ALL_PATTERN_IDS],
    },
    playerCard: firstCard,
    playerCards: [firstCard],
    activeTicketIndex: 0,
    stars: 200,
    winner: null as WinResult | null,
    winningCellIndices: [] as number[],
  };
}

function sanitizeCard(card: PlayerCard, category: string): PlayerCard {
  if (!card || !Array.isArray(card.cells)) {
    const songIds = buildSongPool(category);
    return generateBingoCard(SONGS.filter((s) => songIds.includes(s.id)));
  }
  const hasInvalid = card.cells.some((c) => !c.isFree && (c.id > 75 || c.id < 1));
  if (hasInvalid) {
    const songIds = buildSongPool(category);
    return generateBingoCard(SONGS.filter((s) => songIds.includes(s.id)));
  }
  return card;
}

function loadStateFromStorage(roomCode: string, category: string = DEFAULT_CATEGORY) {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${roomCode}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.playerCards || parsed.playerCard) && parsed.gameState) {
        const rawCards: PlayerCard[] = parsed.playerCards ?? [parsed.playerCard];
        const cards: PlayerCard[] = rawCards.map((c) => sanitizeCard(c, category));
        const activeIdx = Math.min(parsed.activeTicketIndex ?? 0, cards.length - 1);
        return {
          gameState: {
            ...parsed.gameState,
            enabledPatterns: parsed.gameState.enabledPatterns ?? [...ALL_PATTERN_IDS],
          },
          playerCards: cards,
          playerCard: cards[activeIdx] ?? cards[0],
          activeTicketIndex: activeIdx,
          stars: parsed.stars ?? 200,
          winner: parsed.winner ?? null,
          winningCellIndices: parsed.winningCellIndices ?? [],
        };
      }
    }
  } catch {
    // fallback
  }
  return createFreshState(category);
}

function saveStateToStorage(roomCode: string, state: any) {
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}${roomCode}`,
      JSON.stringify({
        gameState: state.gameState,
        playerCards: state.playerCards,
        playerCard: state.playerCards?.[state.activeTicketIndex ?? 0] ?? state.playerCard,
        activeTicketIndex: state.activeTicketIndex,
        stars: state.stars,
        winner: state.winner,
        winningCellIndices: state.winningCellIndices,
      })
    );
  } catch {
    // ignore quota errors
  }
}

let currentAudio: HTMLAudioElement | null = null;

function playSongAudio(audioUrl: string) {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // ignore
    }
    currentAudio = null;
  }

  if (audioUrl) {
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    audio.play().catch((err) => {
      console.log("Audio play note:", err);
    });
  }
}

interface BingoStore {
  gameState: GameState;
  playerCard: PlayerCard;
  playerCards: PlayerCard[];
  activeTicketIndex: number;
  stars: number;
  winner: WinResult | null;
  winningCellIndices: number[];

  initGame: (category?: string) => void;
  fetchRoom: (roomCode?: string) => Promise<void>;
  startGame: (roomCode?: string, patterns?: string[]) => void;
  callNextSong: (roomCode?: string) => void;
  toggleCell: (cellIndex: number) => void;
  buyTicket: () => boolean;
  setActiveTicketIndex: (index: number) => void;
  toggleHostPattern: (patternId: string) => void;
  checkClaimWinner: () => WinResult | null;
  regenerateCard: () => void;
  dismissWinner: () => void;
  resetGame: () => void;
}

export const useBingoStore = create<BingoStore>((set, get) => ({
  ...createFreshState(),

  initGame: (category = DEFAULT_CATEGORY) => {
    const code = getRoomCodeFromUrl();
    const loaded = loadStateFromStorage(code, category);
    set(loaded as any);
  },

  fetchRoom: async (roomCode?: string) => {
    const code = roomCode || getRoomCodeFromUrl();
    try {
      const room = await getRoomByCode(code);
      if (room && typeof room === "object") {
        const rawCalled = room.calledNumbers ?? (room as any).data?.calledNumbers;
        const calledNumbers: number[] = Array.isArray(rawCalled) ? rawCalled : [];
        const roomStatus = String(room.status ?? (room as any).data?.status ?? "waiting");
        const mappedStatus: GameState["status"] = roomStatus === "live" || roomStatus === "playing" ? "playing" : "waiting";

        const { gameState, playerCards, activeTicketIndex, stars, winner, winningCellIndices } = get();
        const lastCalledId = calledNumbers.length > 0 ? calledNumbers[calledNumbers.length - 1] : null;
        const currentSong = lastCalledId ? getSongById(lastCalledId) ?? null : null;
        const songPool = buildSongPool(gameState.category);
        const remainingSongs = songPool.filter((id) => !calledNumbers.includes(id));

        const activeCard = playerCards[activeTicketIndex] ?? playerCards[0];

        const updatedStore = {
          gameState: {
            ...gameState,
            calledSongs: calledNumbers,
            currentSong: currentSong ?? gameState.currentSong,
            remainingSongs,
            status: mappedStatus,
            enabledPatterns: gameState.enabledPatterns ?? [...ALL_PATTERN_IDS],
          },
          playerCards,
          playerCard: activeCard,
          activeTicketIndex,
          stars,
          winner,
          winningCellIndices,
        };

        set(updatedStore as any);
        saveStateToStorage(code, updatedStore);
      }
    } catch (err: any) {
      console.error(`Failed to fetch room data for room ${code}:`, err);
    }
  },

  startGame: async (roomCode?: string, patterns?: string[]) => {
    const code = roomCode || getRoomCodeFromUrl();
    try {
      const activePatterns = patterns ?? get().gameState.enabledPatterns ?? [...ALL_PATTERN_IDS];
      const res = await startRoomGame(code, activePatterns);
      if (res && typeof res === "object") {
        const audioUrl = res.url || (res as any).data?.url;
        const songNumber = res.number ?? (res as any).data?.number;

        if (audioUrl) {
          playSongAudio(audioUrl);
        }

        const { gameState, playerCards, activeTicketIndex, stars } = get();
        const startedState = startGameEngine(gameState);

        if (typeof songNumber === "number") {
          const song = getSongById(songNumber);
          if (song) {
            const remainingSongs = startedState.remainingSongs.filter((id) => id !== song.id);
            const calledSongs = [song.id];

            const newState = {
              gameState: {
                ...startedState,
                currentSong: song,
                calledSongs,
                remainingSongs,
                status: "playing" as const,
                enabledPatterns: activePatterns,
              },
              playerCards,
              playerCard: playerCards[activeTicketIndex] ?? playerCards[0],
              activeTicketIndex,
              stars,
              winner: null,
              winningCellIndices: [],
            };

            set(newState as any);
            saveStateToStorage(code, newState);
            return;
          }
        }

        const newState = {
          gameState: {
            ...startedState,
            enabledPatterns: activePatterns,
          },
          playerCards,
          playerCard: playerCards[activeTicketIndex] ?? playerCards[0],
          activeTicketIndex,
          stars,
          winner: null,
          winningCellIndices: [],
        };
        set(newState as any);
        saveStateToStorage(code, newState);
      }
    } catch (err: any) {
      console.error(`Failed to call start game endpoint for room ${code}:`, err);
    }
  },

  callNextSong: async (roomCode?: string) => {
    const code = roomCode || getRoomCodeFromUrl();
    try {
      const res = await nextSong(code);
      if (res && typeof res === "object") {
        const audioUrl = res.url || (res as any).data?.url;
        const songNumber = res.number ?? (res as any).data?.number;

        if (audioUrl) {
          playSongAudio(audioUrl);
        }

        if (typeof songNumber === "number") {
          const song = getSongById(songNumber);
          if (song) {
            const { gameState, playerCards, activeTicketIndex, stars, winner, winningCellIndices } = get();
            let currentGameState = gameState;
            if (currentGameState.status === "waiting") {
              currentGameState = startGameEngine(currentGameState);
            }
            const remainingSongs = currentGameState.remainingSongs.filter((id) => id !== song.id);
            const calledSongs = currentGameState.calledSongs.includes(song.id)
              ? currentGameState.calledSongs
              : [...currentGameState.calledSongs, song.id];

            const newState = {
              gameState: {
                ...currentGameState,
                currentSong: song,
                calledSongs,
                remainingSongs,
                status: (remainingSongs.length === 0 ? "finished" : "playing") as GameState["status"],
                enabledPatterns: gameState.enabledPatterns ?? [...ALL_PATTERN_IDS],
              },
              playerCards,
              playerCard: playerCards[activeTicketIndex] ?? playerCards[0],
              activeTicketIndex,
              stars,
              winner,
              winningCellIndices,
            };

            set(newState as any);
            saveStateToStorage(code, newState);
          }
        }
      }
    } catch (err: any) {
      console.error(`Failed to call next song endpoint for room ${code}:`, err);
    }
  },

  toggleCell: (cellIndex: number) => {
    const { playerCards, activeTicketIndex, winner, gameState, stars } = get();
    if (winner) return;

    const currentCard = playerCards[activeTicketIndex] ?? playerCards[0];
    if (!currentCard) return;

    const cell = currentCard.cells[cellIndex];
    if (!cell || cell.isFree) return;

    if (!cell.marked && !gameState.calledSongs.includes(cell.id)) {
      return;
    }

    const updatedCard = toggleCellMark(currentCard, cellIndex, gameState.calledSongs);
    const updatedCards = playerCards.map((card, idx) =>
      idx === activeTicketIndex ? updatedCard : card
    );

    const win = checkWinner(updatedCard, gameState.enabledPatterns);
    const code = getRoomCodeFromUrl();

    const newState = {
      playerCards: updatedCards,
      playerCard: updatedCard,
      activeTicketIndex,
      stars,
      winner: win,
      winningCellIndices: win ? getWinningCellIndices(win) : [],
      gameState:
        win && gameState.status === "playing"
          ? { ...gameState, status: "finished" as const }
          : gameState,
    };

    set(newState as any);
    saveStateToStorage(code, newState);
  },

  buyTicket: () => {
    const { playerCards, stars, gameState } = get();
    if (playerCards.length >= 3 || stars < 50) return false;

    const songIds = buildSongPool(gameState.category);
    const newCard = generateBingoCard(SONGS.filter((s) => songIds.includes(s.id)));
    const updatedCards = [...playerCards, newCard];
    const newStars = stars - 50;
    const newIndex = updatedCards.length - 1;
    const code = getRoomCodeFromUrl();

    const newState = {
      playerCards: updatedCards,
      playerCard: newCard,
      activeTicketIndex: newIndex,
      stars: newStars,
    };

    set(newState as any);
    saveStateToStorage(code, { ...get(), ...newState });
    return true;
  },

  setActiveTicketIndex: (index: number) => {
    const { playerCards } = get();
    if (index >= 0 && index < playerCards.length) {
      const activeCard = playerCards[index];
      const code = getRoomCodeFromUrl();
      const newState = { activeTicketIndex: index, playerCard: activeCard };
      set(newState as any);
      saveStateToStorage(code, { ...get(), ...newState });
    }
  },

  toggleHostPattern: (patternId: string) => {
    const { gameState } = get();
    const current = gameState.enabledPatterns ?? [...ALL_PATTERN_IDS];
    const updated = current.includes(patternId)
      ? current.filter((p) => p !== patternId)
      : [...current, patternId];

    const code = getRoomCodeFromUrl();
    const newGameState = { ...gameState, enabledPatterns: updated };
    set({ gameState: newGameState } as any);
    saveStateToStorage(code, { ...get(), gameState: newGameState });
  },

  checkClaimWinner: () => {
    const { playerCards, activeTicketIndex, gameState } = get();
    const currentCard = playerCards[activeTicketIndex] ?? playerCards[0];
    if (!currentCard) return null;
    const win = checkWinner(currentCard, gameState.enabledPatterns);
    const code = getRoomCodeFromUrl();

    if (win) {
      const indices = getWinningCellIndices(win);
      set({ winner: win, winningCellIndices: indices } as any);
      saveStateToStorage(code, { ...get(), winner: win, winningCellIndices: indices });
    }
    return win;
  },

  regenerateCard: () => {
    const { gameState, winner, activeTicketIndex, playerCards } = get();
    if (winner) return;

    const songIds = buildSongPool(gameState.category);
    const code = getRoomCodeFromUrl();
    const newCard = generateBingoCard(SONGS.filter((s) => songIds.includes(s.id)));
    const updatedCards = playerCards.map((card, idx) =>
      idx === activeTicketIndex ? newCard : card
    );

    const newState = {
      gameState,
      playerCards: updatedCards,
      playerCard: newCard,
      winner: null,
      winningCellIndices: [],
    };

    set(newState as any);
    saveStateToStorage(code, newState);
  },

  dismissWinner: () => {
    const code = getRoomCodeFromUrl();
    const newState = { ...get(), winner: null, winningCellIndices: [] };
    set(newState as any);
    saveStateToStorage(code, newState);
  },

  resetGame: () => {
    const { gameState } = get();
    const fresh = createFreshState(gameState.category);
    const code = getRoomCodeFromUrl();
    set(fresh as any);
    saveStateToStorage(code, fresh);
  },
}));

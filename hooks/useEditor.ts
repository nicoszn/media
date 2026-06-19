"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  EditorOrchestrator,
  MediaFile,
  OperationConfig,
  ProcessResult,
  OrchestratorState,
  SplitSegment,
} from "@/lib/EditorOrchestrator";

const MAX_HISTORY = 5;

export interface HistoryEntry {
  media: MediaFile;          // the currently active view of this step
  label: string;             // e.g. "Original", "Trim", "Split"
  siblings?: MediaFile[];    // present only for split/multisplit — all segments
  activeSiblingIndex?: number;
}

interface EditorState {
  orchestratorState: OrchestratorState;
  history: HistoryEntry[];
  result: ProcessResult | null;
  progress: number;
  progressMessage: string;
  logs: string[];
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
}

interface UseEditorReturn extends Omit<EditorState, "history"> {
  history: HistoryEntry[];
  mediaFile: MediaFile | null;
  canUndo: boolean;
  activeEntry: HistoryEntry | null;
  loadFile: (file: File) => Promise<void>;
  processFile: (config: OperationConfig) => Promise<void>;
  mergeFiles: (files: File[]) => Promise<void>;
  selectSibling: (index: number) => void;
  undo: () => void;
  clearResult: () => void;
  clearFile: () => void;
  ensureLoaded: () => Promise<void>;
}

const OP_LABELS: Record<string, string> = {
  trim: "Trim",
  split: "Split",
  resize: "Resize",
  compress: "Compress",
  speed: "Speed",
  loop: "Loop",
  fps: "Frame Rate",
  flip: "Flip",
  reverse: "Reverse",
  extract_audio: "Extract Audio",
  extract_frames: "Extract Frames",
  aspect_ratio: "Aspect Ratio",
  format_convert: "Convert Format",
  volume: "Volume",
  rotate: "Rotate",
  denoise: "Denoise",
};

// Revoke every URL owned by a history entry — active media AND all siblings.
// Siblings share no URLs with `media` except when activeSiblingIndex points
// at the same segment, so this must walk the full sibling list independently.
function revokeEntry(entry: HistoryEntry) {
  URL.revokeObjectURL(entry.media.url);
  entry.siblings?.forEach((s) => {
    if (s.url !== entry.media.url) URL.revokeObjectURL(s.url);
  });
}

export function useEditor(): UseEditorReturn {
  const orchestrator = useRef<EditorOrchestrator>(EditorOrchestrator.getInstance());

  const [state, setState] = useState<EditorState>({
    orchestratorState: "idle",
    history: [],
    result: null,
    progress: 0,
    progressMessage: "",
    logs: [],
    isLoading: false,
    isProcessing: false,
    error: null,
  });

  useEffect(() => {
    const orch = orchestrator.current;
    orch.onProgress((progress, message) => {
      setState((s) => ({ ...s, progress, progressMessage: message }));
    });
    orch.onLog((message) => {
      if (!message.trim()) return;
      setState((s) => ({ ...s, logs: [...s.logs.slice(-99), message] }));
    });
  }, []);

  const ensureLoaded = useCallback(async () => {
    if (orchestrator.current.isLoaded()) return;
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      await orchestrator.current.load();
      setState((s) => ({ ...s, isLoading: false, orchestratorState: "ready" }));
    } catch (e) {
      setState((s) => ({ ...s, isLoading: false, error: String(e), orchestratorState: "error" }));
    }
  }, []);

  // ─── Push a new entry, evicting the oldest beyond MAX_HISTORY ────────────────
  // Eviction revokes the FULL entry (media + all siblings), not just one URL.

  const pushHistory = useCallback((entry: HistoryEntry) => {
    setState((s) => {
      const next = [...s.history, entry];
      if (next.length > MAX_HISTORY) {
        const evicted = next.shift();
        if (evicted) revokeEntry(evicted);
      }
      return { ...s, history: next };
    });
  }, []);

  // ─── Load a brand-new file — resets the entire stack ──────────────────────────

  const loadFile = useCallback(async (file: File) => {
    setState((s) => {
      s.history.forEach(revokeEntry);
      return s;
    });

    const url = URL.createObjectURL(file);
    const probe = await orchestrator.current.probeMedia(file);
    const mediaFile: MediaFile = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      url,
      ...probe,
    };
    setState((s) => ({
      ...s,
      history: [{ media: mediaFile, label: "Original" }],
      result: null,
      error: null,
      logs: [],
    }));
    await ensureLoaded();
  }, [ensureLoaded]);

  // ─── Convert a processed blob URL back into a File for chained operations ────

  const resultToFile = useCallback(async (
    url: string,
    name: string,
    mimeType: string
  ): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], name, { type: mimeType || blob.type });
  }, []);

 // REPLACE the segmentToMediaFile function:
  const segmentToMediaFile = useCallback(async (
    seg: SplitSegment,
    fallbackType: string
  ): Promise<MediaFile> => {
    const probe = await orchestrator.current.probeMedia(
      await resultToFile(seg.url, seg.name, fallbackType)
    );
    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file: new File([], seg.name, { type: fallbackType }),
      name: seg.name,
      size: seg.size,
      type: fallbackType,
      url: seg.url,
      ...probe,
    };
  }, [resultToFile]);

// WITH:
  const segmentToMediaFile = useCallback(async (
    seg: SplitSegment,
    fallbackType: string
  ): Promise<MediaFile> => {
    const realFile = await resultToFile(seg.url, seg.name, fallbackType);
    const probe = await orchestrator.current.probeMedia(realFile);
    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file: realFile,
      name: seg.name,
      size: seg.size,
      type: fallbackType,
      url: seg.url, // reuse the existing blob URL — avoids creating a duplicate
      ...probe,
    };
  }, [resultToFile]);


  
  const processFile = useCallback(async (config: OperationConfig) => {
    const active = state.history[state.history.length - 1]?.media ?? null;
    if (!active) {
      setState((s) => ({ ...s, error: "No file loaded. Drop a file before running an operation." }));
      return;
    }

    setState((s) => ({
      ...s, isProcessing: true, error: null, result: null, progress: 0, orchestratorState: "processing",
    }));

    const result = await orchestrator.current.process(active, config);

    setState((s) => ({
      ...s,
      isProcessing: false,
      result,
      error: "error" in result ? result.error ?? null : null,
      orchestratorState: result.success ? "done" : "error",
      progress: result.success ? 100 : 0,
    }));

    if (!result.success) return;

    // ── Split result: build one MediaFile per segment, push ONE history entry
    //    holding all of them as siblings. The first segment is active by default.
    if ("segments" in result) {
      try {
        const siblingMedia = await Promise.all(
          result.segments.map((seg) => segmentToMediaFile(seg, active.type))
        );
        pushHistory({
          media: siblingMedia[0],
          label: OP_LABELS.split,
          siblings: siblingMedia,
          activeSiblingIndex: 0,
        });
      } catch {
        // Result remains downloadable even if promotion into history fails.
      }
      return;
    }

    // ── Frame extraction: images, not chainable video/audio — no promotion ────
    if ("frameUrls" in result) return;

    // ── Standard single-output result — promote directly ──────────────────────
    if ("outputUrl" in result && result.outputUrl && "outputName" in result) {
      try {
        const promoted = await resultToFile(
          result.outputUrl,
          result.outputName ?? `output_${Date.now()}`,
          active.type
        );
        const probe = await orchestrator.current.probeMedia(promoted);
        const newMedia: MediaFile = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file: promoted,
          name: promoted.name,
          size: promoted.size,
          type: promoted.type || active.type,
          url: result.outputUrl,
          ...probe,
        };
        pushHistory({ media: newMedia, label: OP_LABELS[config.type] ?? config.type });
      } catch {
        // non-fatal
      }
    }
  }, [state.history, pushHistory, resultToFile, segmentToMediaFile]);

  const mergeFiles = useCallback(async (files: File[]) => {
    if (files.length < 2) {
      setState((s) => ({ ...s, error: "Select at least 2 files to merge." }));
      return;
    }
    setState((s) => ({
      ...s, isProcessing: true, error: null, result: null, progress: 0, orchestratorState: "processing",
    }));
    const result = await orchestrator.current.mergeMultiple(files);
    setState((s) => ({
      ...s,
      isProcessing: false,
      result,
      error: result.error ?? null,
      orchestratorState: result.success ? "done" : "error",
      progress: result.success ? 100 : 0,
    }));

    if (result.success && result.outputUrl && result.outputName) {
      try {
        const promoted = await resultToFile(result.outputUrl, result.outputName, "video/mp4");
        const probe = await orchestrator.current.probeMedia(promoted);
        const newMedia: MediaFile = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file: promoted,
          name: promoted.name,
          size: promoted.size,
          type: promoted.type || "video/mp4",
          url: result.outputUrl,
          ...probe,
        };
        pushHistory({ media: newMedia, label: "Merge" });
      } catch {
        // non-fatal
      }
    }
  }, [pushHistory, resultToFile]);

  // ─── selectSibling — switch which segment is active WITHOUT a new stack push.
  //     No URLs are created or revoked here; all siblings are already alive.

  const selectSibling = useCallback((index: number) => {
    setState((s) => {
      const top = s.history[s.history.length - 1];
      if (!top?.siblings || index < 0 || index >= top.siblings.length) return s;
      const next = [...s.history];
      next[next.length - 1] = {
        ...top,
        media: top.siblings[index],
        activeSiblingIndex: index,
      };
      return { ...s, history: next, result: null, error: null };
    });
  }, []);

  // ─── Undo — pop the stack, revoke the FULL discarded entry (media + siblings) ─

  const undo = useCallback(() => {
    setState((s) => {
      if (s.history.length <= 1) return s;
      const next = [...s.history];
      const removed = next.pop();
      if (removed) revokeEntry(removed);
      return { ...s, history: next, result: null, error: null };
    });
  }, []);

  const clearResult = useCallback(() => {
    setState((s) => ({ ...s, result: null, progress: 0, error: null }));
  }, []);

  const clearFile = useCallback(() => {
    setState((s) => {
      s.history.forEach(revokeEntry);
      return { ...s, history: [], result: null, progress: 0, error: null, logs: [], orchestratorState: "ready" };
    });
  }, []);

  const activeEntry = state.history.length > 0 ? state.history[state.history.length - 1] : null;
  const mediaFile = activeEntry?.media ?? null;

  return {
    ...state,
    mediaFile,
    activeEntry,
    canUndo: state.history.length > 1,
    loadFile,
    processFile,
    mergeFiles,
    selectSibling,
    undo,
    clearResult,
    clearFile,
    ensureLoaded,
  };
}

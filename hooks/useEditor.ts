"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  EditorOrchestrator,
  MediaFile,
  OperationConfig,
  ProcessResult,
  OrchestratorState,
} from "@/lib/EditorOrchestrator";

const MAX_HISTORY = 5;

export interface HistoryEntry {
  media: MediaFile;
  label: string; // e.g. "Original", "Trim", "Speed 1.5×"
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
  mediaFile: MediaFile | null; // convenience accessor — top of stack
  canUndo: boolean;
  loadFile: (file: File) => Promise<void>;
  processFile: (config: OperationConfig) => Promise<void>;
  mergeFiles: (files: File[]) => Promise<void>;
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
      setState((s) => ({
        ...s,
        isLoading: false,
        error: String(e),
        orchestratorState: "error",
      }));
    }
  }, []);

  // ─── Push a new entry, evicting the oldest beyond MAX_HISTORY ────────────────

  const pushHistory = useCallback((entry: HistoryEntry) => {
    setState((s) => {
      const next = [...s.history, entry];
      if (next.length > MAX_HISTORY) {
        const evicted = next.shift();
        if (evicted) URL.revokeObjectURL(evicted.media.url);
      }
      return { ...s, history: next };
    });
  }, []);

  // ─── Load a brand-new file — resets the entire stack ──────────────────────────

  const loadFile = useCallback(async (file: File) => {
    setState((s) => {
      s.history.forEach((h) => URL.revokeObjectURL(h.media.url));
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

  // ─── Convert a processed blob URL back into a File for the next operation ────

  const resultToFile = useCallback(async (
    url: string,
    name: string,
    mimeType: string
  ): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], name, { type: mimeType || blob.type });
  }, []);

  const processFile = useCallback(async (config: OperationConfig) => {
    const active = state.history[state.history.length - 1]?.media ?? null;
    if (!active) {
      setState((s) => ({ ...s, error: "No file loaded. Drop a file before running an operation." }));
      return;
    }

    setState((s) => ({
      ...s,
      isProcessing: true,
      error: null,
      result: null,
      progress: 0,
      orchestratorState: "processing",
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

    // Only standard single-output results promote cleanly into the next step.
    // Split / multisplit / frame extraction produce multiple files — those stay
    // as downloadable results without becoming the new active media.
    if (result.success && "outputUrl" in result && result.outputUrl && "outputName" in result) {
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
          url: result.outputUrl, // reuse — avoid creating a duplicate blob URL
          ...probe,
        };
        pushHistory({ media: newMedia, label: OP_LABELS[config.type] ?? config.type });
      } catch {
        // If promotion fails, the result is still shown/downloadable —
        // it just won't become the active media for the next operation.
      }
    }
  }, [state.history, pushHistory, resultToFile]);

  const mergeFiles = useCallback(async (files: File[]) => {
    if (files.length < 2) {
      setState((s) => ({ ...s, error: "Select at least 2 files to merge." }));
      return;
    }
    setState((s) => ({
      ...s,
      isProcessing: true,
      error: null,
      result: null,
      progress: 0,
      orchestratorState: "processing",
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
        // non-fatal — merge result remains downloadable
      }
    }
  }, [pushHistory, resultToFile]);

  // ─── Undo — pop the stack, revoke the discarded entry's URL ──────────────────

  const undo = useCallback(() => {
    setState((s) => {
      if (s.history.length <= 1) return s;
      const next = [...s.history];
      const removed = next.pop();
      if (removed) URL.revokeObjectURL(removed.media.url);
      return { ...s, history: next, result: null, error: null };
    });
  }, []);

  const clearResult = useCallback(() => {
    setState((s) => ({ ...s, result: null, progress: 0, error: null }));
  }, []);

  const clearFile = useCallback(() => {
    setState((s) => {
      s.history.forEach((h) => URL.revokeObjectURL(h.media.url));
      return {
        ...s,
        history: [],
        result: null,
        progress: 0,
        error: null,
        logs: [],
        orchestratorState: "ready",
      };
    });
  }, []);

  const mediaFile = state.history.length > 0
    ? state.history[state.history.length - 1].media
    : null;

  return {
    ...state,
    mediaFile,
    canUndo: state.history.length > 1,
    loadFile,
    processFile,
    mergeFiles,
    undo,
    clearResult,
    clearFile,
    ensureLoaded,
  };
}

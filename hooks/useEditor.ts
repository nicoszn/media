"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  EditorOrchestrator,
  MediaFile,
  OperationConfig,
  ProcessResult,
  OrchestratorState,
} from "@/lib/EditorOrchestrator";

interface EditorState {
  orchestratorState: OrchestratorState;
  mediaFile: MediaFile | null;
  result: ProcessResult | null;
  progress: number;
  progressMessage: string;
  logs: string[];
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
}

interface UseEditorReturn extends EditorState {
  loadFile: (file: File) => Promise<void>;
  processFile: (config: OperationConfig) => Promise<void>;
  mergeFiles: (files: File[]) => Promise<void>;
  clearResult: () => void;
  clearFile: () => void;
  ensureLoaded: () => Promise<void>;
}

export function useEditor(): UseEditorReturn {
  const orchestrator = useRef<EditorOrchestrator>(EditorOrchestrator.getInstance());

  const [state, setState] = useState<EditorState>({
    orchestratorState: "idle",
    mediaFile: null,
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
      // Keep last 100 lines; skip blank/redundant FFmpeg noise
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

  const loadFile = useCallback(async (file: File) => {
    // Revoke previous object URL before replacing
    setState((s) => {
      if (s.mediaFile?.url) URL.revokeObjectURL(s.mediaFile.url);
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
    setState((s) => ({ ...s, mediaFile, result: null, error: null, logs: [] }));
    await ensureLoaded();
  }, [ensureLoaded]);

  const processFile = useCallback(async (config: OperationConfig) => {
    // Explicit error state when called without a file loaded
    if (!state.mediaFile) {
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
    const result = await orchestrator.current.process(state.mediaFile, config);
    setState((s) => ({
      ...s,
      isProcessing: false,
      result,
      error: "error" in result ? result.error ?? null : null,
      orchestratorState: "success" in result || result.success ? "done" : "error",
      progress: result.success ? 100 : 0,
    }));
  }, [state.mediaFile]);

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
  }, []);

  const clearResult = useCallback(() => {
    setState((s) => ({ ...s, result: null, progress: 0, error: null }));
  }, []);

  const clearFile = useCallback(() => {
    setState((s) => {
      if (s.mediaFile?.url) URL.revokeObjectURL(s.mediaFile.url);
      return {
        ...s,
        mediaFile: null,
        result: null,
        progress: 0,
        error: null,
        logs: [],
        orchestratorState: "ready",
      };
    });
  }, []);

  return {
    ...state,
    loadFile,
    processFile,
    mergeFiles,
    clearResult,
    clearFile,
    ensureLoaded,
  };
}

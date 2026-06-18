"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OperationType =
  | "split"
  | "merge"
  | "resize"
  | "compress"
  | "speed"
  | "loop"
  | "fps"
  | "flip"
  | "reverse"
  | "extract_audio"
  | "extract_frames"
  | "aspect_ratio"
  | "format_convert"
  | "trim"
  | "volume"
  | "rotate"
  | "watermark"
  | "denoise";

export interface MediaFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  duration?: number;
  width?: number;
  height?: number;
  url: string;
}

export interface OperationConfig {
  type: OperationType;
  // Split
  splitAt?: number; // seconds
  // Trim
  trimStart?: number;
  trimEnd?: number;
  // Resize
  width?: number;
  height?: number;
  maintainAspect?: boolean;
  // Compress
  crf?: number; // 0-51, lower = better quality
  videoBitrate?: string; // e.g. "1000k"
  audioBitrate?: string; // e.g. "128k"
  // Speed
  speedFactor?: number; // 0.25 - 4.0
  // Loop
  loopCount?: number;
  // FPS
  targetFps?: number;
  // Flip
  flipDirection?: "horizontal" | "vertical" | "both";
  // Aspect Ratio
  aspectRatio?: "16:9" | "9:16" | "1:1" | "4:3" | "3:4" | "21:9" | "custom";
  customAspectW?: number;
  customAspectH?: number;
  // Format
  outputFormat?: string;
  // Volume
  volumeLevel?: number; // 0.0 - 3.0
  // Rotate
  rotateDegrees?: 90 | 180 | 270;
  // Frames
  frameRate?: number; // extract every N frames
  // Denoise
  denoiseStrength?: number;
}

export interface ProcessResult {
  success: boolean;
  outputUrl?: string;
  outputName?: string;
  outputSize?: number;
  duration?: number;
  error?: string;
}

export type OrchestratorState =
  | "idle"
  | "loading"
  | "ready"
  | "processing"
  | "done"
  | "error";

export type ProgressCallback = (progress: number, message: string) => void;
export type LogCallback = (message: string) => void;

// ─── EditorOrchestrator ───────────────────────────────────────────────────────

export class EditorOrchestrator {
  private static instance: EditorOrchestrator | null = null;
  private ffmpeg: FFmpeg;
  private state: OrchestratorState = "idle";
  private progressCb: ProgressCallback | null = null;
  private logCb: LogCallback | null = null;
  private loadPromise: Promise<void> | null = null;

  private constructor() {
    this.ffmpeg = new FFmpeg();
    this.ffmpeg.on("log", ({ message }) => {
      this.logCb?.(message);
    });
    this.ffmpeg.on("progress", ({ progress }) => {
      const pct = Math.round(progress * 100);
      this.progressCb?.(pct, `Processing… ${pct}%`);
    });
  }

  static getInstance(): EditorOrchestrator {
    if (!EditorOrchestrator.instance) {
      EditorOrchestrator.instance = new EditorOrchestrator();
    }
    return EditorOrchestrator.instance;
  }

  static resetInstance(): void {
    EditorOrchestrator.instance = null;
  }

  getState(): OrchestratorState {
    return this.state;
  }

  onProgress(cb: ProgressCallback) {
    this.progressCb = cb;
  }

  onLog(cb: LogCallback) {
    this.logCb = cb;
  }

  async load(): Promise<void> {
    if (this.state === "ready") return;
    if (this.loadPromise) return this.loadPromise;

    this.state = "loading";
    this.loadPromise = (async () => {
      try {
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
        await this.ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
        });
        this.state = "ready";
      } catch (e) {
        this.state = "error";
        this.loadPromise = null;
        throw new Error(`Failed to load FFmpeg: ${e}`);
      }
    })();

    return this.loadPromise;
  }

  isLoaded(): boolean {
    return this.state === "ready" || this.state === "processing" || this.state === "done";
  }

  async probeMedia(file: File): Promise<Partial<MediaFile>> {
    return new Promise((resolve) => {
      if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
        const el = document.createElement(
          file.type.startsWith("video/") ? "video" : "audio"
        ) as HTMLVideoElement;
        el.preload = "metadata";
        el.onloadedmetadata = () => {
          resolve({
            duration: el.duration,
            width: (el as HTMLVideoElement).videoWidth || undefined,
            height: (el as HTMLVideoElement).videoHeight || undefined,
          });
          URL.revokeObjectURL(el.src);
        };
        el.onerror = () => resolve({});
        el.src = URL.createObjectURL(file);
      } else {
        resolve({});
      }
    });
  }

  private getExtension(filename: string): string {
    return filename.split(".").pop()?.toLowerCase() || "mp4";
  }

  private buildOutputName(inputName: string, op: OperationType, ext?: string): string {
    const base = inputName.replace(/\.[^/.]+$/, "");
    const outExt = ext || this.getExtension(inputName);
    return `${base}_${op}.${outExt}`;
  }

  async process(
    media: MediaFile,
    config: OperationConfig
  ): Promise<ProcessResult> {
    if (!this.isLoaded()) {
      await this.load();
    }

    this.state = "processing";
    const inputName = media.name;

    try {
      // Write input file to FFmpeg FS
      await this.ffmpeg.writeFile(inputName, await fetchFile(media.file));

      let outputName = "";
      let args: string[] = [];

      switch (config.type) {
        case "trim": {
          outputName = this.buildOutputName(inputName, "trim");
          const start = config.trimStart ?? 0;
          const end = config.trimEnd ?? media.duration ?? 60;
          args = [
            "-i", inputName,
            "-ss", String(start),
            "-to", String(end),
            "-c", "copy",
            outputName,
          ];
          break;
        }

        case "split": {
          // Returns first segment; second segment as _part2
          const splitAt = config.splitAt ?? (media.duration ? media.duration / 2 : 30);
          outputName = this.buildOutputName(inputName, "split");
          const part2 = this.buildOutputName(inputName, "split").replace("_split.", "_split_part2.");
          args = [
            "-i", inputName,
            "-t", String(splitAt),
            "-c", "copy", outputName,
          ];
          // Process part 1
          await this.ffmpeg.exec(args);
          // Process part 2
          await this.ffmpeg.exec([
            "-i", inputName,
            "-ss", String(splitAt),
            "-c", "copy", part2,
          ]);
          // Return part1 as primary output
          const data = await this.ffmpeg.readFile(outputName);
          const blob = new Blob([data], { type: media.type });
          const url = URL.createObjectURL(blob);
          this.state = "done";
          return {
            success: true,
            outputUrl: url,
            outputName,
            outputSize: blob.size,
          };
        }

        case "merge": {
          // For merge we use the single file; real merge handled via mergeMultiple
          outputName = this.buildOutputName(inputName, "merge");
          args = ["-i", inputName, "-c", "copy", outputName];
          break;
        }

        case "resize": {
          outputName = this.buildOutputName(inputName, "resize");
          const w = config.width ?? -2;
          const h = config.height ?? -2;
          const scale = `scale=${w}:${h}`;
          args = ["-i", inputName, "-vf", scale, "-c:a", "copy", outputName];
          break;
        }

        case "compress": {
          outputName = this.buildOutputName(inputName, "compress");
          const crf = config.crf ?? 28;
          args = [
            "-i", inputName,
            "-c:v", "libx264",
            "-crf", String(crf),
            "-preset", "fast",
            "-c:a", "aac",
            "-b:a", config.audioBitrate ?? "128k",
            outputName,
          ];
          break;
        }

        case "speed": {
          outputName = this.buildOutputName(inputName, "speed");
          const factor = config.speedFactor ?? 1.5;
          const vFactor = `setpts=${(1 / factor).toFixed(4)}*PTS`;
          // atempo supports 0.5–2.0 range; chain for wider range
          const aFactor = this.buildAtempoChain(factor);
          args = [
            "-i", inputName,
            "-filter:v", vFactor,
            "-filter:a", aFactor,
            outputName,
          ];
          break;
        }

        case "loop": {
          outputName = this.buildOutputName(inputName, "loop");
          const count = (config.loopCount ?? 3) - 1;
          args = [
            "-stream_loop", String(count),
            "-i", inputName,
            "-c", "copy",
            outputName,
          ];
          break;
        }

        case "fps": {
          outputName = this.buildOutputName(inputName, "fps");
          const fps = config.targetFps ?? 30;
          args = [
            "-i", inputName,
            "-filter:v", `fps=${fps}`,
            "-c:a", "copy",
            outputName,
          ];
          break;
        }

        case "flip": {
          outputName = this.buildOutputName(inputName, "flip");
          const dir = config.flipDirection ?? "horizontal";
          const filterMap = {
            horizontal: "hflip",
            vertical: "vflip",
            both: "hflip,vflip",
          };
          args = [
            "-i", inputName,
            "-vf", filterMap[dir],
            "-c:a", "copy",
            outputName,
          ];
          break;
        }

        case "reverse": {
          outputName = this.buildOutputName(inputName, "reverse");
          args = [
            "-i", inputName,
            "-vf", "reverse",
            "-af", "areverse",
            outputName,
          ];
          break;
        }

        case "extract_audio": {
          outputName = this.buildOutputName(inputName, "extract_audio", "mp3");
          args = [
            "-i", inputName,
            "-vn",
            "-acodec", "libmp3lame",
            "-ab", "192k",
            outputName,
          ];
          break;
        }

        case "extract_frames": {
          outputName = this.buildOutputName(inputName, "extract_frames", "jpg");
          const rate = config.frameRate ?? 1;
          args = [
            "-i", inputName,
            "-vf", `fps=1/${rate}`,
            "-q:v", "2",
            outputName,
          ];
          break;
        }

        case "aspect_ratio": {
          outputName = this.buildOutputName(inputName, "aspect_ratio");
          const [aw, ah] = this.resolveAspectRatio(config);
          const padFilter = `scale=iw*min(${aw}/iw\\,${ah}/ih):ih*min(${aw}/iw\\,${ah}/ih),pad=${aw}:${ah}:(ow-iw)/2:(oh-ih)/2:black`;
          args = [
            "-i", inputName,
            "-vf", padFilter,
            "-c:a", "copy",
            outputName,
          ];
          break;
        }

        case "format_convert": {
          const ext = config.outputFormat ?? "mp4";
          outputName = this.buildOutputName(inputName, "format_convert", ext);
          args = ["-i", inputName, outputName];
          break;
        }

        case "volume": {
          outputName = this.buildOutputName(inputName, "volume");
          const vol = config.volumeLevel ?? 1.5;
          args = [
            "-i", inputName,
            "-af", `volume=${vol}`,
            "-c:v", "copy",
            outputName,
          ];
          break;
        }

        case "rotate": {
          outputName = this.buildOutputName(inputName, "rotate");
          const deg = config.rotateDegrees ?? 90;
          const transposeMap: Record<number, string> = {
            90: "transpose=1",
            180: "transpose=2,transpose=2",
            270: "transpose=2",
          };
          args = [
            "-i", inputName,
            "-vf", transposeMap[deg],
            "-c:a", "copy",
            outputName,
          ];
          break;
        }

        case "denoise": {
          outputName = this.buildOutputName(inputName, "denoise");
          const strength = config.denoiseStrength ?? 5;
          args = [
            "-i", inputName,
            "-vf", `hqdn3d=${strength}:${strength}:${strength * 3}:${strength * 3}`,
            "-c:a", "copy",
            outputName,
          ];
          break;
        }

        default:
          throw new Error(`Unknown operation: ${config.type}`);
      }

      if (args.length > 0) {
        await this.ffmpeg.exec(args);
      }

      const data = await this.ffmpeg.readFile(outputName);
      const mimeType = this.getMimeType(outputName, media.type);
      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);

      // Cleanup FS
      await this.ffmpeg.deleteFile(inputName).catch(() => {});
      await this.ffmpeg.deleteFile(outputName).catch(() => {});

      this.state = "done";
      return {
        success: true,
        outputUrl: url,
        outputName,
        outputSize: blob.size,
      };
    } catch (error) {
      this.state = "error";
      const msg = error instanceof Error ? error.message : String(error);
      return { success: false, error: msg };
    }
  }

  async mergeMultiple(files: File[]): Promise<ProcessResult> {
    if (!this.isLoaded()) await this.load();
    this.state = "processing";

    try {
      // Write all files
      const fileList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const name = `input_${i}.${this.getExtension(files[i].name)}`;
        await this.ffmpeg.writeFile(name, await fetchFile(files[i]));
        fileList.push(name);
      }

      // Create concat list
      const concatContent = fileList.map((f) => `file '${f}'`).join("\n");
      const encoder = new TextEncoder();
      await this.ffmpeg.writeFile("concat.txt", encoder.encode(concatContent));

      const outputName = "merged_output.mp4";
      await this.ffmpeg.exec([
        "-f", "concat",
        "-safe", "0",
        "-i", "concat.txt",
        "-c", "copy",
        outputName,
      ]);

      const data = await this.ffmpeg.readFile(outputName);
      const blob = new Blob([data], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);

      // Cleanup
      for (const f of fileList) await this.ffmpeg.deleteFile(f).catch(() => {});
      await this.ffmpeg.deleteFile("concat.txt").catch(() => {});
      await this.ffmpeg.deleteFile(outputName).catch(() => {});

      this.state = "done";
      return { success: true, outputUrl: url, outputName, outputSize: blob.size };
    } catch (error) {
      this.state = "error";
      return { success: false, error: String(error) };
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private buildAtempoChain(factor: number): string {
    // atempo only accepts 0.5–2.0; chain for values outside range
    if (factor >= 0.5 && factor <= 2.0) return `atempo=${factor}`;
    if (factor > 2.0) {
      const chains: string[] = [];
      let remaining = factor;
      while (remaining > 2.0) {
        chains.push("atempo=2.0");
        remaining /= 2.0;
      }
      chains.push(`atempo=${remaining.toFixed(4)}`);
      return chains.join(",");
    }
    // factor < 0.5
    const chains: string[] = [];
    let remaining = factor;
    while (remaining < 0.5) {
      chains.push("atempo=0.5");
      remaining /= 0.5;
    }
    chains.push(`atempo=${remaining.toFixed(4)}`);
    return chains.join(",");
  }

  private resolveAspectRatio(config: OperationConfig): [number, number] {
    const map: Record<string, [number, number]> = {
      "16:9": [1920, 1080],
      "9:16": [1080, 1920],
      "1:1": [1080, 1080],
      "4:3": [1440, 1080],
      "3:4": [1080, 1440],
      "21:9": [2560, 1080],
    };
    if (config.aspectRatio === "custom") {
      return [config.customAspectW ?? 1920, config.customAspectH ?? 1080];
    }
    return map[config.aspectRatio ?? "16:9"] ?? [1920, 1080];
  }

  private getMimeType(filename: string, fallback: string): string {
    const ext = this.getExtension(filename);
    const map: Record<string, string> = {
      mp4: "video/mp4",
      webm: "video/webm",
      mov: "video/quicktime",
      avi: "video/x-msvideo",
      mkv: "video/x-matroska",
      mp3: "audio/mpeg",
      wav: "audio/wav",
      aac: "audio/aac",
      ogg: "audio/ogg",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
    };
    return map[ext] ?? fallback;
  }

  formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
}

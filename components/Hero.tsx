"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

function AnimatedWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const bars = 80;
      const barW = W / bars;
      const cx = W / 2;
      const cy = H / 2;

      for (let i = 0; i < bars; i++) {
        const x = i * barW + barW / 2;
        const dist = Math.abs(x - cx) / cx;
        const wave1 = Math.sin(i * 0.3 + t) * 0.5 + 0.5;
        const wave2 = Math.sin(i * 0.15 + t * 1.3 + 1) * 0.3 + 0.3;
        const envelope = Math.pow(1 - dist, 2);
        const amp = (wave1 + wave2) * envelope * H * 0.35;

        // Gradient based on position
        const hue = 260 + i * 0.8;
        const alpha = 0.4 + envelope * 0.5;

        ctx.fillStyle = i % 2 === 0
          ? `hsla(${hue}, 80%, 65%, ${alpha})`
          : `hsla(190, 80%, 55%, ${alpha * 0.7})`;

        ctx.beginPath();
        ctx.roundRect(x - barW * 0.35, cy - amp / 2, barW * 0.7, amp, 2);
        ctx.fill();
      }

      t += 0.025;
      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "120px", opacity: 0.8 }}
    />
  );
}

const STATS = [
  { value: "16+", label: "Operations" },
  { value: "0ms", label: "Upload time" },
  { value: "100%", label: "Private" },
  { value: "∞", label: "File limit" },
];

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        overflow: "hidden",
      }}
    >
      {/* Grid background */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(124,58,237,0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124,58,237,0.07) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)",
      }} />

      {/* Orb glow */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "300px",
        background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)",
        filter: "blur(40px)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        top: "40%",
        right: "15%",
        width: "200px",
        height: "200px",
        background: "radial-gradient(ellipse, rgba(6,182,212,0.1) 0%, transparent 70%)",
        filter: "blur(40px)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative",
        maxWidth: "860px",
        width: "100%",
        textAlign: "center",
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(24px)",
        transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {/* Eyebrow */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          background: "rgba(124,58,237,0.1)",
          border: "1px solid rgba(124,58,237,0.3)",
          borderRadius: "100px",
          marginBottom: "28px",
        }}>
          <div style={{
            width: "6px",
            height: "6px",
            background: "#7C3AED",
            borderRadius: "50%",
            boxShadow: "0 0 8px rgba(124,58,237,0.8)",
            animation: "pulse 2s infinite",
          }} />
          <span style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "11px",
            color: "#8B5CF6",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            Browser-native • Zero uploads • FFmpeg powered
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: "clamp(42px, 7vw, 80px)",
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: "-2px",
          color: "#F1F5F9",
          marginBottom: "24px",
        }}>
          Transform media.
          <br />
          <span style={{
            background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 60%, #8B5CF6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Stay in control.
          </span>
        </h1>

        {/* Subheadline */}
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "clamp(16px, 2vw, 20px)",
          color: "var(--color-text-secondary)",
          lineHeight: 1.7,
          maxWidth: "580px",
          margin: "0 auto 40px",
          fontWeight: 400,
        }}>
          Cut, convert, compress, speed up, flip and transform video and audio
          directly in your browser. Your files never leave your machine.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/editor"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 28px",
              background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 600,
              fontSize: "15px",
              border: "1px solid rgba(139,92,246,0.4)",
              boxShadow: "0 0 30px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 50px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 30px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Start Editing <ArrowRight size={16} />
          </Link>
          <a
            href="#tools"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 28px",
              background: "transparent",
              color: "var(--color-text-secondary)",
              borderRadius: "10px",
              textDecoration: "none",
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 500,
              fontSize: "15px",
              border: "1px solid var(--color-border)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border-bright)";
              e.currentTarget.style.color = "#F1F5F9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            <Play size={14} /> See all tools
          </a>
        </div>

        {/* Waveform signature */}
        <div style={{
          marginTop: "64px",
          padding: "24px",
          background: "rgba(19,19,26,0.8)",
          border: "1px solid var(--color-border)",
          borderRadius: "16px",
          backdropFilter: "blur(8px)",
        }}>
          <AnimatedWaveform />
        </div>

        {/* Stats */}
        <div style={{
          marginTop: "48px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1px",
          background: "var(--color-border)",
          border: "1px solid var(--color-border)",
          borderRadius: "12px",
          overflow: "hidden",
        }}>
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              style={{
                padding: "20px",
                background: "var(--color-surface)",
                textAlign: "center",
              }}
            >
              <div style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "28px",
                fontWeight: 700,
                color: "#7C3AED",
                marginBottom: "4px",
              }}>
                {value}
              </div>
              <div style={{
                fontFamily: "DM Mono, monospace",
                fontSize: "11px",
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 480px) {
          div[style*="gridTemplateColumns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

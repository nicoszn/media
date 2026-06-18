"use client";

import { Shield, Cpu, Zap, Globe } from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    title: "100% Private",
    desc: "Your files never leave your machine. All processing happens in the browser via WebAssembly.",
    color: "#10B981",
  },
  {
    icon: Cpu,
    title: "FFmpeg-powered",
    desc: "Full FFmpeg compiled to WASM. Same codec support you'd get from a desktop app.",
    color: "#7C3AED",
  },
  {
    icon: Zap,
    title: "No install",
    desc: "Open the browser, drop a file, done. No downloads, no accounts, no paywalls.",
    color: "#F59E0B",
  },
  {
    icon: Globe,
    title: "Works offline",
    desc: "After the initial load, the entire processing engine works with no internet connection.",
    color: "#06B6D4",
  },
];

export function Features() {
  return (
    <section id="features" style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "11px",
            color: "#06B6D4",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            // why vforge
          </span>
          <h2 style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 700,
            letterSpacing: "-1px",
            color: "#F1F5F9",
            marginTop: "12px",
          }}>
            Built differently
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px",
        }}>
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                style={{
                  padding: "32px 28px",
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "16px",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${f.color}44`)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  background: `${f.color}15`,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}>
                  <Icon size={22} color={f.color} />
                </div>
                <div style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontSize: "17px",
                  fontWeight: 600,
                  color: "#F1F5F9",
                  marginBottom: "8px",
                }}>
                  {f.title}
                </div>
                <div style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
                }}>
                  {f.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;

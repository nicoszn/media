import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--color-border)",
      padding: "48px 24px",
      background: "var(--color-surface)",
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "28px",
            height: "28px",
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Zap size={14} color="#fff" fill="#fff" />
          </div>
          <span style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 700,
            fontSize: "16px",
            color: "#F1F5F9",
          }}>
            VForge
          </span>
        </div>

        <div style={{
          fontFamily: "DM Mono, monospace",
          fontSize: "12px",
          color: "var(--color-text-muted)",
        }}>
          // browser-native media tools — no servers harmed
        </div>

        <Link
          href="/editor"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            color: "#8B5CF6",
            textDecoration: "none",
          }}
        >
          Open Editor →
        </Link>
      </div>
    </footer>
  );
}

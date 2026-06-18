"use client";

import dynamic from "next/dynamic";

const EditorShell = dynamic(
  () => import("@/components/EditorShell"),
  {
    ssr: false,
    loading: () => (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg)",
        fontFamily: "DM Mono, monospace",
        color: "var(--color-text-muted)",
        fontSize: "13px",
      }}>
        Loading editor…
      </div>
    ),
  }
);

export default function EditorPage() {
  return <EditorShell />;
}

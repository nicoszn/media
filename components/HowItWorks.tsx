"use client";

import { Upload, Settings2, Download } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: Upload,
    title: "Drop your file",
    desc: "Drag and drop any video or audio file. It loads directly into the browser — nothing is sent anywhere.",
    color: "#7C3AED",
  },
  {
    n: "02",
    icon: Settings2,
    title: "Choose an operation",
    desc: "Select from 17 tools. Configure your parameters and preview settings before running.",
    color: "#06B6D4",
  },
  {
    n: "03",
    icon: Download,
    title: "Download the result",
    desc: "Processing runs on FFmpeg compiled to WebAssembly. Export and download your file instantly.",
    color: "#10B981",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{
      padding: "100px 24px",
      background: "var(--color-surface)",
      borderTop: "1px solid var(--color-border)",
      borderBottom: "1px solid var(--color-border)",
    }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "11px",
            color: "#06B6D4",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            // workflow
          </span>
          <h2 style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 700,
            letterSpacing: "-1px",
            color: "#F1F5F9",
            marginTop: "12px",
          }}>
            How it works
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "32px",
          position: "relative",
        }}>
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.n} style={{ position: "relative" }}>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div style={{
                    position: "absolute",
                    top: "32px",
                    right: "-16px",
                    width: "32px",
                    height: "1px",
                    background: `linear-gradient(90deg, ${step.color}44, transparent)`,
                    display: "none", // hide on mobile; shown via media query
                  }} className="step-connector" />
                )}

                <div style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "20px",
                }}>
                  {/* Step number + icon */}
                  <div style={{ flexShrink: 0 }}>
                    <div style={{
                      width: "56px",
                      height: "56px",
                      background: `${step.color}15`,
                      border: `1px solid ${step.color}33`,
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}>
                      <Icon size={22} color={step.color} />
                      <div style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        width: "20px",
                        height: "20px",
                        background: step.color,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "DM Mono, monospace",
                        fontSize: "9px",
                        fontWeight: 500,
                        color: "#fff",
                      }}>
                        {i + 1}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{
                      fontFamily: "Space Grotesk, sans-serif",
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#F1F5F9",
                      marginBottom: "8px",
                    }}>
                      {step.title}
                    </div>
                    <div style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.7,
                    }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

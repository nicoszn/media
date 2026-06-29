"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Zap, Menu, X } from "lucide-react";

const NAV_TOOLS = [
  { label: "Split Video", href: "/split-video" },
  { label: "Compress", href: "/compress-video" },
  { label: "Video to MP3", href: "/convert-video-to-mp3" },
  { label: "Video to GIF", href: "/video-to-gif" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route navigation
  useEffect(() => {
    if (menuOpen) setMenuOpen(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          height: "64px",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background 0.3s ease, border-color 0.3s ease",
          background: scrolled || menuOpen ? "rgba(10,10,15,0.96)" : "transparent",
          backdropFilter: scrolled || menuOpen ? "blur(16px)" : "none",
          borderBottom: scrolled || menuOpen
            ? "1px solid rgba(124,58,237,0.18)"
            : "1px solid transparent",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="VForge home"
          style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <div style={{
            width: "30px", height: "30px",
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            borderRadius: "7px",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Zap size={14} color="#fff" fill="#fff" />
          </div>
          <span style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 700,
            fontSize: "17px",
            color: "#F1F5F9",
            letterSpacing: "-0.3px",
          }}>
            VForge
          </span>
        </Link>

        {/* Desktop tool links */}
        <div
          aria-label="Tool links"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
          className="desktop-nav"
        >
          {NAV_TOOLS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                color: "var(--color-text-secondary)",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#F1F5F9";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-text-secondary)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link
            href="/editor"
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: "#fff",
              textDecoration: "none",
              padding: "8px 18px",
              background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
              borderRadius: "8px",
              border: "1px solid rgba(139,92,246,0.35)",
              boxShadow: "0 0 18px rgba(124,58,237,0.2)",
              transition: "box-shadow 0.2s, transform 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 32px rgba(124,58,237,0.45)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 18px rgba(124,58,237,0.2)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            All Tools
          </Link>

          {/* Mobile menu toggle */}
          <button
  aria-label={menuOpen ? "Close menu" : "Open menu"}
  aria-expanded={menuOpen}
  onClick={() => setMenuOpen((x) => !x)}
  className="mobile-menu-btn"
  style={{
    display: "none",            /* Overridden in your CSS media queries */
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",                 /* Adds space between the word "Menu" and the icon */
    height: "36px",             /* Keep the height consistent with your header */
    padding: "0 12px",          /* Added side padding instead of a fixed width */
    background: "transparent",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    color: "var(--color-text-secondary)",
    fontFamily: "Inter, sans-serif", /* Matches your header typography */
    fontSize: "13px",           /* Matches your header text size */
    fontWeight: 500,
    cursor: "pointer",
  }}
>
  <span>Menu</span>
  {menuOpen ? <X size={18} /> : <Menu size={18} />}
</button>

        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          role="dialog"
          aria-label="Mobile navigation"
          style={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            zIndex: 99,
            background: "rgba(10,10,15,0.98)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(124,58,237,0.18)",
            padding: "16px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
          className="mobile-menu"
        >
          {NAV_TOOLS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                color: "var(--color-text-secondary)",
                textDecoration: "none",
                padding: "12px 4px",
                borderBottom: "1px solid var(--color-border)",
                display: "block",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#F1F5F9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-text-secondary)"; }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/editor"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
              textDecoration: "none",
              padding: "12px 18px",
              background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
              borderRadius: "8px",
              textAlign: "center",
              marginTop: "12px",
              display: "hidden",
            }}
          >
            All Tools
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}

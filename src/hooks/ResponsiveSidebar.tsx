import React from "react";
import "../css/responsive-sidebar.css";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  isMobile: boolean;
  onOpen: () => void;
  onClose: () => void;
  side?: "left" | "right";
  width?: number;
  ariaLabel?: string;
}

export function ResponsiveSidebar({
  children,
  isOpen,
  isMobile,
  onOpen,
  onClose,
  side = "left",
  width = 280,
  ariaLabel = "Sidebar",
}: Props) {
  const classes = [
    "rs-sidebar",
    `rs-sidebar--${side}`,
    isMobile ? "rs-sidebar--mobile" : "",
    isOpen ? "rs-sidebar--open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {isMobile && (
        <button
          type="button"
          className="rs-toggle"
          onClick={isOpen ? onClose : onOpen}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          <i className={`bi bi-${isOpen ? "x-lg" : "list"}`} />
        </button>
      )}

      <div
        className={`rs-backdrop${isMobile && isOpen ? " rs-backdrop--visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={classes}
        style={{ width: isMobile ? `min(${width}px, 85vw)` : undefined }}
        role="complementary"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </>
  );
}

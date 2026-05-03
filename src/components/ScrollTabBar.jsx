import { useState, useRef, useEffect, useCallback } from "react";

export function ScrollTabBar({ children, style, className }) {
  const ref = useRef(null);
  const [arrows, setArrows] = useState({ left: false, right: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setArrows({
      left:  el.scrollLeft > 2,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 2,
    });
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(update);
    const el = ref.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(id);
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  return (
    <div style={{ position: "relative", ...style }} className={className}>
      {arrows.left  && <ScrollArrow dir="left"  onClick={() => ref.current?.scrollBy({ left: -160, behavior: "smooth" })} />}
      <div ref={ref} className="scroll-x" style={{ display: "flex" }}>
        {children}
      </div>
      {arrows.right && <ScrollArrow dir="right" onClick={() => ref.current?.scrollBy({ left:  160, behavior: "smooth" })} />}
    </div>
  );
}

function ScrollArrow({ dir, onClick }) {
  return (
    <button onClick={onClick} aria-label={dir === "left" ? "Scroll left" : "Scroll right"} style={{
      position: "absolute",
      [dir]: 0, top: 0, bottom: 0, zIndex: 10,
      background: dir === "left"
        ? "linear-gradient(to right, rgba(255,255,255,0.96) 55%, transparent)"
        : "linear-gradient(to left,  rgba(255,255,255,0.96) 55%, transparent)",
      border: "none", width: 40, cursor: "pointer",
      fontSize: 22, color: "#666",
      display: "flex", alignItems: "center",
      justifyContent: dir === "left" ? "flex-start" : "flex-end",
      paddingLeft:  dir === "left"  ? 6 : 0,
      paddingRight: dir === "right" ? 6 : 0,
    }}>
      {dir === "left" ? "‹" : "›"}
    </button>
  );
}

"use client";
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHover, setLinkHover] = useState(false);

  useEffect(() => {
    const addEventListeners = () => {
      document.addEventListener("mousemove", mMove);
      document.addEventListener("mousedown", mDown);
      document.addEventListener("mouseup", mUp);
    };

    const removeEventListeners = () => {
      document.removeEventListener("mousemove", mMove);
      document.removeEventListener("mousedown", mDown);
      document.removeEventListener("mouseup", mUp);
    };

    const mMove = (el: MouseEvent) => {
      setPosition({ x: el.clientX, y: el.clientY });
      const target = el.target as HTMLElement;
      // Check if hovering over clickable elements
      setLinkHover(
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") !== null || 
        target.closest("a") !== null ||
        target.classList.contains("cursor-pointer")
      );
    };

    const mDown = () => setClicked(true);
    const mUp = () => setClicked(false);

    addEventListeners();
    return () => removeEventListeners();
  }, []);

  return (
    <>
      {/* Main Crosshair */}
      <div
        className="fixed pointer-events-none z-[9999] hidden md:flex items-center justify-center mix-blend-difference"
        style={{ left: `${position.x}px`, top: `${position.y}px`, transform: "translate(-50%, -50%)" }}
      >
        <div className={`transition-all duration-150 rounded-full border border-white ${linkHover ? 'w-12 h-12 bg-white/20' : 'w-8 h-8'} ${clicked ? 'scale-75' : 'scale-100'}`} />
        <div className="absolute w-1 h-1 bg-brand-neon rounded-full" />
      </div>
      
      {/* Global CSS to Hide Default Cursor */}
      <style jsx global>{`
        @media (min-width: 768px) {
           body, a, button, input { cursor: none !important; }
        }
      `}</style>
    </>
  );
}
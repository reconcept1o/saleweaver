import React, { useState, useEffect, useRef } from "react";

function CustomCursor() {
  const orbitRef = useRef(null); // Yörünge Halkası
  const coreRef = useRef(null); // Çekirdek Nokta
  const requestRef = useRef(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const orbitPos = useRef({ x: 0, y: 0 });
  const corePos = useRef({ x: 0, y: 0 });

  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Mobil tespiti
  useEffect(() => {
    const checkForMobile = () => {
      setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
    };
    checkForMobile();
    window.addEventListener("resize", checkForMobile);
    return () => window.removeEventListener("resize", checkForMobile);
  }, []);

  // Ana animasyon ve olay dinleyicileri
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e) =>
      (mousePos.current = { x: e.clientX, y: e.clientY });

    const handleMouseOver = (e) => {
      if (e.target.closest("a, button")) setIsHovering(true);
    };
    const handleMouseOut = (e) => {
      if (e.target.closest("a, button")) setIsHovering(false);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    let animationTime = 0;
    const animate = (time) => {
      animationTime += 0.05;

      const orbitSmoothing = 0.1;
      const coreSmoothing = 0.6;

      // Çekirdek pozisyonunu yumuşakça güncelle
      corePos.current.x +=
        (mousePos.current.x - corePos.current.x) * coreSmoothing;
      corePos.current.y +=
        (mousePos.current.y - corePos.current.y) * coreSmoothing;

      // Yörünge pozisyonunu yumuşakça güncelle
      orbitPos.current.x +=
        (mousePos.current.x - orbitPos.current.x) * orbitSmoothing;
      orbitPos.current.y +=
        (mousePos.current.y - orbitPos.current.y) * orbitSmoothing;

      // Salınım (Wobble) efekti için hesaplama
      const wobbleAmount = isHovering ? 0 : 4; // Hover durumunda salınım durur
      const wobbleX = Math.cos(animationTime) * wobbleAmount;
      const wobbleY = Math.sin(animationTime) * wobbleAmount;

      if (coreRef.current) {
        coreRef.current.style.transform = `translate(${corePos.current.x}px, ${corePos.current.y}px)`;
      }
      if (orbitRef.current) {
        orbitRef.current.style.transform = `translate(${
          orbitPos.current.x + wobbleX
        }px, ${orbitPos.current.y + wobbleY}px)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(requestRef.current);
    };
  }, [isMobile]);

  if (isMobile) return null;

  // Durumlara göre class'ları birleştiriyoruz
  const orbitClasses = `cursor-orbit ${isHovering ? "hovering" : ""} ${
    isClicking ? "clicking" : ""
  }`;

  return (
    <>
      <div ref={orbitRef} className={orbitClasses}></div>
      <div ref={coreRef} className="cursor-core"></div>
    </>
  );
}

export default CustomCursor;

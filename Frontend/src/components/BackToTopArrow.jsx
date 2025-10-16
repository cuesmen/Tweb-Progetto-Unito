import { useEffect, useState, useRef } from "react";
import { TiArrowSortedUp } from "react-icons/ti";
import { animateScroll as scroll } from "react-scroll";

export default function BackToTopArrow({
  threshold = 200,     
  duration = 700,       
}) {
  const [visible, setVisible] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > threshold);
        ticking.current = false;
      });
    };

    onScroll(); 
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const handleClick = () => {
    scroll.scrollToTop({
      duration,
      smooth: "easeInOutQuad",
    });
  };

  return (
    <button
      className={`btta ${visible ? "btta--visible" : "btta--hidden"}`}
      onClick={handleClick}
      aria-label="Back to top"
      title="Back to top"
    >
      <TiArrowSortedUp className="btta__icon" />
    </button>
  );
}

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollTopBtn() {
  const [visible, setVisible] = useState(false);

  // Show only when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) setVisible(true);
      else setVisible(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll top function
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null; // disables default, hidden initially

  return (
    <button
      onClick={scrollTop}
      className="
    fixed bottom-12 right-12
    p-3
    rounded-full
    bg-black/40
    backdrop-blur-md
    border-2 border-white
    shadow-xl
    hover:bg-black/50
    z-10
    transition
  "
    >
      <ArrowUp className="w-5 h-5 text-white" />
    </button>
  );
}

import { useRef, useEffect } from "react";

interface SpotlightProps {
  targetRef: React.RefObject<HTMLElement>;
}

const Spotlight: React.FC<SpotlightProps> = ({ targetRef }) => {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSpotlightPosition = () => {
      if (spotlightRef.current && targetRef.current) {
        const targetRect = targetRef.current.getBoundingClientRect();

        spotlightRef.current.style.top = `${targetRect.top}px`;
        spotlightRef.current.style.left = `${targetRect.left}px`;
        spotlightRef.current.style.width = `${targetRect.width}px`;
        spotlightRef.current.style.height = `${targetRect.height}px`;
      }
    };

    updateSpotlightPosition();

    window.addEventListener("resize", updateSpotlightPosition);
    return () => window.removeEventListener("resize", updateSpotlightPosition);
  }, []);

  return <div className="spotlight" ref={spotlightRef}></div>;
};

export default Spotlight;

import { useEffect, useState } from "react";

export default function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener?.("change", onChange);
    // Fallback for older Safari
    if (!mq.addEventListener) mq.addListener(onChange);
    setIsMobile(mq.matches);
    return () => {
      mq.removeEventListener?.("change", onChange);
      if (!mq.removeEventListener) mq.removeListener(onChange);
    };
  }, [breakpoint]);

  return isMobile;
}

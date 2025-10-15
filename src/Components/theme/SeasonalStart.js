import React, { useEffect, useState } from "react";
import "./SeasonalStart.css";

const SeasonalStart = ({ onFinish }) => {
  const [month, setMonth] = useState("");

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    if (currentMonth === 9) setMonth("october");
    else if (currentMonth === 11) setMonth("december");
    else setMonth("default");

    
    const timer = setTimeout(() => {
      onFinish();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="seasonal-startup">
      {month === "october" && (
        <div className="skeleton-container">
          <img
            src="/animations/halloween.gif"
            alt="Skeleton Stickhandling"
            className="skeleton"
          />
                    <img
            src="/animations/HockeySkeleton.gif"
            alt="Skeleton"
            className="skeleton"
            height={100}
          />
        </div>
      )}

      {month === "december" && (
        <div className="santa-container">
          <img
            src="/animations/santa.gif"
            alt="Santa Flying"
            className="santa"
          />
        </div>
      )}
    </div>
  );
};

export default SeasonalStart;

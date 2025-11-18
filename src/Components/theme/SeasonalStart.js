import React, { useEffect, useState } from "react";
import "./SeasonalStart.css";

const SeasonalStart = ({ onFinish }) => {
  const [season, setSeason] = useState("default");

useEffect(() => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  if (currentMonth === 9) setSeason("october");
  else if (currentMonth === 10) {
    const remembranceDay = 11;
    const oneWeekAfter = remembranceDay + 3;
    if (currentDay >= remembranceDay - 10 && currentDay <= oneWeekAfter) {
      setSeason("november");
    } else {
      setSeason("default");
    }
  } else if (currentMonth === 11) {
    if (currentDay >= 18 && currentDay <= 26) {
      setSeason("christmasWeek");
    } else {
      setSeason("december");
    }
  } else {
    setSeason("default");
  }

  // ⏳ Timer logic: longer for December, shorter for others
  const timerDuration = (currentMonth === 11 ? 60000 : 10000); // 60s for December
  const timer = setTimeout(() => onFinish(), timerDuration);

  return () => clearTimeout(timer);
}, [onFinish]);


  return (
    <div className="seasonal-startup">
      {season === "october" && (
        <div className="skeleton-container">
          <img
            src="/animations/HockeySkeleton.gif"
            alt="Skeleton"
            className="skeleton"
          />
        </div>
      )}

      {season === "november" && (
        <div className="rememberance-container">
          <img
            src="/animations/rememberanceDay.gif"
            alt="Remembrance Day"
            className="RD-animation"
          />
        </div>
      )}

      {/* December — Snow all month */}
      {(season === "december" || season === "christmasWeek") && (
        <div className="snowfall-container">
          {Array.from({ length: 60 }).map((_, i) => {
            const size = Math.random() * 8 + 4;
            const left = Math.random() * 100;
            const duration = Math.random() * 5 + 5;
            const delay = Math.random() * 5;
            const opacity = Math.random() * 0.5 + 0.5;
            const drift = Math.random() * 50 - 25;
            return (
              <span
                key={i}
                className="snowflake"
                style={{
                  left: `${left}%`,
                  fontSize: `${size}px`,
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`,
                  transform: `translateX(${drift}px)`,
                  opacity,
                }}
              >
                ❄
              </span>
            );
          })}
        </div>
      )}

      {/* Santa flies during Christmas week */}
      {season === "christmasWeek" && (
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

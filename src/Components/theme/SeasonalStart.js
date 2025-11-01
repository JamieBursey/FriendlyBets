import React, { useEffect, useState } from "react";
import "./SeasonalStart.css";

const SeasonalStart = ({ onFinish }) => {
  const [month, setMonth] = useState("");

useEffect(() => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();


  if (currentMonth === 9) setMonth("october"); // October
  else if (currentMonth === 11) setMonth("december"); // December
  else if (currentMonth === 10) {
    const remembranceDay = 11; 
    const oneWeekAfter = remembranceDay + 7;

    if (currentDay >= remembranceDay - 11 && currentDay <= oneWeekAfter) {
      setMonth("november");
    } else {
      setMonth("default");
    }
  } else {
    setMonth("default");
  }

  // Automatically stop the animation after 10 seconds
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
{month === "november" && (
        <div className="rememberance-container">
          <img
            src="/animations/rememberanceDay.gif"
            alt="rememberance Day"
            className="RD-animation"
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

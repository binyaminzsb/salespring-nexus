
import React, { useState, useEffect } from "react";
import { Clock as ClockIcon } from "lucide-react";
import { format } from "date-fns";

const Clock: React.FC = () => {
  const [time, setTime] = useState<string>(getCurrentTime());

  function getCurrentTime(): string {
    return format(new Date(), "h:mm a");
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex items-center text-gray-600 space-x-1">
      <ClockIcon className="h-4 w-4" />
      <span className="text-sm font-medium">{time}</span>
    </div>
  );
};

export default Clock;

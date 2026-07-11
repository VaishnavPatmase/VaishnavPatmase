import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface ClockState {
  sydney: string;
  delhi: string;
  dubai: string;
  isSydneyActive: boolean;
  isDelhiActive: boolean;
  isDubaiActive: boolean;
}

export default function GlobalClocks() {
  const [clocks, setClocks] = useState<ClockState>({
    sydney: "",
    delhi: "",
    dubai: "",
    isSydneyActive: false,
    isDelhiActive: false,
    isDubaiActive: false,
  });

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();

      // Format options
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };

      // Get hours for office active state (Business hours: 8 AM - 6 PM local time)
      const getLocalHour = (timeZone: string) => {
        const localStr = now.toLocaleTimeString("en-US", { timeZone, hour12: false, hour: "2-digit" });
        return parseInt(localStr, 10);
      };

      const sydneyHour = getLocalHour("Australia/Sydney");
      const delhiHour = getLocalHour("Asia/Kolkata");
      const dubaiHour = getLocalHour("Asia/Dubai");

      setClocks({
        sydney: now.toLocaleTimeString("en-US", { ...options, timeZone: "Australia/Sydney" }),
        delhi: now.toLocaleTimeString("en-US", { ...options, timeZone: "Asia/Kolkata" }),
        dubai: now.toLocaleTimeString("en-US", { ...options, timeZone: "Asia/Dubai" }),
        isSydneyActive: sydneyHour >= 8 && sydneyHour < 18,
        isDelhiActive: delhiHour >= 8 && delhiHour < 18,
        isDubaiActive: dubaiHour >= 8 && dubaiHour < 18,
      });
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      {/* Sydney */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-navy-900/60 border border-slate-800/80 backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-mono">SYDNEY (HQ)</span>
          <span className="text-lg font-display font-semibold tracking-tight text-white mt-1">
            {clocks.sydney || "00:00:00 AM"}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${clocks.isSydneyActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            <span className="text-[10px] font-mono text-slate-300">
              {clocks.isSydneyActive ? "ACTIVE" : "OFF-HOURS"}
            </span>
          </span>
        </div>
      </div>

      {/* New Delhi */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-navy-900/60 border border-slate-800/80 backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-mono">NEW DELHI</span>
          <span className="text-lg font-display font-semibold tracking-tight text-white mt-1">
            {clocks.delhi || "00:00:00 AM"}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Clock className="w-4 h-4 text-purple-400" />
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${clocks.isDelhiActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            <span className="text-[10px] font-mono text-slate-300">
              {clocks.isDelhiActive ? "ACTIVE" : "OFF-HOURS"}
            </span>
          </span>
        </div>
      </div>

      {/* Dubai */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-navy-900/60 border border-slate-800/80 backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-mono">DUBAI</span>
          <span className="text-lg font-display font-semibold tracking-tight text-white mt-1">
            {clocks.dubai || "00:00:00 AM"}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Clock className="w-4 h-4 text-sky-400" />
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${clocks.isDubaiActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            <span className="text-[10px] font-mono text-slate-300">
              {clocks.isDubaiActive ? "ACTIVE" : "OFF-HOURS"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

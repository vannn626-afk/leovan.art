import { useEffect, useState } from "react";
import {
  getCurrentTrack,
  isBgmPlaying,
  nextBgmTrack,
  playBgm,
  stopBgm,
  subscribeBeat,
  subscribeBgm,
  toggleBgm,
  type BgmTrack,
} from "../lib/bgm";

export function useBgm() {
  const [playing, setPlaying] = useState(isBgmPlaying);
  const [track, setTrack] = useState<BgmTrack>(getCurrentTrack);
  const [beat, setBeat] = useState(0);
  const [energy, setEnergy] = useState(0);

  useEffect(() => {
    const unsubBgm = subscribeBgm((p, t) => {
      setPlaying(p);
      setTrack(t);
    });
    const unsubBeat = subscribeBeat((b, e) => {
      setBeat(b);
      setEnergy(e);
    });
    return () => {
      unsubBgm();
      unsubBeat();
    };
  }, []);

  return {
    playing,
    track,
    beat,
    energy,
    playBgm,
    stopBgm,
    toggleBgm,
    nextBgmTrack,
  };
}

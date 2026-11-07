import { useEffect, useState } from "react";
import { isSoundEnabled, setSoundEnabled, subscribeSound } from "../lib/sound";

export function useSound() {
  const [on, setOn] = useState(isSoundEnabled);
  useEffect(() => subscribeSound(setOn), []);
  return [on, setSoundEnabled] as const;
}

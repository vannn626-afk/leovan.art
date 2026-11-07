import { motion } from "framer-motion";
import { Disc3, Music2, Pause, Play, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useBgm } from "../hooks/useBgm";
import { useSound } from "../hooks/useSound";
import { play } from "../lib/sound";

interface AudioDeckProps {
  compact?: boolean;
  showTrackInfo?: boolean;
}

export function AudioDeck({ compact = false, showTrackInfo = true }: AudioDeckProps) {
  const { playing, track, beat, toggleBgm, nextBgmTrack } = useBgm();
  const [sfxOn, setSfxOn] = useSound();

  const handleToggleBgm = () => {
    play("slash");
    toggleBgm();
  };

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    play("card");
    nextBgmTrack();
  };

  const handleToggleSfx = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSfxOn(!sfxOn);
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* BGM Controller Button */}
      <div
        className={`clip-tag group relative flex items-center border border-white/20 bg-void/90 transition-all duration-300 ${
          playing ? "border-blood shadow-[0_0_15px_rgba(230,0,35,0.4)]" : "hover:border-paper"
        }`}
      >
        <button
          type="button"
          onClick={handleToggleBgm}
          onMouseEnter={() => play("hover")}
          aria-label={playing ? "Jeda musik latar BGM" : "Putar musik latar Persona 5 BGM"}
          className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.2em] transition-colors md:text-xs ${
            playing ? "bg-blood text-paper" : "bg-void text-ash hover:bg-paper hover:text-void"
          }`}
        >
          {playing ? (
            <Pause className="h-3.5 w-3.5 animate-pulse" aria-hidden="true" />
          ) : (
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
          )}

          {/* Equalizer animation bars */}
          <div className="flex h-3.5 items-end gap-0.5" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => {
              const heights = playing
                ? [
                    beat === 0 ? "h-3.5" : "h-2",
                    beat === 1 ? "h-3" : "h-1.5",
                    beat === 2 ? "h-3.5" : "h-2.5",
                    beat === 3 ? "h-2.5" : "h-1",
                  ]
                : ["h-1", "h-1", "h-1", "h-1"];
              return (
                <span
                  key={i}
                  className={`w-0.5 transition-all duration-150 ${heights[i]} ${
                    playing ? "bg-paper" : "bg-ash/50"
                  }`}
                />
              );
            })}
          </div>

          <span className="hidden sm:inline">
            {playing ? "BGM PLAYING" : "BGM: LO-FI JAZZ"}
          </span>
        </button>

        {/* Track switch button */}
        {showTrackInfo && (
          <button
            type="button"
            onClick={handleNextTrack}
            title={`Ganti Track (Saat ini: ${track.name})`}
            className="flex items-center border-l border-white/20 px-2 py-1.5 text-ash transition-colors hover:bg-paper hover:text-void"
            aria-label="Track berikutnya"
          >
            <SkipForward className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Track Name Ticker (shown on larger screens when playing) */}
      {playing && showTrackInfo && !compact && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden xl:flex items-center gap-2 -skew-x-12 border border-blood/60 bg-void/90 px-2.5 py-1 font-mono text-[9px] tracking-wider text-paper"
        >
          <Disc3 className="h-3 w-3 animate-spin text-blood" style={{ animationDuration: "3s" }} />
          <span className="truncate max-w-[150px]">
            {track.name}
          </span>
          <span className="bg-blood/30 px-1 text-[8px] text-paper font-bold">{track.genre}</span>
        </motion.div>
      )}

      {/* SFX Toggle */}
      <button
        type="button"
        onClick={handleToggleSfx}
        onMouseEnter={() => play("hover")}
        aria-pressed={sfxOn}
        aria-label={sfxOn ? "Matikan efek suara SFX" : "Nyalakan efek suara SFX"}
        className={`clip-tag group inline-flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.2em] transition-colors ${
          sfxOn ? "bg-crimson/90 text-paper" : "bg-white/10 text-ash hover:bg-paper hover:text-void"
        }`}
      >
        {sfxOn ? (
          <Volume2 className="h-3.5 w-3.5 transition-transform group-hover:scale-110" aria-hidden="true" />
        ) : (
          <VolumeX className="h-3.5 w-3.5 transition-transform group-hover:scale-110" aria-hidden="true" />
        )}
        <span className="hidden md:inline">SFX</span>
      </button>
    </div>
  );
}

/** Floating Persona BGM Banner / Toast for Hero or bottom corner */
export function PersonaNowPlaying() {
  const { playing, track, nextBgmTrack, toggleBgm } = useBgm();

  if (!playing) return null;

  return (
    <motion.aside
      initial={{ y: 50, opacity: 0, skewX: -12 }}
      animate={{ y: 0, opacity: 1, skewX: -8 }}
      exit={{ y: 50, opacity: 0, skewX: -12 }}
      className="fixed bottom-5 left-5 z-40 hidden md:flex items-center gap-3 border-2 border-blood bg-void/95 p-2 shadow-[8px_8px_0_#990019] backdrop-blur-md"
      aria-label="Sedang memutar musik latar"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-blood text-paper">
        <Music2 className="h-5 w-5 animate-pulse" />
      </div>
      <div className="pr-3 font-mono text-[10px]">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 px-1 py-0.2 text-[8px] font-bold text-blood tracking-widest">
            NOW PLAYING
          </span>
          <span className="text-ash tracking-wider">PERSONA BGM</span>
        </div>
        <p className="font-display text-sm tracking-wider text-paper mt-0.5">
          {track.name}
        </p>
      </div>
      <div className="flex items-center gap-1 border-l border-white/20 pl-2">
        <button
          type="button"
          onClick={() => {
            play("card");
            nextBgmTrack();
          }}
          className="p-1 text-ash hover:text-paper"
          title="Track Berikutnya"
          aria-label="Track berikutnya"
        >
          <SkipForward className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => {
            play("slash");
            toggleBgm();
          }}
          className="p-1 text-ash hover:text-blood"
          title="Pause BGM"
          aria-label="Jeda musik latar"
        >
          <Pause className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.aside>
  );
}

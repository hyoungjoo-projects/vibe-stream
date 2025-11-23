import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { usePlayer } from '@/hooks/usePlayer';

export const PlayerWidget = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    setVolume: handleVolumeChange,
    seekTo,
  } = usePlayer();

  if (!currentSong) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 shadow-2xl z-50">
      <div className="max-w-full px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Album Art and Track Info */}
          <div className="flex items-center gap-3 min-w-[240px]">
            {currentSong.image_url && (
              <div className="w-14 h-14 rounded-md overflow-hidden bg-slate-800 flex-shrink-0 shadow-lg">
                <img
                  src={currentSong.image_url}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-slate-100 truncate">
                {currentSong.title}
              </span>
              <span className="text-xs text-slate-400 truncate">
                {currentSong.artist.name}
              </span>
            </div>
          </div>

          {/* Center Controls */}
          <div className="flex-1 flex flex-col items-center gap-2 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-slate-100 hover:text-white hover:bg-slate-800 rounded-full"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current" />
                )}
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-slate-400 font-mono min-w-[40px] text-right">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={(value) => seekTo(value[0])}
                className="flex-1 cursor-pointer"
              />
              <span className="text-xs text-slate-400 font-mono min-w-[40px]">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 min-w-[140px] justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            >
              {volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={(value) => handleVolumeChange(value[0] / 100)}
              className="w-24 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
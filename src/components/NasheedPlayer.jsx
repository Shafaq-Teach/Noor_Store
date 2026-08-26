import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { 
  Music, 
  Play, 
  Pause, 
  ChevronDown, 
  ChevronUp, 
  SkipForward, 
  Volume2 
} from 'lucide-react';

export const NasheedPlayer = () => {
  const { currentTheme, themeColors, language, isDarkMode, t } = useTheme();
  const { 
    nasheedTracks, 
    currentTrack, 
    isPlayingNasheed, 
    isNasheedExpanded, 
    audioProgress, 
    playNasheed, 
    togglePlayPauseNasheed, 
    playNextTrack, 
    toggleNasheedSection 
  } = useStore();

  const getTrackTitle = (track) => {
    if (!track) return '';
    return language === 'uyghur' ? track.titleUg : language === 'arabic' ? track.titleAr : track.titleEn;
  };

  return (
    <div 
      className="my-3 rounded-3xl border shadow-md transition-all duration-300 overflow-hidden"
      style={{
        backgroundColor: themeColors.surface,
        borderColor: themeColors.border
      }}
    >
      {/* Top Banner Player Bar */}
      <div 
        onClick={toggleNasheedSection}
        className="p-3 sm:p-3.5 flex items-center justify-between gap-2 cursor-pointer select-none hover:opacity-95"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Animated Icon / Disc */}
          <div 
            className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-md transition-all ${
              isPlayingNasheed ? 'animate-pulse ring-2 ring-offset-2' : ''
            }`}
            style={{ 
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
              ringColor: currentTheme.primary
            }}
          >
            <Music className={`w-5 h-5 ${isPlayingNasheed ? 'animate-bounce' : ''}`} />
          </div>

          {/* Track Info */}
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold opacity-70 flex items-center gap-1" style={{ color: themeColors.textSecondary }}>
              <Volume2 className="w-3 h-3 text-amber-500" />
              {t('listen_nasheed')}
            </span>
            <h4 className="text-sm font-bold truncate leading-tight mt-0.5" style={{ color: themeColors.textPrimary }}>
              {getTrackTitle(currentTrack)}
            </h4>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {/* Sound Waves when playing */}
          {isPlayingNasheed && (
            <div className="hidden sm:flex items-center gap-1 h-5 px-2">
              <div className="w-1 bg-sky-500 rounded-full soundwave-bar" style={{ animationDelay: '0s' }} />
              <div className="w-1 bg-amber-500 rounded-full soundwave-bar" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 bg-emerald-500 rounded-full soundwave-bar" style={{ animationDelay: '0.4s' }} />
              <div className="w-1 bg-purple-500 rounded-full soundwave-bar" style={{ animationDelay: '0.1s' }} />
            </div>
          )}

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPauseNasheed}
            className="p-2.5 rounded-full text-white shadow-md hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: currentTheme.primary }}
          >
            {isPlayingNasheed ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          {/* Next Button */}
          <button
            onClick={playNextTrack}
            className="p-2 rounded-full hover:opacity-75 transition-opacity"
            style={{ color: themeColors.textPrimary }}
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            onClick={toggleNasheedSection}
            className="p-2 rounded-full hover:opacity-75 transition-opacity"
            style={{ color: themeColors.textPrimary }}
          >
            {isNasheedExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Track Progress Bar */}
      <div className="w-full bg-black/10 h-1 overflow-hidden">
        <div 
          className="h-full transition-all duration-300"
          style={{ 
            width: `${audioProgress}%`,
            backgroundColor: currentTheme.primary 
          }}
        />
      </div>

      {/* Expandable Playlist Drawer */}
      {isNasheedExpanded && (
        <div 
          className="p-3 border-t flex flex-col gap-1.5 transition-all animate-in slide-in-from-top-2"
          style={{ 
            backgroundColor: themeColors.surfaceVariant,
            borderColor: themeColors.border 
          }}
        >
          <span className="text-[11px] font-bold opacity-60 mb-1 px-1" style={{ color: themeColors.textSecondary }}>
            {t('nasheed_playlist')}
          </span>

          {nasheedTracks.map((track, idx) => {
            const isSelected = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => playNasheed(track)}
                className={`p-2 px-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                  isSelected ? 'shadow-sm font-bold' : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: isSelected ? themeColors.surface : 'transparent',
                  color: isSelected ? currentTheme.primary : themeColors.textPrimary,
                  border: isSelected ? `1px solid ${themeColors.border}` : 'none'
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs opacity-50">{idx + 1}.</span>
                  <span className="text-xs font-semibold">{getTrackTitle(track)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] opacity-60">{track.duration}</span>
                  {isSelected && isPlayingNasheed ? (
                    <span className="text-xs animate-spin">💿</span>
                  ) : (
                    <Play className="w-3 h-3 opacity-60" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

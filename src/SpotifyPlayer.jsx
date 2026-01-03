import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BiSkipNext, BiSkipPrevious, BiPlayCircle, BiPauseCircle } from 'react-icons/bi'
import currentsImg from './public/currents.jpg'
import eaImg from './public/ea.jpeg'
import starboyImg from './public/starboy.jpg'
import takecareImg from './public/takecare.jpg'
import lionelImg from './public/lionel.jpg'
import dominicFikeImg from './web.ae_.dominicfike.review.courtesy.jpg'
import overMyDeadBodyAudio from './public/Over My Dead Body.mp3'
import iFeelItComingAudio from './public/I Feel It Coming.mp3'
import pastLifeAudio from './public/Tame Impala - Past Life (Audio).mp3'
import p2Audio from './public/Lil Uzi Vert - P2 [Official Audio].mp3'
import theOnlyOneAudio from './public/The Only One.mp3'
import chickenTendersAudio from './public/Dominic Fike - Chicken Tenders Official Video.mp3'

const trackPool = [
  {
    title: 'Over My Dead Body',
    artist: 'Drake',
    albumArt: takecareImg,
    audioSrc: overMyDeadBodyAudio,
  },
  {
    title: 'I Feel It Coming',
    artist: 'The Weeknd',
    albumArt: starboyImg,
    audioSrc: iFeelItComingAudio,
  },
  {
    title: 'Past Life',
    artist: 'Tame Impala',
    albumArt: currentsImg,
    audioSrc: pastLifeAudio,
  },
  {
    title: 'P2',
    artist: 'Lil Uzi Vert',
    albumArt: eaImg,
    audioSrc: p2Audio,
  },
  {
    title: 'The Only One',
    artist: 'Lionel Richie',
    albumArt: lionelImg,
    audioSrc: theOnlyOneAudio,
  },
  {
    title: 'Chicken Tenders',
    artist: 'Dominic Fike',
    albumArt: dominicFikeImg,
    audioSrc: chickenTendersAudio,
  },
]

export default function SpotifyPlayer({ theme = 'light' }) {
  const [trackIndex, setTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const audioRef = useRef(null)

  const currentTrack = trackPool[trackIndex]

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Initialize audio element
  useEffect(() => {
    if (currentTrack.audioSrc) {
      const audio = new Audio(currentTrack.audioSrc)
      audioRef.current = audio

      // Update duration when audio metadata loads
      const handleLoadedMetadata = () => {
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
          setDuration(audio.duration)
        }
      }

      // Backup handler for duration
      const handleCanPlay = () => {
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
          setDuration(audio.duration)
        }
      }

      // Update progress as audio plays
      const handleTimeUpdate = () => {
        setProgress(audio.currentTime)
        // Also update duration if not set yet
        if (duration === 0 && audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
          setDuration(audio.duration)
        }
      }

      // Handle track end
      const handleEnded = () => {
        handleNext()
      }

      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('canplay', handleCanPlay)
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)

      // Force load metadata
      audio.load()

      return () => {
        audio.pause()
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('canplay', handleCanPlay)
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', handleEnded)
        audio.src = ''
      }
    }
  }, [trackIndex])

  // Play/pause audio when isPlaying changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  const handleNext = () => {
    setTrackIndex((prev) => (prev + 1) % trackPool.length)
    setProgress(0)
    // Always start playing the new track
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(true), 100)
  }

  const handlePrevious = () => {
    if (audioRef.current) {
      if (progress > 3) {
        audioRef.current.currentTime = 0
        setProgress(0)
      } else {
        setTrackIndex((prev) => (prev - 1 + trackPool.length) % trackPool.length)
        setProgress(0)
        // Always start playing the new track
        setIsPlaying(false)
        setTimeout(() => setIsPlaying(true), 100)
      }
    }
  }

  const togglePlay = () => {
    if (currentTrack.audioSrc) {
      setIsPlaying(!isPlaying)
    } else {
      // Fallback to visual-only mode if no audio
      setIsPlaying(!isPlaying)
    }
  }

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const newTime = percentage * duration
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setProgress(newTime)
    }
  }

  // Fallback timer for visual-only mode (when no audio files)
  useEffect(() => {
    let interval
    if (isPlaying && !currentTrack.audioSrc) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= duration) {
            handleNext()
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, duration, currentTrack.audioSrc])

  return (
    <>
      <style>{`
        @keyframes playing1 {
          0%, 100% { transform: scaleY(0.2); }
          45% { transform: scaleY(0.7); }
        }
        @keyframes playing2 {
          0%, 100% { transform: scaleY(0.15); }
          40% { transform: scaleY(0.55); }
        }
        @keyframes playing3 {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(0.8); }
        }
        @keyframes playing4 {
          0%, 100% { transform: scaleY(0.25); }
          35% { transform: scaleY(0.6); }
        }
        @keyframes playing5 {
          0%, 100% { transform: scaleY(0.2); }
          55% { transform: scaleY(0.65); }
        }
      `}</style>
      
      <motion.div 
        initial={{ x: 200 }}
        animate={{ x: isExpanded ? 0 : 180 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`fixed bottom-6 right-6 w-[250px] rounded-[10px] shadow-2xl cursor-pointer overflow-hidden ${
          theme === 'dark' 
            ? 'bg-[#2a2a2a] border border-gray-700/30' 
            : 'bg-white border border-gray-200/50'
        }`}
        style={{ paddingTop: '0.625rem', paddingLeft: '0.625rem', paddingRight: '0.625rem', paddingBottom: '0.625rem' }}
      >
        <motion.div
          animate={{ height: isExpanded ? 120 : 60 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative"
        >
          {/* Top section - Album art and track info */}
          <div className="relative w-full flex gap-2.5" style={{ marginTop: '0.125rem' }}>
            <div className="relative top-[5px] left-[5px] h-10 w-10 bg-[#d2d2d2] rounded-[5px] flex justify-center items-center overflow-hidden flex-shrink-0">
              <img 
                src={currentTrack.albumArt}
                alt={currentTrack.title}
                className="w-full h-full object-cover select-none"
                draggable={false}
              />
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 pt-1 min-w-0 h-10 flex flex-col justify-center"
                >
                  <div className={`text-sm font-bold leading-tight overflow-hidden ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`} style={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical',
                    fontSize: currentTrack.title.length > 25 ? '10px' : currentTrack.title.length > 20 ? '11px' : '14px'
                  }}>
                    {currentTrack.title}
                  </div>
                  <div className={`text-[10px] font-semibold truncate opacity-70 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>{currentTrack.artist}</div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Playing animation */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-end justify-center gap-[1px] w-[30px] h-5"
                  style={{ marginTop: '10px', marginLeft: '-5px' }}
                >
                  {['playing1', 'playing2', 'playing3', 'playing4', 'playing5'].map((animName, i) => (
                    <div
                      key={i}
                      className="bg-[#1db954]"
                      style={{ 
                        width: '2px',
                        height: '20px',
                        animation: isPlaying ? `${animName} ${0.6 + i * 0.1}s ease-in-out infinite` : 'none',
                        transformOrigin: 'bottom',
                        transform: 'scaleY(0.2)'
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`w-[90%] h-[6px] rounded-[3px] absolute left-[5%] bottom-[22px] cursor-pointer ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleProgressClick(e)
                }}
              >
                <div 
                  className="bg-[#1db954] h-full rounded-[3px] transition-all"
                  style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Time stamps */}
          <AnimatePresence>
            {isExpanded && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`text-[8px] absolute bottom-[11px] left-[10px] ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {formatTime(progress)}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`text-[8px] absolute bottom-[11px] right-[10px] ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {formatTime(duration)}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Controls */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={`flex absolute bottom-[32px] left-0 w-full justify-center items-center gap-1 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrevious()
                  }}
                  className="cursor-pointer transition-colors duration-100 hover:text-[#1db954]"
                >
                  <BiSkipPrevious size={24} />
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePlay()
                  }}
                  className="cursor-pointer transition-colors duration-100 hover:text-[#1db954]"
                >
                  {isPlaying ? <BiPauseCircle size={24} /> : <BiPlayCircle size={24} />}
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNext()
                  }}
                  className="cursor-pointer transition-colors duration-100 hover:text-[#1db954]"
                >
                  <BiSkipNext size={24} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  )
}

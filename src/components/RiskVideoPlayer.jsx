import { useEffect, useRef, useState } from 'react'
import VIDEO_CONFIG from '../config/videoConfig'
import './RiskVideoPlayer.css'

const RiskVideoPlayer = ({ riskLevel, autoPlay = true, aspectRatio = '16/9' }) => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoError, setVideoError] = useState(false)

  const videoConfig = riskLevel ? VIDEO_CONFIG[riskLevel] : null

  useEffect(() => {
    setVideoError(false)
  }, [riskLevel])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoConfig) return

    if (autoPlay) {
      video.play().catch(() => {})
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleError = () => setVideoError(true)
    const handleTimeUpdate = () => {
      if (video.duration && Number.isFinite(video.duration)) {
        setCurrentTime(video.currentTime)
        setProgress((video.currentTime / video.duration) * 100)
      }
    }
    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('error', handleError)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('error', handleError)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [riskLevel, videoConfig, autoPlay])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    if (videoRef.current && duration) {
      videoRef.current.currentTime = percent * duration
    }
  }

  const handleProgressInput = (e) => {
    const percent = Number(e.target.value) / 100
    if (videoRef.current && duration) {
      videoRef.current.currentTime = percent * duration
      setProgress(percent * 100)
      setCurrentTime(percent * duration)
    }
  }

  const getRiskColor = (level) => {
    const colors = {
      LOW: '#10b981',
      LOW_MODERATE: '#22c55e',
      MODERATE: '#f59e0b',
      MODERATE_HIGH: '#f97316',
      HIGH: '#f43f5e',
    }
    return colors[level] || '#6b7280'
  }

  const formatTime = (seconds) => {
    if (seconds == null || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!videoConfig) {
    return <div className="risk-video-player risk-video-player--error">Invalid risk level</div>
  }

  // Check if URL is a Google Drive or YouTube URL
  const isGoogleDrive = videoConfig.url.includes('drive.google.com')
  const isYouTube = videoConfig.url.includes('youtube.com') || videoConfig.url.includes('youtu.be')

  const iframeRef = useRef(null)

  // For YouTube URLs, ensure autoplay parameter is present
  const getYouTubeUrl = (url) => {
    if (!url.includes('?')) {
      return url + '?autoplay=1&mute=1'
    }
    if (!url.includes('autoplay=')) {
      return url + '&autoplay=1&mute=1'
    }
    return url
  }

  const finalUrl = isYouTube ? getYouTubeUrl(videoConfig.url) : videoConfig.url

  return (
    <div
      className={`risk-video-player ${aspectRatio === '16/9' ? 'risk-video-player--16-9' : ''}`}
      style={{ '--risk-color': getRiskColor(riskLevel) }}
    >
      <div className="risk-video-player__container">
        {(isGoogleDrive || isYouTube) ? (
          <>
            <iframe
              ref={iframeRef}
              src={finalUrl}
              className="risk-video-player__video risk-video-player__iframe"
              allow="autoplay"
              allowFullScreen
              onError={() => setVideoError(true)}
              title={videoConfig.title}
              frameBorder="0"
            />
          </>
        ) : (
          <>
            <video
              ref={videoRef}
              src={videoConfig.url}
              className="risk-video-player__video"
              controlsList="nodownload"
              playsInline
              muted={false}
              onError={() => setVideoError(true)}
              autoPlay
            />
            {!videoError && (
              <button
                type="button"
                className="risk-video-player__play-btn"
                onClick={handlePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
              {isPlaying ? (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
              </button>
            )}
          </>
        )}
        {videoError && !isGoogleDrive && !isYouTube && (
          <div className="risk-video-player__error-msg">
            <p>Video not available.</p>
            <p className="risk-video-player__error-hint">Add <code>{videoConfig.url.replace(/^\//, '')}</code> to show the video.</p>
          </div>
        )}
      </div>

      <div className="risk-video-player__info">
        <h3 className="risk-video-player__title">{videoConfig.title}</h3>
        {!(isGoogleDrive || isYouTube) && (
          <>
            <div
              className="risk-video-player__progress-wrap"
              onClick={handleProgressClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleProgressClick(e)
                }
              }}
              role="slider"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              tabIndex={0}
            >
              <div
                className="risk-video-player__progress-bar"
                style={{ width: `${progress}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                className="risk-video-player__progress-input"
                onChange={handleProgressInput}
                aria-label="Video progress"
              />
            </div>
            <div className="risk-video-player__time">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default RiskVideoPlayer

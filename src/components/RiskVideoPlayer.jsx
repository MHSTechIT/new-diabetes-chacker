import { useEffect, useRef, useState } from 'react'
import VIDEO_CONFIG from '../config/videoConfig'
import './RiskVideoPlayer.css'

function loadYTScript() {
  if (window.YT && window.YT.Player) return Promise.resolve()
  return new Promise((resolve) => {
    if (document.getElementById('yt-iframe-api')) {
      const prev = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => { prev?.(); resolve() }
      return
    }
    window.onYouTubeIframeAPIReady = resolve
    const tag = document.createElement('script')
    tag.id = 'yt-iframe-api'
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  })
}

function extractVideoId(url) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/embed\/)([^?&]+)/)
  return m ? m[1] : null
}

const RISK_COLORS = {
  LOW: '#10b981',
  LOW_MODERATE: '#22c55e',
  MODERATE: '#f59e0b',
  MODERATE_HIGH: '#f97316',
  HIGH: '#f43f5e',
}

export default function RiskVideoPlayer({ riskLevel, aspectRatio = '16/9' }) {
  const ytDivRef = useRef(null)
  const playerRef = useRef(null)
  const hideTimerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showBtn, setShowBtn] = useState(false)

  const videoConfig = riskLevel ? VIDEO_CONFIG[riskLevel] : null
  const riskColor = RISK_COLORS[riskLevel] || '#6b7280'

  useEffect(() => {
    if (!videoConfig || !ytDivRef.current) return
    const videoId = extractVideoId(videoConfig.url)
    if (!videoId) return
    let cancelled = false

    loadYTScript().then(() => {
      if (cancelled || !ytDivRef.current) return
      if (playerRef.current) { playerRef.current.destroy(); playerRef.current = null }

      playerRef.current = new window.YT.Player(ytDivRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          showinfo: 0,
          rel: 0,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady(e) {
            if (!cancelled) {
              e.target.playVideo()
              e.target.unMute()
              e.target.setVolume(100)
              setIsPlaying(true)
            }
          },
          onStateChange(e) {
            if (cancelled) return
            setIsPlaying(e.data === window.YT.PlayerState.PLAYING)
          },
        },
      })
    })

    return () => {
      cancelled = true
      clearTimeout(hideTimerRef.current)
      if (playerRef.current) { playerRef.current.destroy(); playerRef.current = null }
      setIsPlaying(false)
      setShowBtn(false)
    }
  }, [riskLevel]) // eslint-disable-line react-hooks/exhaustive-deps

  const showThenHide = () => {
    clearTimeout(hideTimerRef.current)
    setShowBtn(true)
    hideTimerRef.current = setTimeout(() => setShowBtn(false), 2000)
  }

  const handleToggle = () => {
    if (!playerRef.current) return
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
    showThenHide()
  }

  const handleOverlayMove = () => {
    showThenHide()
  }

  const handleOverlayLeave = () => {
    clearTimeout(hideTimerRef.current)
    setShowBtn(false)
  }

  if (!videoConfig) return null

  return (
    <div
      className={`rvp ${aspectRatio === '16/9' ? 'rvp--16-9' : ''}`}
      style={{ '--rc': riskColor }}
    >
      <div className="rvp__stage">
        {/* YouTube mounts here — oversized to clip any residual UI bars */}
        <div ref={ytDivRef} className="rvp__yt" />

        {/* Full overlay: captures clicks, prevents YouTube UI interaction */}
        <div
          className="rvp__overlay"
          onClick={handleToggle}
          onMouseMove={handleOverlayMove}
          onMouseLeave={handleOverlayLeave}
          onTouchStart={handleOverlayMove}
          onTouchEnd={handleOverlayLeave}
          role="button"
          tabIndex={0}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle() }
          }}
        >
          <div className={`rvp__btn ${showBtn ? 'rvp__btn--visible' : ''}`}>
            {isPlaying ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <rect x="5" y="4" width="4" height="16" rx="1.5" />
                <rect x="15" y="4" width="4" height="16" rx="1.5" />
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      <h3 className="rvp__title">{videoConfig.title}</h3>
    </div>
  )
}

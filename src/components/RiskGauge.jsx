import { useState, useEffect, useRef, useCallback } from 'react'
import './RiskGauge.css'

const SEG_COLORS = [
  '#1a8c1a', '#1ea01e', '#22b422',
  '#cc6e0a', '#d4780e', '#e08418',
  '#e88c1e', '#f09628', '#f0a030',
  '#cc1010', '#dd1414', '#bb0c0c',
]

const RISK_LEVELS = [
  { key: 'LOW',           label: 'LOW',             color: '#10b981', glow: '#10b981', desc: 'All clear — no threats detected',        targetSegs: 2,  stepMs: 320 },
  { key: 'LOW_MODERATE',  label: 'LOW – MODERATE',  color: '#84cc16', glow: '#a3e635', desc: 'Minor anomalies — monitor closely',      targetSegs: 4,  stepMs: 200 },
  { key: 'MODERATE',      label: 'MODERATE',        color: '#f59e0b', glow: '#fbbf24', desc: 'Elevated activity — attention required', targetSegs: 6,  stepMs: 160 },
  { key: 'MODERATE_HIGH', label: 'MODERATE – HIGH', color: '#f97316', glow: '#fb923c', desc: 'High tension — prepare to respond',      targetSegs: 9,  stepMs: 130 },
  { key: 'HIGH',          label: 'HIGH',            color: '#f43f5e', glow: '#fb7185', desc: 'CRITICAL — immediate action required',   targetSegs: 12, stepMs: 100 },
]

const TOTAL    = 12
const GAP_DEG  = 2.8
const SEG_SPAN = (180 - GAP_DEG * (TOTAL - 1)) / TOTAL

function polarXY(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) }
}

function makeSegPath(cx, cy, outerR, innerR, a1, a2) {
  const o1 = polarXY(cx, cy, outerR, a1)
  const o2 = polarXY(cx, cy, outerR, a2)
  const i1 = polarXY(cx, cy, innerR, a1)
  const i2 = polarXY(cx, cy, innerR, a2)
  const large = (a1 - a2) > 180 ? 1 : 0
  return [
    `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 ${large} 0 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
    `L ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 ${large} 1 ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
    'Z',
  ].join(' ')
}

function GaugeSVG({ activeSegs }) {
  const cx = 250, cy = 242
  const OUTER = 212, INNER = 136
  const needleRot = -180 + (activeSegs / TOTAL) * 180

  return (
    <svg viewBox="0 0 500 260" className="risk-gauge__svg">
      <defs>
        <filter id="sg" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="ng" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {Array.from({ length: TOTAL }).map((_, i) => {
        const a1 = 180 - i * (SEG_SPAN + GAP_DEG)
        const a2 = a1 - SEG_SPAN
        const active = i < activeSegs
        return (
          <path
            key={i}
            d={makeSegPath(cx, cy, OUTER, INNER, a1, a2)}
            fill={active ? SEG_COLORS[i] : '#141414'}
            stroke="#000000"
            strokeWidth="2.2"
            filter={active ? 'url(#sg)' : undefined}
            style={{
              transition: `fill 0.16s ease ${i * 0.022}s`,
              opacity: active ? 1 : 0.17,
            }}
          />
        )
      })}

      <g
        filter="url(#ng)"
        style={{
          transform: `rotate(${needleRot}deg)`,
          transformOrigin: `${cx}px ${cy}px`,
          transition: 'transform 0.7s cubic-bezier(0.34,1.25,0.64,1)',
        }}
      >
        <polygon
          points={`${cx},${cy - 5} ${cx + 185},${cy - 1.8} ${cx + 185},${cy + 1.8} ${cx},${cy + 5}`}
          fill="white"
          opacity="0.93"
        />
        <polygon
          points={`${cx + 183},${cy - 1.5} ${cx + 198},${cy} ${cx + 183},${cy + 1.5}`}
          fill="white"
        />
      </g>

      <circle cx={cx} cy={cy} r={18} fill="white" />
      <circle cx={cx} cy={cy} r={14} fill="#000000" />
      <circle cx={cx} cy={cy} r={6}  fill="#000000" stroke="#2a2a2a" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={3.5} fill="#111111" />
    </svg>
  )
}

/**
 * RiskGauge – animated semicircle gauge for the result page.
 * @param {string}   riskLevel       - one of LOW | LOW_MODERATE | MODERATE | MODERATE_HIGH | HIGH
 * @param {boolean}  animate         - whether to play the needle sweep on mount (default true)
 * @param {number}   introDurationMs - total time for needle to reach target (default 5000)
 * @param {function} onAnimationDone - called when the sweep finishes
 * @param {boolean}  compact         - smaller layout for inline usage
 */
export default function RiskGauge({ riskLevel, animate = true, introDurationMs = 5000, onAnimationDone, compact = false }) {
  const levelIndex = RISK_LEVELS.findIndex((l) => l.key === riskLevel)
  const targetLevel = levelIndex >= 0 ? RISK_LEVELS[levelIndex] : RISK_LEVELS[0]
  const targetSegs = targetLevel.targetSegs

  const [activeSegs, setActiveSegs] = useState(animate ? 0 : targetSegs)
  const [currentLevelIndex, setCurrentLevelIndex] = useState(animate ? -1 : levelIndex)
  const segsRef = useRef(animate ? 0 : targetSegs)
  const animRef = useRef(null)
  const onDoneRef = useRef(onAnimationDone)
  onDoneRef.current = onAnimationDone

  const clearAll = useCallback(() => {
    clearInterval(animRef.current)
  }, [])

  useEffect(() => {
    if (!animate || targetSegs <= 0) return
    const stepMs = Math.max(80, Math.floor(introDurationMs / targetSegs))
    let stepCount = 0
    animRef.current = setInterval(() => {
      stepCount++
      const next = Math.min(stepCount, targetSegs)
      segsRef.current = next
      setActiveSegs(next)
      const levelIdx = RISK_LEVELS.reduce((best, l, i) => (l.targetSegs <= next ? i : best), 0)
      setCurrentLevelIndex(levelIdx)
      if (next >= targetSegs) {
        clearInterval(animRef.current)
        onDoneRef.current?.()
      }
    }, stepMs)
    return () => clearAll()
  }, [animate, targetSegs, introDurationMs, clearAll])

  useEffect(() => {
    if (animate) return
    segsRef.current = targetLevel.targetSegs
    setActiveSegs(targetLevel.targetSegs)
    setCurrentLevelIndex(levelIndex)
  }, [riskLevel, animate, targetLevel.targetSegs, levelIndex])

  useEffect(() => () => clearAll(), [clearAll])

  const cur = currentLevelIndex >= 0 ? RISK_LEVELS[currentLevelIndex] : null

  return (
    <div className={`risk-gauge ${compact ? 'risk-gauge--compact' : ''}`}>
      <div className="risk-gauge__dial">
        <GaugeSVG activeSegs={activeSegs} />
      </div>

      <div className="risk-gauge__label-area">
        {cur ? (
          <>
            <div className="risk-gauge__level-label" style={{ color: cur.color, textShadow: `0 0 30px ${cur.glow}cc, 0 0 70px ${cur.glow}33` }}>
              {cur.label}
            </div>
            <div className="risk-gauge__desc">{cur.desc}</div>
          </>
        ) : (
          <div className="risk-gauge__standby">— STANDBY —</div>
        )}
      </div>
    </div>
  )
}

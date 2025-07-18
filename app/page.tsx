"use client"

import React, { useState, useEffect } from "react"
import { Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function LifeWeeks() {
  const [birthDate, setBirthDate] = useState("1991-03-18")
  const [currentWeekNumber, setCurrentWeekNumber] = useState(0)
  const [weeksLived, setWeeksLived] = useState(0)
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null)

  const TOTAL_WEEKS = 5200 // 100 years × 52 weeks (includes bonus decades)
  const WEEKS_PER_YEAR = 52

  // Calculate weeks lived and current week
  useEffect(() => {
    const birth = new Date(birthDate)
    const now = new Date()
    const diffTime = now.getTime() - birth.getTime()
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))

    setWeeksLived(Math.max(0, diffWeeks))
    setCurrentWeekNumber(diffWeeks + 1)
  }, [birthDate])

  // Get date range for a specific week
  const getWeekDateRange = (weekNumber: number) => {
    const birth = new Date(birthDate)
    const weekStart = new Date(birth.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000)
    const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)

    return {
      start: weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      end: weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      startFull: weekStart.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      endFull: weekEnd.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }
  }

  // Get square color and styling
  const getSquareStyles = (weekNumber: number) => {
    const isCurrent = weekNumber === currentWeekNumber
    const isLived = weekNumber <= weeksLived
    const isHovered = hoveredWeek === weekNumber

    const baseClasses =
      "week-square relative transition-all duration-200 ease-out border border-gray-600/50"
    let bgColor = ""
    let transform = ""
    let shadow = ""

    if (isCurrent) {
      bgColor = "bg-red-500 ring-2 ring-red-400" // Red for urgency - this week is burning
      shadow = "shadow-2xl shadow-red-500/70"
      transform = "scale-150" // Current week urgency
    } else if (isLived) {
      bgColor = "bg-gray-500" // Consumed time
    } else {
      bgColor = "bg-gray-700" // Remaining time - not guaranteed
    }

    if (isHovered && !isCurrent) {
      transform = "scale-105"
      shadow = "shadow-md"
    }

    return {
      className: `${baseClasses} ${bgColor} ${shadow}`,
      style: {
        transform,
        borderRadius: isCurrent ? "12px" : "6px", // Even larger border radius
        aspectRatio: "1",
        minWidth: isCurrent ? "120px" : "60px", // Much bigger: current 120px, regular 60px
        minHeight: isCurrent ? "120px" : "60px",
        width: isCurrent ? "120px" : "60px", // Fixed size for consistency
        height: isCurrent ? "120px" : "60px",
        zIndex: isCurrent ? 50 : isHovered ? 10 : 1, // Much higher z-index for current week
      },
    }
  }

  // Get age from week number
  const getAgeFromWeek = (weekNumber: number) => {
    return Math.floor((weekNumber - 1) / WEEKS_PER_YEAR)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-2">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Life in Weeks</h1>
            <p className="text-xl text-gray-300">
              Week <span className="font-bold text-white">{Math.max(1, currentWeekNumber)}</span> of{" "}
              {TOTAL_WEEKS.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">
              {weeksLived.toLocaleString()} used • {(TOTAL_WEEKS - weeksLived).toLocaleString()} left • {Math.floor((TOTAL_WEEKS - weeksLived) / 52)} years
            </p>
            <p className="text-sm text-gray-400">Age: {getAgeFromWeek(currentWeekNumber)} • Progress: {((weeksLived / TOTAL_WEEKS) * 100).toFixed(1)}%</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-36 bg-gray-800 border-gray-700 text-white" />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-sm border border-gray-600"></div>
            <span>Used ({weeksLived.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-sm shadow-sm shadow-red-500/30"></div>
            <span>NOW</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-700 rounded-sm border border-gray-600"></div>
            <span>Remaining ({(TOTAL_WEEKS - weeksLived).toLocaleString()})</span>
          </div>
        </div>

        {/* Reality Check */}
        <div className="text-center mb-4">
          <p className="text-xs text-red-400 font-mono">
            This week ends in {7 - new Date().getDay()} days. What are you building?
          </p>
        </div>

        {/* Rational Metrics */}
        <div className="text-center mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-800 rounded px-3 py-2">
              <div className="text-gray-400 text-xs">Weeks Left</div>
              <div className="text-white font-bold">{(TOTAL_WEEKS - weeksLived).toLocaleString()}</div>
            </div>
            <div className="bg-gray-800 rounded px-3 py-2">
              <div className="text-gray-400 text-xs">% Complete</div>
              <div className="text-white font-bold">{((weeksLived / TOTAL_WEEKS) * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-gray-800 rounded px-3 py-2">
              <div className="text-gray-400 text-xs">Years Left</div>
              <div className="text-white font-bold">{Math.floor((TOTAL_WEEKS - weeksLived) / 52)}</div>
            </div>
            <div className="bg-gray-800 rounded px-3 py-2">
              <div className="text-gray-400 text-xs">Expected End</div>
              <div className="text-white font-bold">{new Date(new Date(birthDate).getTime() + (TOTAL_WEEKS * 7 * 24 * 60 * 60 * 1000)).getFullYear()}</div>
            </div>
          </div>
        </div>

        {/* Life Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-3">
            <div className="space-y-2">
              {/* Render each decade separately */}
              {Array.from({ length: 10 }, (_, decadeIndex) => {
                const startAge = decadeIndex * 10
                const endAge = Math.min(startAge + 9, startAge === 90 ? 99 : startAge + 9)
                
                // Determine if this is a bonus decade
                const isBonusDecade = startAge >= 80
                
                return (
                  <div key={`decade-${decadeIndex}`} className={`decade-block ${isBonusDecade ? 'bonus-decade' : ''}`}>
                    {/* Decade header */}
                    <div className="flex items-center mb-2">
                      <div className="w-16 text-sm font-medium text-gray-300 text-right pr-3">
                        {startAge}-{endAge}
                        {isBonusDecade && <span className="text-xs text-amber-400 block">BONUS</span>}
                      </div>
                      <div className="text-xs text-gray-500">
                        {isBonusDecade 
                          ? `Bonus years ${startAge} to ${endAge} - Grace and wisdom` 
                          : `Ages ${startAge} to ${endAge}`
                        }
                      </div>
                    </div>
                    
                    {/* Decade grid - 10 years × 52 weeks */}
                    <div className="ml-16">
                      <div
                        className={`grid ${isBonusDecade ? 'bonus-grid' : ''}`}
                        style={{
                          gridTemplateColumns: "repeat(52, 1fr)",
                          gap: "3px", // Reduced gap for tighter layout
                          padding: "2px",
                          opacity: isBonusDecade ? 0.7 : 1,
                          background: isBonusDecade ? 'linear-gradient(45deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.2) 100%)' : 'transparent'
                        }}
                      >
                        {Array.from({ length: 10 }, (_, yearInDecade) => {
                          const yearIndex = startAge + yearInDecade
                          if (yearIndex >= 100) return null
                          
                          return Array.from({ length: 52 }, (_, weekIndex) => {
                            const weekNumber = yearIndex * 52 + weekIndex + 1
                            if (weekNumber > TOTAL_WEEKS) return null

                            const age = getAgeFromWeek(weekNumber)
                            const weekInYear = weekIndex + 1
                            const dateRange = getWeekDateRange(weekNumber)
                            const styles = getSquareStyles(weekNumber)

                            return (
                              <div
                                key={weekNumber}
                                className={styles.className}
                                title={`Week ${weekNumber} (Age ${age}, Week ${weekInYear})\n${dateRange.startFull} - ${dateRange.endFull}${isBonusDecade ? '\n🎁 BONUS DECADE - A gift of time' : ''}`}
                              />
                            )
                          })
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Month markers */}
            <div className="ml-16 mt-3">
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "repeat(52, 1fr)",
                  gap: "3px", // Match the reduced gap
                  padding: "2px",
                }}
              >
                {Array.from({ length: 52 }, (_, weekIndex) => (
                  <div key={weekIndex} className="text-center" style={{ minWidth: "60px" }}>
                    {[0, 4, 8, 13, 17, 21, 26, 30, 34, 39, 43, 47].includes(weekIndex) ? (
                      <span className="text-sm text-gray-500 font-medium">
                        {
                          ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][
                            [0, 4, 8, 13, 17, 21, 26, 30, 34, 39, 43, 47].indexOf(weekIndex)
                          ]
                        }
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

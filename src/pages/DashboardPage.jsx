import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import canvasData from '../data/canvas-snapshot.json'
import { initGoogleAuth, connectGoogleCalendar, isGoogleConnected, fetchCalendarEvents } from '../services/googleCalendar'
import { auth } from '../firebase'

function getMonday(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
  return d
}

function buildWeek(weekOffset) {
  const monday = getMonday(new Date())
  monday.setDate(monday.getDate() + weekOffset * 7)
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return { date: d.getDate(), day: ['MON', 'TUE', 'WED', 'THU', 'FRI'][i], fullDate: d }
  })
}

function getTasksForWeek(tasks, weekOffset) {
  const monday = getMonday(new Date())
  monday.setDate(monday.getDate() + weekOffset * 7)
  const weekStart = new Date(monday); weekStart.setDate(monday.getDate() - 1)
  const weekEnd = new Date(monday); weekEnd.setDate(monday.getDate() + 7)
  return tasks
    .filter(t => {
      if (!t.dueDateISO) return false
      const due = new Date(t.dueDateISO)
      return due >= weekStart && due < weekEnd
    })
    .map(t => ({
      ...t,
      dayIndex: Math.floor((new Date(t.dueDateISO) - monday) / 86400000),
    }))
}
import TaskModal from '../components/TaskModal'
import CalendarView from '../components/CalendarView'

const NAVY = '#1e3a6e'
const SUGGESTIONS = [
  'Create study times for this week.',
  'What do I need to work on this week?',
  'Can schedule a team meeting on Monday for INFO 490?',
]

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({ task, courses, onClick }) {
  const course = courses[task.course]
  return (
    <div
      onClick={() => onClick(task)}
      style={{
        backgroundColor: course?.bg ?? '#f3f4f6',
        borderRadius: '10px',
        padding: '0.625rem 0.75rem',
        marginBottom: '0.5rem',
        cursor: 'pointer',
      }}
    >
      <p
        style={{
          fontSize: '0.82rem',
          fontWeight: 700,
          color: '#111827',
          margin: '0 0 0.25rem',
          lineHeight: 1.3,
        }}
      >
        {task.title}
      </p>
      {task.summary ? (
        <p
          style={{
            fontSize: '0.78rem',
            color: '#374151',
            margin: 0,
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {task.summary}
        </p>
      ) : (
        <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: 0, fontStyle: 'italic' }}>
          No summary.
        </p>
      )}
    </div>
  )
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: '38px',
        height: '21px',
        backgroundColor: NAVY,
        borderRadius: '11px',
        cursor: 'pointer',
        position: 'relative',
        flexShrink: 0,
        transition: 'background-color 0.2s',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '2px',
          left: checked ? '19px' : '2px',
          width: '17px',
          height: '17px',
          backgroundColor: 'white',
          borderRadius: '50%',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  )
}

// ─── Left Panel ───────────────────────────────────────────────────────────────

function getInitialWeekOffset(tasks) {
  const today = new Date()
  for (let offset = 0; offset <= 8; offset++) {
    const week = buildWeek(offset)
    const weekStart = new Date(week[0].fullDate); weekStart.setDate(weekStart.getDate() - 1)
    const weekEnd = new Date(week[4].fullDate); weekEnd.setDate(weekEnd.getDate() + 1)
    const hasTask = tasks.some(t => {
      if (!t.dueDateISO) return false
      const due = new Date(t.dueDateISO)
      return due >= today && due >= weekStart && due < weekEnd
    })
    if (hasTask) return offset
  }
  return 0
}

function WeeklyPanel({ courses, allTasks, onTaskClick, gcConnected, onConnectGC }) {
  const [weekOffset, setWeekOffset] = useState(() => getInitialWeekOffset(allTasks))
  const [startDay, setStartDay] = useState(0)
  const [gcView, setGcView] = useState(false)
  const [gcEvents, setGcEvents] = useState([])

  const week = useMemo(() => buildWeek(weekOffset), [weekOffset])
  const tasks = useMemo(() => getTasksForWeek(allTasks, weekOffset), [allTasks, weekOffset])

  const loadGcEvents = useCallback(async (offset) => {
    console.log('[GC] loadGcEvents called, gcConnected=', gcConnected)
    if (!gcConnected) return
    const w = buildWeek(offset)
    const timeMin = new Date(w[0].fullDate); timeMin.setDate(timeMin.getDate() - 1)
    const timeMax = new Date(w[4].fullDate); timeMax.setDate(timeMax.getDate() + 1)
    console.log('[GC] fetching events', timeMin.toISOString(), '→', timeMax.toISOString())
    try {
      const events = await fetchCalendarEvents(timeMin, timeMax)
      console.log('[GC] got events:', events.length, events.map(e => e.summary))
      setGcEvents(events)
    } catch (err) {
      console.error('[GC] fetch error:', err)
      setGcEvents([])
    }
  }, [gcConnected])

  useEffect(() => {
    console.log('[GC] effect fired, gcView=', gcView, 'gcConnected=', gcConnected)
    if (gcView) loadGcEvents(weekOffset)
  }, [gcView, weekOffset, gcConnected, loadGcEvents])

  const visibleDays = week.slice(startDay, startDay + 3)
  const canGoBack = startDay > 0 || weekOffset > 0
  const canGoForward = startDay + 3 < week.length || true

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '1.5rem 1.5rem 1rem',
        overflow: 'hidden',
      }}
    >
      {/* ── Header: title + toggle (always visible) ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: gcView ? '0.875rem' : '0.375rem',
          flexShrink: 0,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#111827',
              margin: 0,
            }}
          >
            Weekly To-Do(s)
          </h2>
          {/* Course legend — canvas view only */}
          {!gcView && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {Object.entries(courses).map(([name, { color }]) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      backgroundColor: color,
                      borderRadius: '2px',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#374151' }}>{name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View toggle + GC connect */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
          <button
            onClick={gcConnected ? undefined : onConnectGC}
            style={{
              backgroundColor: gcConnected ? '#16a34a' : NAVY,
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.3rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: gcConnected ? 'default' : 'pointer',
            }}
          >
            {gcConnected ? '✓ Google Calendar Connected' : 'Connect Google Calendar'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.78rem',
                color: gcView ? '#9ca3af' : '#111827',
                fontWeight: gcView ? 400 : 500,
              }}
            >
              Canvas Workload View
            </span>
            <Toggle checked={gcView} onChange={setGcView} />
            <span
              style={{
                fontSize: '0.78rem',
                color: gcView ? '#111827' : '#9ca3af',
                fontWeight: gcView ? 500 : 400,
              }}
            >
              Google Calendar View
            </span>
          </div>
        </div>
      </div>

      {/* ── Google Calendar View ── */}
      {gcView && <CalendarView events={gcEvents} weekOffset={weekOffset} onWeekChange={(o) => { setWeekOffset(o); setStartDay(0) }} />}

      {/* ── Canvas Workload View ── */}
      {!gcView && (
        <>
          {/* Month label */}
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', letterSpacing: '0.04em', flexShrink: 0 }}>
            {visibleDays[1]?.fullDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>

          {/* Week navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.75rem',
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => {
                if (startDay > 0) setStartDay(d => d - 1)
                else { setWeekOffset(w => w - 1); setStartDay(2) }
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#374151',
                fontSize: '1rem',
                padding: '0 0.5rem 0 0',
                lineHeight: 1,
              }}
            >
              ‹
            </button>
            <div style={{ display: 'flex', flex: 1, gap: '0.5rem' }}>
              {visibleDays.map((d) => (
                <div key={d.day} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 400, color: '#9ca3af', lineHeight: 1.1 }}>
                    {d.date}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', letterSpacing: '0.05em' }}>
                    {d.day}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                if (startDay + 3 < week.length) setStartDay(d => d + 1)
                else { setWeekOffset(w => w + 1); setStartDay(0) }
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#374151',
                fontSize: '1rem',
                padding: '0 0 0 0.5rem',
                lineHeight: 1,
              }}
            >
              ›
            </button>
          </div>

          {/* Task columns */}
          <div style={{ display: 'flex', gap: '0.5rem', flex: 1, overflow: 'hidden' }}>
            <div style={{ width: '20px', flexShrink: 0 }} />
            {visibleDays.map((d, colIdx) => {
              const dayTasks = tasks.filter((t) => t.dayIndex === startDay + colIdx)
              return (
                <div
                  key={d.day}
                  style={{ flex: 1, overflowY: 'auto', paddingBottom: '0.5rem' }}
                >
                  {dayTasks.length === 0 ? (
                    <div
                      style={{
                        height: '100%',
                        minHeight: '80px',
                        backgroundColor: 'rgba(156, 163, 175, 0.12)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem 0.5rem',
                      }}
                    >
                      <span style={{ fontSize: '0.72rem', color: '#9ca3af', textAlign: 'center', lineHeight: 1.4 }}>
                        No assignments today!
                      </span>
                    </div>
                  ) : dayTasks.map((task) => (
                    <TaskCard key={task.id} task={task} courses={courses} onClick={onTaskClick} />
                  ))}
                </div>
              )
            })}
            <div style={{ width: '20px', flexShrink: 0 }} />
          </div>
        </>
      )}
    </div>
  )
}

// ─── Right Panel (AI Chat) ────────────────────────────────────────────────────


function ChatPanel({ firstName, allTasks }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const buildContext = () => {
    const sorted = [...allTasks]
      .filter(t => t.dueDateISO)
      .sort((a, b) => new Date(a.dueDateISO) - new Date(b.dueDateISO))

    if (!sorted.length) return 'No assignments found.'

    return sorted.map(t => {
      const lines = [`[${t.course}] ${t.title}`, `Due: ${t.dueDate}`]
      if (t.submissionType && t.submissionType !== 'none') lines.push(`Submission: ${t.submissionType.replace(/_/g, ' ')}`)
      if (t.summary) lines.push(`Description: ${t.summary}`)
      if (t.boldNote) lines.push(`Note: ${t.boldNote}`)
      if (t.note) lines.push(`Note: ${t.note}`)
      if (t.readings?.length) lines.push(`Readings: ${t.readings.join(', ')}`)
      return lines.join('\n')
    }).join('\n\n')
  }

  const sendMessage = async (text) => {
    const userMsg = text.trim()
    if (!userMsg || loading) return
    setInput('')
    const newMessages = [...messages, { role: 'user', text: userMsg }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const systemPrompt = `You are Priorio, a helpful academic assistant for a student. You have access to their upcoming Canvas assignments:\n\n${buildContext()}\n\nToday's date is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. Help the student with questions about their assignments, due dates, study planning, and coursework. Be concise and friendly.`

      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: systemPrompt,
          messages: newMessages.map(m => ({ role: m.role, content: m.text })),
        }),
      })
      const data = await res.json()
      const reply = data?.content?.[0]?.text || 'Sorry, I couldn\'t get a response.'
      setMessages(prev => [...prev, { role: 'assistant', text: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Something went wrong. Please try again.' }])
    }
    setLoading(false)
  }

  const hasMessages = messages.length > 0

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#f0f3f7',
        borderRadius: '16px',
        margin: '1rem 1rem 1rem 0',
        overflow: 'hidden',
      }}
    >
      {/* Greeting or chat history */}
      {!hasMessages ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.75rem, 2.5vw, 2.75rem)',
              fontWeight: 900,
              color: '#111827',
              textAlign: 'center',
              lineHeight: 1.25,
              margin: 0,
            }}
          >
            Hello {firstName},
            <br />
            How can I help you
            <br />
            today?
          </h2>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.25rem 0.5rem' }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '0.75rem',
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  backgroundColor: m.role === 'user' ? NAVY : '#ffffff',
                  color: m.role === 'user' ? '#ffffff' : '#111827',
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '0.625rem 0.875rem',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                }}
              >
                {m.role === 'user' ? m.text : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p style={{ margin: '0 0 0.4em' }}>{children}</p>,
                      ul: ({ children }) => <ul style={{ margin: '0.2em 0', paddingLeft: '1.25em' }}>{children}</ul>,
                      ol: ({ children }) => <ol style={{ margin: '0.2em 0', paddingLeft: '1.25em' }}>{children}</ol>,
                      li: ({ children }) => <li style={{ marginBottom: '0.15em' }}>{children}</li>,
                      strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
                      code: ({ children }) => <code style={{ backgroundColor: '#f1f5f9', borderRadius: '3px', padding: '1px 4px', fontSize: '0.82em' }}>{children}</code>,
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px 16px 16px 4px', padding: '0.625rem 0.875rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
                <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#9ca3af', animation: `bounce 1s ${i * 0.15}s infinite` }} />
                  ))}
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Suggestions + input */}
      <div style={{ padding: '0 1.25rem 1.25rem', flexShrink: 0 }}>
        {!hasMessages && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', justifyContent: 'center' }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '999px',
                  padding: '0.4rem 0.875rem',
                  fontSize: '0.78rem',
                  color: '#374151',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '999px',
            padding: '0.5rem 0.5rem 0.5rem 1rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask me anything..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.9rem', backgroundColor: 'transparent', color: '#111827' }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading}
            style={{
              width: '32px', height: '32px', borderRadius: '50%', border: 'none',
              backgroundColor: input.trim() && !loading ? NAVY : '#e5e7eb',
              cursor: input.trim() && !loading ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'background-color 0.2s',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M13 7.5L2 2l2.5 5.5L2 13l11-5.5z" fill={input.trim() && !loading ? '#ffffff' : '#9ca3af'} />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [selectedTask, setSelectedTask] = useState(null)
  const [gcConnected, setGcConnected] = useState(false)
  const { courses, tasks: allTasks } = canvasData
  const firstName = auth.currentUser?.displayName?.split(' ')[0] ?? 'there'

  useEffect(() => {
    const tryInit = () => {
      if (window.google) {
        initGoogleAuth(() => setGcConnected(true))
      } else {
        setTimeout(tryInit, 300)
      }
    }
    tryInit()
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#ffffff' }}>
      {/* Left panel */}
      <div
        style={{
          flex: '0 0 55%',
          borderRight: '1px solid #e5e7eb',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <WeeklyPanel courses={courses} allTasks={allTasks} onTaskClick={setSelectedTask} gcConnected={gcConnected} onConnectGC={connectGoogleCalendar} />
        {selectedTask && (
          <TaskModal task={selectedTask} courses={courses} gcConnected={gcConnected} onConnectGC={connectGoogleCalendar} onClose={() => setSelectedTask(null)} />
        )}
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ChatPanel firstName={firstName} allTasks={allTasks} />
      </div>
    </div>
  )
}

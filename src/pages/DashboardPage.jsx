import { useState } from 'react'
import { COURSES, WEEK, TASKS } from '../data/tasks'
import TaskModal from '../components/TaskModal'
import CalendarView from '../components/CalendarView'

const NAVY = '#1e3a6e'
const SUGGESTIONS = [
  'Create study times for this week.',
  'What do I need to work on this week?',
  'Can schedule a team meeting on Monday for INFO 490?',
]

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({ task, onClick }) {
  const course = COURSES[task.course]
  return (
    <div
      onClick={() => onClick(task)}
      style={{
        backgroundColor: course.bg,
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
      {task.description ? (
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
          {task.description}
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

function WeeklyPanel({ onTaskClick }) {
  const [startDay, setStartDay] = useState(0)
  const [gcView, setGcView] = useState(false)

  const visibleDays = WEEK.slice(startDay, startDay + 3)
  const canGoBack = startDay > 0
  const canGoForward = startDay + 3 < WEEK.length

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
              {Object.entries(COURSES).map(([name, { color }]) => (
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

        {/* View toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
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

      {/* ── Google Calendar View ── */}
      {gcView && <CalendarView />}

      {/* ── Canvas Workload View ── */}
      {!gcView && (
        <>
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
              onClick={() => canGoBack && setStartDay((d) => d - 1)}
              style={{
                background: 'none',
                border: 'none',
                cursor: canGoBack ? 'pointer' : 'default',
                color: canGoBack ? '#374151' : '#d1d5db',
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
              onClick={() => canGoForward && setStartDay((d) => d + 1)}
              style={{
                background: 'none',
                border: 'none',
                cursor: canGoForward ? 'pointer' : 'default',
                color: canGoForward ? '#374151' : '#d1d5db',
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
              const dayTasks = TASKS.filter((t) => t.dayIndex === startDay + colIdx)
              return (
                <div
                  key={d.day}
                  style={{ flex: 1, overflowY: 'auto', paddingBottom: '0.5rem' }}
                >
                  {dayTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onClick={onTaskClick} />
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

function ChatPanel() {
  const [input, setInput] = useState('')

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
      {/* Greeting */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
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
          Hello David,
          <br />
          How can I help you
          <br />
          today?
        </h2>
      </div>

      {/* Suggestions + input */}
      <div style={{ padding: '0 1.25rem 1.25rem', flexShrink: 0 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '0.75rem',
            justifyContent: 'center',
          }}
        >
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
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
            placeholder=""
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '0.9rem',
              backgroundColor: 'transparent',
              color: '#111827',
            }}
          />
          <button
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: input.trim() ? NAVY : '#e5e7eb',
              cursor: input.trim() ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background-color 0.2s',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M13 7.5L2 2l2.5 5.5L2 13l11-5.5z" fill={input.trim() ? '#ffffff' : '#9ca3af'} />
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
        <WeeklyPanel onTaskClick={setSelectedTask} />
        {selectedTask && (
          <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ChatPanel />
      </div>
    </div>
  )
}

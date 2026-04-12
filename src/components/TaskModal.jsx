import { COURSES } from '../data/tasks'

const NAVY = '#1e3a6e'

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: '6px' }}>
      <path
        d="M10 2H12V4M12 2L7 7M5.5 3H3C2.45 3 2 3.45 2 4V11C2 11.55 2.45 12 3 12H10C10.55 12 11 11.55 11 11V8.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function TaskModal({ task, onClose }) {
  if (!task) return null
  const course = COURSES[task.course]

  return (
    <>
      {/* Invisible backdrop to catch outside clicks */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 40,
        }}
      />

      {/* Modal card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '440px',
          maxHeight: '82%',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          padding: '1.5rem',
          zIndex: 50,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: NAVY,
            border: 'none',
            cursor: 'pointer',
            color: 'white',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ×
        </button>

        {/* Title */}
        <h2
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#111827',
            margin: '0 2rem 0.375rem 0',
          }}
        >
          {task.title}
        </h2>

        {/* Course badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '1rem',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              backgroundColor: course.color,
              borderRadius: '2px',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: '0.8rem', color: '#374151' }}>{task.course}</span>
        </div>

        {/* Due Date */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#374151' }}>Due Date:</span>
          <br />
          <span style={{ fontSize: '0.9rem', color: '#111827' }}>{task.dueDate}</span>
        </div>

        {/* Assignment Summary box */}
        {task.summary && (
          <div style={{ marginBottom: '1.25rem' }}>
            <p
              style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                margin: '0 0 0.375rem',
              }}
            >
              Assignment Summary:
            </p>
            <div
              style={{
                backgroundColor: NAVY,
                borderRadius: '8px',
                padding: '0.875rem 1rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                lineHeight: 1.5,
              }}
            >
              {task.summary}
            </div>
          </div>
        )}

        {/* Details */}
        {(task.readings.length > 0 || task.boldNote || task.note) && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#374151', margin: '0 0 0.25rem', fontWeight: 500 }}>
              Details:
            </p>
            {task.readings.length > 0 && (
              <>
                <p style={{ fontSize: '0.875rem', color: '#111827', margin: '0 0 0.25rem' }}>
                  Readings:
                </p>
                <ul style={{ margin: '0 0 0.5rem', paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#111827' }}>
                  {task.readings.map((r, i) => (
                    <li key={i} style={{ marginBottom: '0.2rem' }}>
                      {r.text}
                      {r.subitems.length > 0 && (
                        <ul style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                          {r.subitems.map((s, j) => (
                            <li key={j}>{s}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {task.boldNote && (
              <p style={{ fontSize: '0.875rem', color: '#111827', margin: '0 0 0.25rem' }}>
                <strong>{task.boldNote}</strong>
                {task.note && ` ${task.note}`}
              </p>
            )}
            {task.hasGuidelinesLink && (
              <p style={{ fontSize: '0.875rem', color: '#111827', margin: '0.25rem 0 0' }}>
                Guidelines for reading annotations can be found{' '}
                <a href="#" style={{ color: NAVY }}>
                  here.
                </a>
              </p>
            )}
          </div>
        )}

        {/* Submission Type */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#374151' }}>Submission Type(s):</span>
          <br />
          <span style={{ fontSize: '0.875rem', color: '#111827' }}>{task.submissionType}</span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            style={{
              flex: 1,
              backgroundColor: NAVY,
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Add due date to Google Calendar
            <ExternalLinkIcon />
          </button>
          <button
            style={{
              flex: 1,
              backgroundColor: '#ffffff',
              color: NAVY,
              border: `1.5px solid ${NAVY}`,
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Go to assignment
            <ExternalLinkIcon />
          </button>
        </div>
      </div>
    </>
  )
}

import { useState, useEffect } from 'react'
import { useStatistics } from '@/hooks/useStatistics'

interface ReadingGoalProps {
  initialTarget: number
  booksRead: number
}

export default function ReadingGoal({ initialTarget, booksRead }: ReadingGoalProps) {
  const [target, setTarget] = useState(initialTarget)
  const [editMode, setEditMode] = useState(false)
  const [newTarget, setNewTarget] = useState(initialTarget)
  const { refreshStats } = useStatistics()

  useEffect(() => {
    setTarget(initialTarget)
    setNewTarget(initialTarget)
  }, [initialTarget])

  const progress = target > 0 ? (booksRead / target) * 100 : 0

  const handleSetGoal = async () => {
    const year = new Date().getFullYear()
    const response = await fetch('/api/reading-goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ year, target_books: newTarget }),
    })

    if (response.ok) {
      setEditMode(false)
      refreshStats()
    }
  }

  return (
    <div className="widget">
      <h3 className="widget-title">{new Date().getFullYear()} Reading Goal</h3>
      <div className="progress-section">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">
          {booksRead} of {target} books ({Math.round(progress)}%)
        </div>
      </div>
      {editMode ? (
        <div className="edit-goal">
          <input
            type="number"
            value={newTarget}
            onChange={(e) => setNewTarget(parseInt(e.target.value))}
            className="form-input"
          />
          <button onClick={handleSetGoal} className="btn btn-primary">
            Set Goal
          </button>
          <button onClick={() => setEditMode(false)} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={() => setEditMode(true)} className="btn btn-secondary">
          Set New Goal
        </button>
      )}
    </div>
  )
}

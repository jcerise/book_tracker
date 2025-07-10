interface StatCardProps {
  label: string
  value: string | number
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-number">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

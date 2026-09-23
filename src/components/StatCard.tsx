interface StatCardProps {
  label: string
  value: string
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg bg-surface px-4 py-3">
      <p className="text-xs font-medium text-on-surface-variant">{label}</p>
      <p className="mt-1 text-2xl font-medium text-on-surface">{value}</p>
    </div>
  )
}

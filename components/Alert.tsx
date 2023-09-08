export const Alert = ({
  type,
  title,
  message,
}: {
  type: 'success' | 'danger' | 'warning'
  title: string
  message: string
}) => {
  const styles = {
    danger: 'bg-red-100 text-red-600 p-3 rounded shadow max-w-sm',
    success: 'bg-emerald-100 text-emerald-600 p-3 rounded shadow max-w-sm',
    warning: 'bg-amber-100 text-amber-600 p-3 rounded shadow max-w-sm',
  }[type]

  return (
    <div className={styles}>
      <p className="font-bold">{title}</p>
      <p className="text-sm">{message}</p>
    </div>
  )
}

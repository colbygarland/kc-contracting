export const Alert = ({
  type,
  title,
  message,
}: {
  type: 'success' | 'danger'
  title: string
  message: string
}) => {
  const styles = {
    danger: 'bg-red-100 text-red-600 p-3 rounded shadow',
    success: 'bg-emerald-100 text-emerald-600 p-3 rounded shadow',
  }[type]

  return (
    <div className={styles}>
      <p className="font-bold">{title}</p>
      <p className="text-sm">{message}</p>
    </div>
  )
}

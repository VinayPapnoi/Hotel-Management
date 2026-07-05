import './LoadingSpinner.css'

function LoadingSpinner({ label = 'Loading hotels' }) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite" aria-busy="true">
      <span className="loading-spinner__circle" />
      <span className="loading-spinner__label">{label}</span>
    </div>
  )
}

export default LoadingSpinner

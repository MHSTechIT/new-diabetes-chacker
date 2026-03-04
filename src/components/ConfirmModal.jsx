import './ConfirmModal.css'

export default function ConfirmModal({ message, confirmLabel = 'Yes', cancelLabel = 'No', onConfirm, onCancel }) {
  return (
    <div className="confirm-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-message">
      <div className="confirm-modal">
        <p id="confirm-modal-message" className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          <button type="button" className="confirm-modal-cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="confirm-modal-confirm" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

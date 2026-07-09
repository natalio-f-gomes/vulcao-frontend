import { useEffect } from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  itemName: string;
  itemType?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isDeleting?: boolean; // shows spinner on confirm button during deletion
}

export function ConfirmDeleteModal({
  isOpen,
  itemName,
  itemType = "item",
  onConfirm,
  onCancel,
  isDeleting = false,
}: ConfirmDeleteModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, isDeleting, onCancel]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ display: "block" }}
        onClick={() => !isDeleting && onCancel()}
      />

      {/* Modal */}
      <div
        className="modal fade show"
        style={{ display: "block" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmDeleteTitle"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="confirmDeleteTitle">
                Confirm deletion
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onCancel}
                disabled={isDeleting}
              />
            </div>

            <div className="modal-body">
              <p className="mb-0">
                Are you sure you want to delete <strong>{itemName}</strong>?
              </p>
              <p className="text-muted small mt-2 mb-0">
                This action cannot be undone.
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Deleting…
                  </>
                ) : (
                  `Delete ${itemType}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

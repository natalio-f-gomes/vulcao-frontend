import React, { useState } from "react";
import { postInquiryRequest, resetPasswordRequest } from "../api/requests";
import { entityType, InquiryModel } from "../api/interfaces";

interface MFAConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: InquiryModel;
  onVerifySuccess: (code: string) => void;
}

function MFAConfirmation({
  isOpen,
  onClose,
  inquiry,
  onVerifySuccess,
}: MFAConfirmationProps) {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setVerificationCode("");
      setIsCodeSent(false);
      setIsVerifying(false);
      setError("");
    }
  }, [isOpen]);

  const handleSendCode = async () => {
    if (!inquiry.userEmail) {
      setError("Email is required");
      return;
    }
    setIsVerifying(true);
    setError("");
    try {
      // use the page's sender if given, else fall back to password-reset
    } catch {
      setError("An error occurred while sending the code");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerify = () => {
    if (!verificationCode || verificationCode.length < 4) {
      setError("Please enter a valid verification code.");
      return;
    }
    setError("");
    // Hand the code to the parent — the parent performs the actual verification
    onVerifySuccess(verificationCode);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          x
        </button>

        <h2 className="auth-title">Verificação MFA</h2>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Email Display (read-only) */}
          <div className="mb-4">
            <label
              className="form-label"
              style={{
                color: "var(--cream)",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Endereço de e-mail
            </label>
            <div
              style={{
                padding: "0.75rem",
                background: "#1a1a1a",
                borderRadius: "0",
                color: "var(--cream)",
                border: "1px solid #333",
              }}
            >
              {inquiry.userEmail}
            </div>
          </div>

          {/* Verification Code Input */}
          <div className="mb-4">
            <label
              className="form-label"
              style={{
                color: "var(--cream)",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Código de verificação
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Introduza o código de 6 dígitos"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={!isCodeSent}
              style={{
                borderColor: error ? "#c0392b" : "#333",
                opacity: !isCodeSent ? 0.6 : 1,
              }}
            />
            {!isCodeSent && (
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#888",
                  marginTop: "0.3rem",
                }}
              >
                Clique em "Enviar código" para receber o código por e-mail.
              </div>
            )}
            {isCodeSent && (
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#2ecc71",
                  marginTop: "0.3rem",
                }}
              >
                ✓ Código enviado para o seu e-mail.
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                color: "#c0392b",
                fontSize: "0.9rem",
                marginBottom: "1rem",
                padding: "0.5rem",
                background: "#fde8e8",
                borderRadius: "4px",
              }}
            >
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="button-group">
            {!isCodeSent ? (
              <button
                className="btn-auth"
                onClick={handleSendCode}
                disabled={isVerifying}
              >
                {isVerifying ? "A enviar..." : "Enviar código de verificação"}
              </button>
            ) : (
              <button className="btn-auth" onClick={handleVerify}>
                Verificar
              </button>
            )}
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 14, 14, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
          background: var(--ink, #0f0e0e);
          color: var(--cream, #f7f4ef);
          border-top: 4px solid var(--accent, #c8452a);
          border-radius: 0;
          padding: 2.5rem;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: slideUp 0.3s ease-out;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .modal-close {
          position: absolute;
          top: 0.75rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.75rem;
          line-height: 1;
          color: var(--cream, #f7f4ef);
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          transition: color 0.2s;
        }
        .modal-close:hover {
          color: var(--accent, #c8452a);
          background: transparent;
        }

        .auth-title {
          font-family: "Playfair Display", serif;
          font-size: 2rem;
          font-weight: 700;
          color: var(--cream, #f7f4ef);
          margin-bottom: 1.75rem;
          text-align: center;
        }

        .mb-4 { margin-bottom: 1.5rem; }
        .mb-3 { margin-bottom: 1rem; }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .form-control {
          width: 100%;
          padding: 0.8rem;
          background: transparent;
          border: 1px solid #333;
          border-radius: 0;
          color: var(--cream, #f7f4ef);
          font-size: 1rem;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .form-control::placeholder {
          color: #666;
        }
        .form-control:focus {
          outline: none;
          background: #1a1a1a;
          border-color: var(--accent, #c8452a);
          box-shadow: none;
        }
        .form-control:disabled {
          cursor: not-allowed;
        }

        .btn-auth {
          width: 100%;
          padding: 0.8rem;
          background: var(--accent, #c8452a);
          color: #fff;
          border: none;
          border-radius: 0;
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-auth:hover:not(:disabled) {
          background: #a83420;
        }
        .btn-auth:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .button-group {
          margin-top: 1rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Scrollbar */
        .modal-content::-webkit-scrollbar { width: 6px; }
        .modal-content::-webkit-scrollbar-track { background: #1a1a1a; }
        .modal-content::-webkit-scrollbar-thumb { background: #444; border-radius: 10px; }
        .modal-content::-webkit-scrollbar-thumb:hover { background: var(--accent, #c8452a); }
      `}</style>
    </div>
  );
}

export default MFAConfirmation;

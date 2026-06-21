import { useState, useRef, useEffect } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

interface MFAComponentProps {
  email?: string;
  username?: string;
  onVerify: (code: string) => void | Promise<void>;
  onClose: () => void;
}

const maxCodeLength: number = 6;

function MFAComponent({
  email,
  onVerify,
  onClose,
  username,
}: MFAComponentProps) {
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(digits);
    if (error) setError("");
  };

  const handleSubmit = async (): Promise<void> => {
    if (code.length < maxCodeLength || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await onVerify(code);
    } catch (err) {
      console.log(err);
      setError(
        err instanceof Error && err.message
          ? err.message
          : "That code didn't match. Check it and try again.",
      );
      setCode("");
      inputRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <>
      <style>{`
        .mfa-overlay {
          position: fixed; inset: 0; z-index: 2000;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          background: rgba(15, 14, 14, 0.8);
          backdrop-filter: blur(4px);
          animation: mfaFade 0.2s ease;
        }
        .mfa-modal {
          width: 100%; max-width: 460px;
          background: var(--cream, #f7f4ef);
          color: var(--ink, #0f0e0e);
          border-top: 4px solid var(--accent, #c8452a);
          font-family: 'DM Sans', sans-serif;
          animation: mfaSlideIn 0.3s ease-out;
        }
        .mfa-head {
          padding: 1.5rem 2rem;
          background: var(--ink, #0f0e0e);
          color: var(--cream, #f7f4ef);
          display: flex; align-items: center; justify-content: space-between;
        }
        .mfa-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem; margin: 0; font-weight: 900;
        }
        .mfa-close {
          background: transparent; border: none;
          color: var(--cream, #f7f4ef);
          font-size: 2rem; line-height: 1; cursor: pointer;
          transition: color 0.2s;
        }
        .mfa-close:hover { color: var(--accent, #c8452a); }
        .mfa-body { padding: 2rem; }
        .mfa-intro {
          font-size: 0.85rem; line-height: 1.65;
          color: var(--mid, #5a5650); margin: 0 0 1.5rem;
        }
        .mfa-intro strong { color: var(--ink, #0f0e0e); font-weight: 600; }
        .mfa-label {
          display: block;
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--mid, #5a5650); margin-bottom: 0.6rem;
        }
        .mfa-input {
          width: 100%; box-sizing: border-box;
          padding: 0.9rem;
          background: #fff;
          border: 1px solid #ddd; border-radius: 0;
          outline: none;
          font-family: 'DM Mono', 'JetBrains Mono', ui-monospace, monospace;
          font-size: 1.7rem; text-align: center;
          letter-spacing: 0.5em; text-indent: 0.5em;
          color: var(--ink, #0f0e0e);
          transition: border-color 0.2s;
        }
        .mfa-input::placeholder { color: #c9c4bc; letter-spacing: 0.5em; }
        .mfa-input:focus { border-color: var(--accent, #c8452a); }
        .mfa-input[aria-invalid="true"] { border-color: #c0392b; }
        .mfa-error {
          margin: 0.6rem 0 0; font-size: 0.8rem; color: #c0392b; line-height: 1.5;
        }
        .mfa-footer { display: flex; gap: 1rem; margin-top: 2rem; }
        .mfa-btn-cancel {
          flex: 1;
          background: transparent; border: 1px solid #ddd; border-radius: 0;
          padding: 0.8rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.06em;
          color: var(--mid, #5a5650); cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .mfa-btn-cancel:hover { border-color: #aaa; color: var(--ink, #0f0e0e); }
        .mfa-btn-verify {
          flex: 2;
          background: var(--ink, #0f0e0e); color: var(--cream, #f7f4ef);
          border: none; border-radius: 0;
          padding: 0.8rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 1px;
          cursor: pointer; transition: background 0.2s, opacity 0.2s;
        }
        .mfa-btn-verify:hover:not(:disabled) { background: var(--accent, #c8452a); }
        .mfa-btn-verify:disabled { opacity: 0.4; cursor: not-allowed; }
        .mfa-resend {
          display: block; width: 100%; margin-top: 1rem;
          background: transparent; border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: var(--mid, #5a5650); cursor: pointer;
          transition: color 0.2s;
        }
        .mfa-resend:hover { color: var(--accent, #c8452a); }
        @keyframes mfaFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes mfaSlideIn {
          from { transform: translateY(30px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mfa-overlay, .mfa-modal { animation: none; }
        }
      `}</style>

      {/*  <div className="mfa-overlay" onMouseDown={onClose}> */}
      <div className="mfa-overlay">
        <div
          className="mfa-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mfa-title"
        >
          {/*    onMouseDown={(e) => e.stopPropagation()} */}
          <div className="mfa-head">
            <h2 id="mfa-title" className="mfa-title">
              Verifique a sua identidade
            </h2>
            <button
              className="mfa-close"
              aria-label="Fechar"
              type="button"
              onClick={onClose}
            >
              x
            </button>
          </div>

          <div className="mfa-body">
            {email && email.trim() !== "" && (
              <p className="mfa-intro">
                Introduza o código de 6 dígitos que enviámos para{" "}
                <strong>{email}</strong> para continuar.
              </p>
            )}
            {username && username.trim() !== "" && (
              <p className="mfa-intro">
                Introduza o código de 6 dígitos que enviámos para o email
                associado ao utilizador <strong>{username}</strong> para
                continuar.
              </p>
            )}

            <label className="mfa-label" htmlFor="mfa-code">
              Código de verificação
            </label>
            <input
              id="mfa-code"
              ref={inputRef}
              className="mfa-input"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={7}
              placeholder="000000"
              value={code}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              aria-label="código de verificação de 6 dígitos"
              aria-invalid={error ? true : undefined}
            />

            {error && (
              <p className="mfa-error" role="alert">
                {error}
              </p>
            )}

            <div className="mfa-footer">
              <button
                className="mfa-btn-cancel"
                type="button"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                className="mfa-btn-verify"
                type="button"
                onClick={handleSubmit}
                disabled={code.length < maxCodeLength || submitting}
              >
                {submitting ? "Verificando…" : "Verificar Código"}
              </button>
            </div>

            {/* {onResend && (
              <button className="mfa-resend" type="button" onClick={onResend}>
                Didn't get it? Resend code
              </button>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}

export default MFAComponent;

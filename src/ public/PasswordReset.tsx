import React, { useState } from 'react';
import { resetPasswordConfirm, resetPasswordRequest } from '../api/requests';
import GetHeader from '../components/header';
import GetFooterSection from '../components/footer';
import { useNavigate, useParams } from 'react-router-dom';
import { entityType } from '../api/interfaces';
// Make sure to import your global CSS file that contains all the provided styles




function ResetPasswordPage() {
    const { entity } = useParams<{ entity: entityType }>();

  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const onNavigate =useNavigate();

  // --- Functionality will be added by you ---
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendCode = async () => {
    if(!entity){return;}
    // Validate email
    if (!email || !validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    
    console.log('Sending code to:', email);
    const response = await resetPasswordRequest(entity,email);
    console.log("Response reseting password request: ", response);
    const  message = await response.text();
    alert(message)
    if(response.status === 202){ 
        setIsCodeSent(true);
    }
    
    console.log('Sending code to:', email);
  };

  const handleVerifyAndReset = async () => {
        if(!entity){return;}
    // Validate verification code
    if (!verificationCode || verificationCode.length < 4) {
      alert('Please enter a valid verification code.');
      return;
    }

    // Validate passwords
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }


    console.log('Verifying code:', verificationCode);
    console.log('Resetting password for:', email);
    const response = await resetPasswordConfirm(entity, email, verificationCode, {newPassword: newPassword});
    console.log("Response reseting password Confirm: ", response);
    
    
    if(response.status === 200 ){
        const  message = await response.text();
        alert(message)
          onNavigate(`/${entity}-login`)
    }
    else if(response.status === 400 ){
        try{
            const  message = await response.text();
            alert(message)
        }catch(error){
            console.log(error)
        }
        
    }
    else if(response.status === 403){
        const  message = await response.text();
        alert(message)
    }

  };

  return (
    <>
    <GetHeader/>
    <div className="app-wrapper">
      {/* --- NAVBAR (Optional - you can include your existing navbar here or keep it separate) --- */}
      
        

      {/* --- RESET PASSWORD PAGE CONTENT --- */}
      <div style={{ 
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--cream)'
      }}>
        <div className="auth-card" style={{ maxWidth: '500px', width: '100%' }}>
          <h2 className="auth-title">Mudar palavra-passe</h2>
          
          <form onSubmit={(e) => e.preventDefault()}>
            {/* Step 1: Email Input */}
            <div className="mb-4">
              <label className="form-label" style={{ color: 'var(--cream)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
               Endereço de e-mail
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                style={{
                  borderColor: emailError ? '#c0392b' : '#333'
                }}
              />
              {emailError && (
                <div style={{ color: '#c0392b', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                  {emailError}
                </div>
              )}
            </div>

            {/* Step 2: Verification Code (only visible after email is valid and code is sent) */}
            {isCodeSent && (
            <div className="mb-4">
                <label className="form-label" style={{ color: 'var(--cream)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Código de verificação
                </label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Introduza o código de 6 dígitos"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  
                />
                <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.3rem' }}>
                    O código foi enviado para o seu e-mail.
                </div>
                </div>
            )}

            {/* Step 3: New Password & Confirm Password (only visible after code is sent) */}
            {isCodeSent && (
              <>
                <div className="mb-3">
                  <label className="form-label" style={{ color: 'var(--cream)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                   Nova palavra-passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new password (min 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label" style={{ color: 'var(--cream)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Confirmar palavra-passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <div style={{ color: '#c0392b', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                     As palavras-passe são diferentes.
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Action Button */}
            {!isCodeSent ? (
              <button className="btn-auth" onClick={handleSendCode}>
              Enviar código de verificação
              </button>
            ) : (
              <button className="btn-auth" onClick={handleVerifyAndReset}>
               Verificar e mudar palavra-passe
              </button>
            )}
          </form>

          {/* Back to Login Link */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <a href="/user-login" className="auth-link">
              <span>← Voltar ao início de sessão</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <GetFooterSection/>
    </>
  );
};

export default ResetPasswordPage;



import React, {useState} from "react";
import GetHeader from "../../components/header";
import GetFooterSection from "../../components/footer";
import { Link, useNavigate } from "react-router-dom"; 
import { confirmStaffLogin, loginStaff, requestStaffLogin } from "../../api/requests";
import { UserLoginModel } from "../../api/interfaces";
import { useUserAuthManager } from "../../api/authentication-handler";
import MFAComponent from "../../components/MFAComponent";
import { companyName } from "../../api/global";
import GetTermsSection from "../../components/TermsSection";

function StaffLoginPage() {
  const {login} = useUserAuthManager();
  const onNavigate = useNavigate();

  const [loginForm, setLoginForm] = useState<UserLoginModel>(
    {
      username: "",
      password: ""
    }
  )
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
   const [showMFA, setShowMFA] = useState<boolean>(false);

  console.log(loginForm.username)
  console.log(loginForm.password)

  const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm(
      {...loginForm,
        [event.target.name]: event.target.value
      }
    );
  };

 

   
       const sendMfACode = async () => {
         if (!loginForm) return;
         setError(null);
         setLoading(true);
         try {
           const response = await requestStaffLogin(loginForm.username);
           console.log('MFA CODE REQUEST RESPONSE:', response);
       
           if (response.status === 202) {
             setShowMFA(true);          // code sent → show the popup
           } else if (response.status === 401) {
             alert("Dados de autenticação inválidos.");
           } else if (response.status === 404) {
             alert("Credenciais incorretas.");
           } else if (response.status === 409) {
             alert("Já existe uma entidade com estas credenciais.");
           } else if (response.status === 403) {
             alert("Código errado. Verifique a sua caixa de entrada ou a pasta de spam.");
           } else if (response.status === 400) {
             alert("Certifique-se de que os campos estão preenchidos apenas com dados válidos.");
           } else {
             alert("Erro inesperado. Por favor volte mais tarde");
             console.log("Unexpected error", response);
           }
         } catch (exception) {
           setError(`Login Failed ${exception}`);
         } finally {
           setLoading(false);
         }
       };
   
       const loginRequest = async(code: string) => {
           if(!loginForm){return;}
           setError(null)
           setLoading(true)
 
             try{
       const response = await confirmStaffLogin (code, loginForm)
       console.log(response)
       if(!response.ok){
         console.log("Registration Failed")
         console.log(response)
         
       }
 
       if(response.status === 200){
         alert("Sessão do Utilizador iniciada com sucesso.")
         await login("staff");
         window.location.href = "/"
       }
        else if(response.status === 403){
          alert("Dados MFA incorretos. Por favor, tente novamente.")
        }
        else if(response.status === 401 || response.status === 400){
            setShowMFA(false)
            alert("Credenciais incorretas.")
        }
        else{
            alert("Teve um erro com o servidor. Por favor retorne mais tarde")
            console.log(response)
        }
     }catch(error){
         setError(`An expected error Occured ${error}`)
     }finally{setLoading(false)}
 
     console.log(error)
 
          
   }
  return (
    <>
    <div className="d-flex flex-column min-vh-100">
      <GetHeader />
      
      <style>{`
        .login-wrapper { 
          flex: 1; 
          background: #f7f4ef; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          padding: 2rem 0;
        }
        .auth-card { 
          background: #0f0e0e; 
          color: #f7f4ef; 
          padding: 3rem; 
          width: 100%; 
          max-width: 450px; 
          border-top: 4px solid #c8452a; 
        }
        .auth-title { font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 2rem; }
        .form-control-custom { 
          background: transparent; 
          border: 1px solid #333; 
          color: #f7f4ef !important; 
          padding: 0.8rem; 
          width: 100%;
        }
        .btn-auth { 
          background: #c8452a; 
          color: white; 
          border: none; 
          padding: 0.8rem; 
          width: 100%; 
          font-weight: 600; 
          text-transform: uppercase; 
          transition: 0.3s; 
        }
        .btn-auth:hover { background: #a83420; }
      `}</style>

      <main className="login-wrapper">
        <div className="auth-card shadow-lg">
          <h2 className="auth-title">Bem-vindo de volta, caro empragado(a).</h2>

            <div className="mb-3">
              <label className="form-label small text-uppercase fw-bold text-secondary" >Username (Mínimo de 8 caracteres)</label>
              <input type="text" className="form-control-custom" name="username" value={loginForm.username} onChange={handleUserInputChange} required />
            </div>
            <div className="mb-4">
              <label className="form-label small text-uppercase fw-bold text-secondary"  >Password</label>
              <input type="password" className="form-control-custom" name="password" value={loginForm.password} onChange={handleUserInputChange} required />
            </div>
            
            <button type="submit" className="btn-auth mb-3" onClick={() => sendMfACode()}>Sign In</button>
             <GetTermsSection/>
            
           
        </div>
      </main>

      <GetFooterSection />
    </div>
     {showMFA && (
        <MFAComponent
          username={loginForm.username}
          onVerify={(code) => loginRequest(code)}
          onClose={() => setShowMFA(false)}
        />
      )}
      </>
  );
}

export default StaffLoginPage;
import React, {useState} from "react";
import GetHeader from "../../components/header";
import GetFooterSection from "../../components/footer";
import { Link, useNavigate } from "react-router-dom"; 
import { loginUserConfirm, loginUserRequest } from "../../api/requests";
import { UserLoginModel } from "../../api/interfaces";
import { useUserAuthManager } from "../../api/authentication-handler";
import MFAComponent from "../../components/MFAComponent";
import { companyName } from "../../api/global";
import GetTermsSection from "../../components/TermsSection";

function UserLoginPage() {
  const {login} = useUserAuthManager();

  const [showMFA, setShowMFA] = useState<boolean>(false);
  const [userLoginForm, setUserLoginForm] = useState<UserLoginModel>(
    {
      username: "",
      password: ""
    }
  )
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  console.log(userLoginForm.username)
  console.log(userLoginForm.password)
  const onNavigate = useNavigate();

  const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserLoginForm(
      {...userLoginForm,
        [event.target.name]: event.target.value
      }
    );
  };

  const sendMfACode = async () => {
        if(!userLoginForm){return;}
          setError(null)
          setLoading(true)
          setShowMFA(true)
           try{
              const response = await loginUserRequest(userLoginForm.username)
              console.log('MFA CODE REQUEST RESPONSE: ' , response)
            if(response.status === 100){
                alert("User Loggin Successfully")
                setShowMFA(false);
                window.location.href="/";
                return;
            }
            
            else if(response.status === 401){
                alert("Dados de autenticação inválidos. O email deve ter pelo menos 7 caracteres.")
            }
            else if(response.status === 404){
                alert("Credenciais incorretas.")
            }
            else if(response.status === 409){
                alert("Já existe uma entidade com estas credenciais.")
            }
            else if(response.status === 403){
                alert("Código errado. Verifique a sua caixa de entrada ou a pasta de spam.")
            }
            else if(response.status === 400){
                alert("Certifique-se de que os campos estão preenchidos apenas com dados válidos.")
            }
           
            else{
                console.log(`Erro inesperado: `, response)
            }
             setShowMFA(false);
          }catch(exception){
              setError( `Registration Failed ${exception}`)
          }finally{
              setLoading(false)
          }
      }


          const userLoginRequest = async(code: string) => {
              if(!userLoginForm){return;}
              setError(null)
              setLoading(true)
              try{
                  const response = await loginUserConfirm(code, userLoginForm)
                    console.log(response)
                if(response.status === 200){
                    alert("Sessão do Utilizador iniciada com sucesso.")
                    setShowMFA(false)
                    await login("user");
                    window.location.href = "/";
                    return;
                }
                else if(response.status === 403){
                    alert("Dados MFA incorretos. Por favor, tente novamente.")
                }
                else if(response.status === 401 || response.status === 400 || response.status === 404){
                    setShowMFA(false)
                    alert("Credenciais incorretas.")
                }
                else{
                   alert("Teve um erro com o servidor. Por favor retorne mais tarde")
                    console.log(response)
                }
              }catch(exception){
                  setError( `Registration Failed ${exception}`)
              }finally{
                  setLoading(false)
              }
         
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
          <h2 className="auth-title">Bem-vindo de volta, caro Cliente.</h2>

          <div className="mb-3">
            <label className="form-label small text-uppercase fw-bold text-secondary">Nome de Utilizador</label>
            <input type="text" className="form-control-custom" name="username" value={userLoginForm.username} onChange={handleUserInputChange} required />
          </div>
          <div className="mb-4">
            <label className="form-label small text-uppercase fw-bold text-secondary">Palavra-passe</label>
            <input type="password" className="form-control-custom" name="password" value={userLoginForm.password} onChange={handleUserInputChange} required />
          </div>
          
          <button type="submit" className="btn-auth mb-3" onClick={() => sendMfACode()}>Iniciar Sessão</button>
         <GetTermsSection/>
          
          <div className="text-center">
            <Link to="/user-register" className="text-secondary text-decoration-none small">
              Novo no {companyName}.net? <span style={{color: '#c8452a'}}>Criar Conta</span>
            </Link>
          </div>
        </div>
      </main>

      <GetFooterSection />
    </div>


        {showMFA && (
        <MFAComponent
          username={userLoginForm.username}
          onVerify={(code) => userLoginRequest(code)}
          onClose={() => setShowMFA(false)}
        />
      )}
      </>
  );
}

export default UserLoginPage;
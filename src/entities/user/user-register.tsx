import { useState } from "react";
import { UserRegistrationModel } from "../../api/interfaces";
import { registerUser, userRegisterRequest } from "../../api/requests";
import GetHeader from "../../components/header";
import { Link, useNavigate } from "react-router-dom";
import GetFooterSection from "../../components/footer";
import MFAComponent from "../../components/MFAComponent";
import { companyName } from "../../api/global";
import GetTermsSection from "../../components/TermsSection";

function UserRegistrationPage(){
    const [userRegistrationForm, setUserRegistrationForm] = useState<UserRegistrationModel>({
        firstName:"",
        lastName:"",
        password:"",
        email:"",
        username:""
    })

    const onNavigate = useNavigate();
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [showMFA, setShowMFA] = useState<boolean>(false);

    const [error, setError] = useState<String|null>(null)
    const [loading, setLoading] = useState(false)

    console.log(userRegistrationForm.email)
    console.log(userRegistrationForm.lastName)
    console.log(userRegistrationForm.password)
    console.log(userRegistrationForm.firstName)
    console.log(userRegistrationForm.username)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        if(event.target.name === "confirmPassword"){setConfirmPassword(event.target.value)}
        else{
            setUserRegistrationForm(
               { ...userRegistrationForm, //copy everything from the form
                [event.target.name]: event.target.value // and them assign the new values
               }
            )
        }

    }

    const sendMfACode = async () => {
      if(!userRegistrationForm){return;}
        setError(null)
        setLoading(true)
        setShowMFA(true)
         try{
            const response = await userRegisterRequest(userRegistrationForm.email, userRegistrationForm.username)
            console.log('MFA CODE REQUEST RESPONSE: ' , response)
          if(response.status === 100){
              setShowMFA(false);
              window.location.href="/";
              return;
          }
          setShowMFA(false);
       if(response.status === 401){
          alert("Dados de autenticação inválidos. O email deve ter pelo menos 7 caracteres.")
          }
          if(response.status === 409){
              alert("Já existe uma entidade com estas credenciais.")
          }
          if(response.status === 403){
              alert("Código errado. Verifique a sua caixa de entrada ou a pasta de spam.")
          }
          if(response.status === 400){
              alert("Certifique-se de que os campos estão preenchidos apenas com dados válidos.")
          }
          else{
             alert("Erro inesperado")
              console.log(`Erro inesperado: ${response}`)
          }
        }catch(exception){
            setError( `Registration Failed ${exception}`)
        }finally{
            setLoading(false)
        }
    }


    const registerRequest = async(code: string) => {
        if(!userRegistrationForm){return;}
        setError(null)
        setLoading(true)
        if(confirmPassword === userRegistrationForm.password){
        try{
            const response = await registerUser(code, userRegistrationForm)
            if(response.status === 201){
                alert("Utilizador registado com sucesso.")
                setShowMFA(false);
                window.location.href = "/";
                return;
            }
            if(response.status === 401){
                alert("Dados de autenticação inválidos.")
            }
            if(response.status === 409){
                alert("Já existe uma entidade com estas credenciais.")
            }
            if(response.status === 400){
                alert("Certifique-se de que os campos estão preenchidos apenas com dados válidos.")
            }
             if(response.status === 403){
                alert("Dados MFA incorretos. Por favor, tente novamente.")
            }
            else{
               alert("Erro inesperado.")
                console.log(`Erro inesperado: ${response}`)
            }
        }catch(exception){
            setError( `Registration Failed ${exception}`)
        }finally{
            setLoading(false)
        }
    }else{
        alert("The passwords do not match")
    }
}

  return (
    <>
      <GetHeader />
<main className="split-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <div className="form-side">
    <div className="reg-box" style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>

      <h2 className="mb-4 fw-bold" style={{ fontFamily: "Playfair Display" }}>
        Junte-se à {companyName}.
      </h2>

      <div className="row mb-3">
        <div className="col">
          <label className="form-label">Primeiro Nome</label>
          <input type="text" className="form-control" placeholder="João" name="firstName" value={userRegistrationForm.firstName} onChange={handleInputChange} required />
        </div>
        <div className="col">
          <label className="form-label">Último Nome</label>
          <input type="text" className="form-control" placeholder="Silva" name="lastName" value={userRegistrationForm.lastName} onChange={handleInputChange} required />
        </div>
      </div>
      
      <div className="mb-3">
        <label className="form-label">Nome de Utilizador (Mínimo de 8 caracteres)</label>
        <input type="text" className="form-control" placeholder="joao" name="username" value={userRegistrationForm.username} min={8} max={50} onChange={handleInputChange} required />
      </div>
      
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input type="email" className="form-control" placeholder="joao@exemplo.com" name="email" value={userRegistrationForm.email} onChange={handleInputChange} required />
      </div>
      
      <div className="mb-3">
        <label className="form-label">Palavra-passe (Mínimo de 8 caracteres)</label>
        <input type="password" className="form-control" name="password" placeholder="••••••••" value={userRegistrationForm.password} min={8} max={50} onChange={handleInputChange} required />
      </div>
      
      <div className="mb-4">
        <label className="form-label">Confirmar Palavra-passe</label>
        <input type="password" className="form-control" name="confirmPassword" placeholder="••••••••" value={confirmPassword} onChange={handleInputChange} required />
      </div>
      
      {confirmPassword && userRegistrationForm.password !== confirmPassword && (
        <div className="text-danger small mt-1">As palavras-passe não coincidem</div>
      )}
      
      <button type="submit" className="btn btn-dark w-100 py-2 text-uppercase fw-bold" style={{ borderRadius: '0' }} onClick={() => sendMfACode()}>
        Criar Conta
      </button>
    <GetTermsSection/>


      <p className="text-center mt-3 small">
        Já tem uma conta? <Link to="/user-login" className="text-dark fw-bold">Iniciar Sessão</Link>
      </p>

    </div>
  </div>
</main>

      <GetFooterSection />

    {showMFA && (
        <MFAComponent
          email={userRegistrationForm.email}
          onVerify={(code) => registerRequest(code)}
          onClose={() => setShowMFA(false)}
        />
      )}
    </>
  );



}


export default UserRegistrationPage;
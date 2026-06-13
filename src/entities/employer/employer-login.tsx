import React, {useState} from "react";
import GetHeader from "../../components/header";
import GetFooterSection from "../../components/footer";
import { Link } from "react-router-dom"; 
import { UserLoginModel } from "../../api/interfaces";
import { useUserAuthManager } from "../../api/authentication-handler";
import MFAComponent from "../../components/MFAComponent";
import { confirmEmployerLogin, loginUserRequest, requestEmployerLogin } from "../../api/requests";

function EmployerLoginPage() {
  const {login} = useUserAuthManager();

  const [loginForm, setLoginForm] = useState<UserLoginModel>(
    {
      username: "",
      password: ""
    }
  );
  const [showMFA, setShowMFA] = useState<boolean>(false);
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

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
        if(!loginForm){return;}
          setError(null)
          setShowMFA(true)
           try{
              const response = await requestEmployerLogin(loginForm.username)
              console.log('MFA CODE REQUEST RESPONSE: ' , response)
            if(response.status === 100){
                alert("Employer Logged in Successfully")
                setShowMFA(false);
                window.location.href="/"
            }
            setShowMFA(false);
            if(response.status === 401){
                alert("Invalid authentiation data. The email must have at least 7 characters")
            }
            if(response.status === 409){
                alert("There is an entity with this credentials already")
            }
             if(response.status === 403){
                alert("Wrong Code. Please verify your inbox or your spam folder")
            }
             if(response.status === 400){
                alert("Please ensure the input fields are filled with valid data only.")
            }
            else{
                console.log(`Unexpected Error ${response}`)
            }
          }catch(exception){
              setError( `Registration Failed ${exception}`)
          }finally{
              setLoading(false)
          }
      }
  
  
      const registerRequest = async(code: string) => {
          if(!loginForm){return;}
          setError(null)
          setLoading(true)

            try{
      const response = await confirmEmployerLogin (code, loginForm)
      console.log(response)
      if(!response.ok){
        console.log("Registration Failed")
        console.log(response)
        
      }

      if(response.status === 200){
        alert("Employer Login Successfully")
        await login("employer");
        window.location.href = "/"
      }
      else if(response.status === 401 || response.status === 400){
        alert("Invalid Credentials")
      }

      else{
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
      {loading && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", color: "#fff" }}>
          Loading ...
        </div>
      )}
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
          <h2 className="auth-title">Welcome Back Employer.</h2>
            <div className="mb-3">
              <label className="form-label small text-uppercase fw-bold text-secondary" >Username</label>
              <input type="text" className="form-control-custom" name="username" value={loginForm.username} onChange={handleUserInputChange} required />
            </div>
            <div className="mb-4">
              <label className="form-label small text-uppercase fw-bold text-secondary"  >Password</label>
              <input type="password" className="form-control-custom" name="password" value={loginForm.password} onChange={handleUserInputChange} required />
            </div>
            
            <button type="submit" className="btn-auth mb-3" onClick={()=> sendMfACode()}>Sign In</button>
            
            <div className="text-center">
              <Link to="/employer-register" className="text-secondary text-decoration-none small">
                New to ShopLane? <span style={{color: '#c8452a'}}>Create Account</span>
              </Link>
            </div>
        </div>
      </main>

      <GetFooterSection />
    </div>
  
      {showMFA && (
        <MFAComponent
          username={loginForm.username}
          onVerify={(code) => registerRequest(code)}
          onClose={() => setShowMFA(false)}
        />
      )}
    </>
  );
}

export default EmployerLoginPage;
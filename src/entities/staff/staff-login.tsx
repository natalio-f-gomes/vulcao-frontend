import React, {useState} from "react";
import GetHeader from "../../components/header";
import GetFooterSection from "../../components/footer";
import { Link, useNavigate } from "react-router-dom"; 
import { confirmStaffLogin, loginStaff, requestStaffLogin } from "../../api/requests";
import { UserLoginModel } from "../../api/interfaces";
import { useUserAuthManager } from "../../api/authentication-handler";
import MFAComponent from "../../components/MFAComponent";
import { companyName } from "../../api/global";

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
         if(!loginForm){return;}
           setError(null)
           setShowMFA(true)
            try{
               const response = await requestStaffLogin(loginForm.username)
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
         alert("Employer Login Successfully")
         await login("staff");
         window.location.href = "/"
       }
         else if(response.status === 403){
         alert("Wrong MFA Code")
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
          <h2 className="auth-title">Welcome Back Staff.</h2>

            <div className="mb-3">
              <label className="form-label small text-uppercase fw-bold text-secondary" >Username</label>
              <input type="text" className="form-control-custom" name="username" value={loginForm.username} onChange={handleUserInputChange} required />
            </div>
            <div className="mb-4">
              <label className="form-label small text-uppercase fw-bold text-secondary"  >Password</label>
              <input type="password" className="form-control-custom" name="password" value={loginForm.password} onChange={handleUserInputChange} required />
            </div>
            
            <button type="submit" className="btn-auth mb-3" onClick={() => sendMfACode()}>Sign In</button>
                           <span>
                                Ao continuar, concordas com os {companyName}{" "}
                                <a 
                                  href="#" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onNavigate("/terms");
                                  }}
                                  style={{ cursor: 'pointer' }}
                                >
                                  termos de uso
                                </a>
                              </span>
            
           
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
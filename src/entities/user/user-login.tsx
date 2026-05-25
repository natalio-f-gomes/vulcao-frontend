import React, {useState} from "react";
import GetHeader from "../../components/header";
import GetFooterSection from "../../components/footer";
import { Link } from "react-router-dom"; 
import { loginUser } from "../../api/requests";
import { UserLoginModel } from "../../api/interfaces";
import { useUserAuthManager } from "../../api/authentication-handler";
import { getUserProfileData } from "../../api/requests";

function UserLoginPage() {
  const {login} = useUserAuthManager();

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

  const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserLoginForm(
      {...userLoginForm,
        [event.target.name]: event.target.value
      }
    );
  };

  const handleApiCall = async ( event: React.SyntheticEvent<HTMLFormElement>) =>{
    event.preventDefault();
    setError(null)
    setLoading(true)
    try{
      const response = await loginUser(userLoginForm);
      console.log(response)
      if(!response.ok){
        console.log("Registration Failed")
        console.log(response)
        
      }
      if(response.status === 200){
        alert("User Login Successfully")
        await login("user");
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
          <h2 className="auth-title">Welcome Back dear Customer.</h2>
          <form id="userLoginForm" onSubmit={handleApiCall}>
            <div className="mb-3">
              <label className="form-label small text-uppercase fw-bold text-secondary" >Username</label>
              <input type="text" className="form-control-custom" name="username" value={userLoginForm.username} onChange={handleUserInputChange} required />
            </div>
            <div className="mb-4">
              <label className="form-label small text-uppercase fw-bold text-secondary"  >Password</label>
              <input type="password" className="form-control-custom" name="password" value={userLoginForm.password} onChange={handleUserInputChange} required />
            </div>
            
            <button type="submit" className="btn-auth mb-3">Sign In</button>
            
            <div className="text-center">
              <Link to="/user-register" className="text-secondary text-decoration-none small">
                New to ShopLane? <span style={{color: '#c8452a'}}>Create Account</span>
              </Link>
            </div>
          </form>
        </div>
      </main>

      <GetFooterSection />
    </div>
  );
}

export default UserLoginPage;
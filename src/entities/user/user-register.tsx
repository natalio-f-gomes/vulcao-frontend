import { useState } from "react";
import { UserRegistrationModel } from "../../api/interfaces";
import { registerUser } from "../../api/requests";
import GetHeader from "../../components/header";
import { Link } from "react-router-dom";
import GetFooterSection from "../../components/footer";

function UserRegistrationPage(){
    const [userRegistrationForm, setUserRegistrationForm] = useState<UserRegistrationModel>({
        firstName:"",
        lastName:"",
        password:"",
        email:"",
        username:""
    })

    const [confirmPassword, setConfirmPassword] = useState<string>("")

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

    const registerRequest = async(event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null)
        setLoading(true)
        if(confirmPassword === userRegistrationForm.password){
        try{
            const response = await registerUser(userRegistrationForm)
            if(!response.ok){
                console.log(response)
                alert("There was an issue with your request")
            }
            if(response.status === 201){
                alert("User Registered Successfully")
                window.location.href="/"
            }
            if(response.status === 401){
                alert("Invalid authentiation data")
            }
            if(response.status === 409){
                alert("There is an entity with this credentials already")
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
              Join ShopLane.
            </h2>
            
            <form id="userRegistrationForm" onSubmit={registerRequest}>
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-control" placeholder="John" name="firstName"  value={userRegistrationForm.firstName}  onChange={handleInputChange} required />
                </div>
                <div className="col">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-control" placeholder="Doe" name="lastName"  value={userRegistrationForm.lastName} onChange={handleInputChange} required />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" placeholder="john" name="username" value={userRegistrationForm.username} onChange={handleInputChange}  required />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder="john@example.com" name="email" value={userRegistrationForm.email} onChange={handleInputChange}  required />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" name="password" placeholder="••••••••" value={userRegistrationForm.password} onChange={handleInputChange}  required />
              </div>
                <div className="mb-4">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className="form-control" name="confirmPassword" placeholder="••••••••" value={confirmPassword} onChange={handleInputChange} required/>
                </div>
                {confirmPassword && userRegistrationForm.password !== confirmPassword && (
                    <div className="text-danger small mt-1">Passwords do not match</div>
                )}

              
         
              <button type="submit" className="btn btn-dark w-100 py-2 text-uppercase fw-bold" style={{ borderRadius: '0' }}>
                Create Account
              </button>
              
              <p className="text-center mt-3 small">
                Already have an account? <Link to="/user-login" className="text-dark fw-bold">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      <GetFooterSection />
    </>
  );



}


export default UserRegistrationPage;
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


    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [showMFA, setShowMFA] = useState<boolean>(false);

    const [error, setError] = useState<String|null>(null)
    const [loading, setLoading] = useState(false)


    // Email validation function
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }


   const isValidUsername = (username: string): boolean => {
    return (
        !username.includes(' ') && 
        !username.includes('\'') && 
        !username.includes('/') && 
        !username.includes('\\') && 
        username.length >= 8 && 
        username.length <= 50
    );
}


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        if(event.target.name === "confirmPassword"){
            setConfirmPassword(event.target.value)
        }
        else{
            setUserRegistrationForm(
               { ...userRegistrationForm,
                [event.target.name]: event.target.value
               }
            )
        }
    }

    const sendMfACode = async () => {
        if (!userRegistrationForm) return;
        setError(null);

        if (userRegistrationForm.password.length < 8) {
            alert("O comprimento das palavras-passe deve ter, pelo menos, 8 caracteres.");
            return;
        }


        if (confirmPassword !== userRegistrationForm.password) {
            alert("As palavras-passe não coincidem.");
            return;
        }
        if (!isValidUsername(userRegistrationForm.username)) {
            if (userRegistrationForm.username.includes(' ')) {
                alert("O nome de utilizador não pode conter espaços.");
            } else if (userRegistrationForm.username.includes('\'')) {
                alert("O nome de utilizador não pode conter aspas simples.");
            } else if (userRegistrationForm.username.includes('/') || userRegistrationForm.username.includes('\\')) {
                alert("O nome de utilizador não pode conter barras (/ ou \\).");
            } else if (userRegistrationForm.username.length < 8 || userRegistrationForm.username.length > 50) {
                alert("O comprimento do nome de utilizador deve ter entre 8 e 50 caracteres.");
            }
            return;
        }


        if (!isValidEmail(userRegistrationForm.email)) {
            alert("Por favor, insira um endereço de email válido.");
            return;
        }

        // Validate first name and last name (optional - no spaces)
        if (userRegistrationForm.firstName.trim() === "" || userRegistrationForm.lastName.trim() === "") {
            alert("Por favor, preencha o primeiro nome e último nome.");
            return;
        }

        setLoading(true);

        const response = await userRegisterRequest(userRegistrationForm.email, userRegistrationForm.username);

        if (response.status === 202) {
            setShowMFA(true);           
        }
        else if (response.status === 409) {
            alert("Já existe uma entidade com estas credenciais.");
        } else  if (response.status === 401) {
            alert("Dados de autenticação inválidos.");
        } else if (response.status === 400) {
           const data = await response.text();
          console.log("Data: " , data)
          const errorMessage = JSON.parse(data)
            alert(errorMessage.error);
        } else {
            alert("Erro inesperado. Por favor volte mais tarde.");
            console.log("Unexpected error", response);
        }
        setLoading(false);
    };
    

const registerRequest = async (code: string) => {
    if (!userRegistrationForm) { return; }
    setError(null);
    setLoading(true);
    
    if (confirmPassword !== userRegistrationForm.password) {
        alert("As palavras-passe não coincidem");
        setLoading(false);
        return;
    }
    
    try {
        const response = await registerUser(code, userRegistrationForm);
        
        if (response.status === 201) {
            alert("Utilizador registado com sucesso.");
            setShowMFA(false);
            window.location.href = "/";
            return;
        }
        
        // Handle error responses - try to get message from response
        let errorMessage = "";
        try {
            const data = await response.json();
            errorMessage = data.message || data.error || "";
        } catch (e) {
            // If JSON parsing fails, try text
            try {
                errorMessage = await response.text();
            } catch (e2) {
                errorMessage = "";
            }
        }
        
        // If no message was extracted, use default messages based on status code
        if (!errorMessage || errorMessage.trim() === "") {
            switch (response.status) {
                case 400:
                    errorMessage = "Certifique-se de que os campos estão preenchidos apenas com dados válidos.";
                    break;
                case 401:
                    errorMessage = "Dados de autenticação inválidos.";
                    break;
                case 403:
                    errorMessage = "Dados MFA incorretos. Por favor, tente novamente.";
                    break;
                case 409:
                    errorMessage = "Este nome de utilizador já está em uso. Por favor, escolhe outro nome de utilizador.";
                    break;
                default:
                    errorMessage = "Erro inesperado. Por favor, tente novamente.";
            }
        }
        
        alert(errorMessage);
        console.log(`Error ${response.status}:`, errorMessage);
        
    } catch (exception) {
        console.error("Registration error:", exception);
        alert("Erro ao registar. Por favor, tente novamente.");
        setError(`Registration Failed: ${exception}`);
    } finally {
        setLoading(false);
    }
};

    return (
        <>
            <GetHeader />
            {loading && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", color: "#fff" }}>
                    Loading ...
                </div>
            )}

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
                            <label className="form-label">Nome de Utilizador (Mínimo de 8 caracteres, sem espaços)</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Edwin" 
                                name="username" 
                                value={userRegistrationForm.username} 
                                minLength={8} 
                                maxLength={50} 
                                onChange={handleInputChange} 
                                required 
                            />
                            {userRegistrationForm.username && userRegistrationForm.username.includes(' ') && (
                                <div className="text-danger small mt-1">O nome de utilizador não pode conter espaços</div>
                            )}
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                placeholder="joao@exemplo.com" 
                                name="email" 
                                value={userRegistrationForm.email} 
                                onChange={handleInputChange} 
                                required 
                            />
                            {userRegistrationForm.email && !isValidEmail(userRegistrationForm.email) && (
                                <div className="text-danger small mt-1">Por favor, insira um endereço de email válido</div>
                            )}
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Palavra-passe (Mínimo de 8 caracteres)</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                name="password" 
                                placeholder="••••••••" 
                                value={userRegistrationForm.password} 
                                minLength={8} 
                                maxLength={50} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="form-label">Confirmar Palavra-passe</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                name="confirmPassword" 
                                placeholder="••••••••" 
                                value={confirmPassword} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        
                        {confirmPassword && userRegistrationForm.password !== confirmPassword && (
                            <div className="text-danger small mt-1">As palavras-passe não coincidem</div>
                        )}
                        
                        <button 
                            type="submit" 
                            className="btn btn-dark w-100 py-2 text-uppercase fw-bold" 
                            style={{ borderRadius: '0' }} 
                            onClick={() => sendMfACode()}
                        >
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
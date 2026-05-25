import { createContext, useState, useContext, useEffect,useRef, ReactNode} from "react"
import { refreshToken, logoutEntity, fetchAPIWithCredentials, loginUser} from "./requests";


type Entity = "user" | "staff" | "employer" | "admin" | null

interface AuthenticationContextModel {
    isLoading: boolean;
    isEntityLoggedIn: boolean;
    entityType: Entity
    login: (currentEntity: Entity) => Promise<void>;
    logoutHandler: () => Promise<void>;
}

const AuthenticationContext  = createContext<AuthenticationContextModel| undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [entity, setEntity]       = useState<Entity>(null);

  const login = async (currentEntity: Entity) => {
    if(currentEntity) localStorage.setItem("active_role", currentEntity)
    setEntity(currentEntity);
  };

  const logoutHandler = async () => {
    if(entity){
        try{
            await logoutEntity(entity); // Spring Boot clears the cookie
            localStorage.removeItem("active_role")
        }catch(error){
            console.log("Logout Error")
        }finally{setEntity(null); localStorage.removeItem("active_role")}
          
    }
  };


  useEffect(() => {
    async function checkSession() {
        const savedRole = localStorage.getItem("active_role") as Entity;
        if(!savedRole){
         setIsLoading(false);
         return;   
        }
   
      try {
        const response = await fetchAPIWithCredentials(`/api/v1/${savedRole}/get/my-profile`);
        if (response.ok) {
            setEntity(savedRole)
        }
        } catch (error) {
            localStorage.removeItem("`active_role`")
            setEntity(null);
        } finally {
            setIsLoading(false);
        }
        
        }
    checkSession();
  }, []);

      console.log(`Entity in localstorage: ${localStorage.getItem("active_role")}`)
    console.log(`Entity in entity foield: ${entity}`)
  return (
    <AuthenticationContext.Provider
      value={{ isEntityLoggedIn: !!entity, entityType: entity, isLoading, login, logoutHandler }}
    >
      {! isLoading ? children: <div className="spinner-border"></div>}
    </AuthenticationContext.Provider>
  );
}

export function useUserAuthManager() {
    const context = useContext(AuthenticationContext);

    if(context === undefined){
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context;
}


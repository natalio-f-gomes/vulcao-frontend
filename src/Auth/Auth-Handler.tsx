import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { getProfile, logoutEntity } from "../Requests/global";
import { useNavigate } from "react-router-dom";

type Entity = "CLIENT" | "STAFF" | "EMPLOYER" | null;

interface AuthenticationContextModel {
  isLoading: boolean;
  isEntityLoggedIn: boolean;
  entityType: Entity;
  login: (currentEntity: Entity) => Promise<void>;
  logoutHandler: () => Promise<void>;
}

const AuthenticationContext = createContext<
  AuthenticationContextModel | undefined
>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  useEffect(() => {
    console.log("AuthProvider MOUNTED");
    return () => console.log("AuthProvider UNMOUNTED");
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [entity, setEntity] = useState<Entity>(null);

  const login = async (currentEntity: Entity) => {
    if (currentEntity) localStorage.setItem("active_role", currentEntity);
    setEntity(currentEntity);
  };

  const logoutHandler = async () => {
    if (entity) {
      try {
        const response = await logoutEntity(entity); // Spring Boot clears the cookie
        if (
          response.status === 200 ||
          (response.status >= 400 && response.status < 500)
        ) {
          alert(await response.text());
        }
        localStorage.removeItem("active_role");
        navigate("/");
      } catch (error) {
        console.log("Logout Error");
      } finally {
        setEntity(null);
        localStorage.removeItem("active_role");
      }
    }
  };

  useEffect(() => {
    async function checkSession() {
      const savedRole = localStorage.getItem("active_role") as Entity;
      if (!savedRole) {
        setIsLoading(false);
        return;
      } else {
        // stale role/cookie — clean up so the app lands in a definite logged-out state
        localStorage.removeItem("active_role");
        setEntity(null);
      }

      try {
        const response = await getProfile(savedRole);
        console.log(response);
        console.log("ROLE ", savedRole);
        if (response.ok) {
          setEntity(savedRole);
        }
      } catch (error) {
        localStorage.removeItem("active_role");
        setEntity(null);
      } finally {
        setIsLoading(false);
      }
    }
    checkSession();
  }, []);

  console.log(`Entity in localstorage: ${localStorage.getItem("active_role")}`);
  console.log(`Entity in entity field: ${entity}`);
  return (
    <AuthenticationContext.Provider
      value={{
        isEntityLoggedIn: !!entity,
        entityType: entity,
        isLoading,
        login,
        logoutHandler,
      }}
    >
      {!isLoading ? children : <div className="spinner-border"></div>}
    </AuthenticationContext.Provider>
  );
}

export function useUserAuthManager() {
  const context = useContext(AuthenticationContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

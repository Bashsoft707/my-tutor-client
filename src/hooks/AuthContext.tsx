import {
  useMemo,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  createContext,
  useContext,
} from "react";
// import {
//   TUser,
//   TLoginResponse,
//   setTokenHeader,
//   useLoginUserMutation,
//   useLogoutUserMutation,
//   useGetUserQuery,
//   useRefreshTokenMutation,
//   TLoginUser,
// } from "librechat-data-provider";
// import { TAuthConfig, TUserContext, TAuthContext, TResError } from "~/common";
import { useNavigate } from "react-router-dom";
import useTimeout from "./useTimeout";
import axios from "axios";
import { baseUrl } from "../constants/baseUrl";

const AuthContext = createContext<any | undefined>(undefined);

const AuthContextProvider = ({
  authConfig,
  children,
}: {
  authConfig?: any;
  children: ReactNode;
}) => {
  const [user, setUser] = useState<any | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const navigate = useNavigate();

  //   const loginUser = useLoginUserMutation();
  //   const logoutUser = useLogoutUserMutation();
  //   const userQuery = useGetUserQuery({ enabled: !!token });
  //   const refreshToken = useRefreshTokenMutation();

  const doSetError = useTimeout({
    callback: (error: any) => setError(error as string | undefined),
  });

  const setUserContext = useCallback(
    (userContext: any) => {
      const { token, isAuthenticated, user, redirect } = userContext;
      if (user) {
        setUser(user);
      }
      setToken(token);
      //@ts-ignore - ok for token to be undefined initially
      setTokenHeader(token);
      setIsAuthenticated(isAuthenticated);
      if (redirect) {
        navigate(redirect, { replace: true });
      }
    },
    [navigate]
  );

  const login = async (data: any) => {
    const navigate = useNavigate();

    try {
      const { email, password } = data;
      const response = await axios.post(`${baseUrl}/login`, {
        email,
        password,
      });

      const { token, user } = response.data.data;

      setUserContext({
        token,
        isAuthenticated: true,
        user,
        redirect: "/c/new",
      });

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      const resError = error as any;
      doSetError(resError.message);

      // Navigate to the login page ("/login") in case of an error
      navigate("/login", { replace: true });
    }
  };

  const logout = useCallback(() => {
    try {
      // Clear user context
      setUserContext({
        token: undefined,
        isAuthenticated: false,
        user: undefined,
        redirect: "/login",
      });

      // Clear any existing error
      doSetError("");
    } catch (error) {
      // Handle any logout error
      console.error("Logout error:", error);
    }
  }, [setUserContext, doSetError]);

  // const silentRefresh = useCallback(() => {
  //   if (authConfig?.test) {
  //     console.log("Test mode. Skipping silent refresh.");
  //     return;
  //   }
  //   refreshToken.mutate(undefined, {
  //     onSuccess: (data: TLoginResponse) => {
  //       const { user, token } = data;
  //       if (token) {
  //         setUserContext({ token, isAuthenticated: true, user });
  //       } else {
  //         console.log("Token is not present. User is not authenticated.");
  //         if (authConfig?.test) {
  //           return;
  //         }
  //         navigate("/login");
  //       }
  //     },
  //     onError: (error) => {
  //       console.log("refreshToken mutation error:", error);
  //       if (authConfig?.test) {
  //         return;
  //       }
  //       navigate("/login");
  //     },
  //   });
  // }, []);

  // useEffect(() => {
  //   if (userQuery.data) {
  //     setUser(userQuery.data);
  //   } else if (userQuery.isError) {
  //     doSetError((userQuery?.error as Error).message);
  //     navigate("/login", { replace: true });
  //   }
  //   if (error && isAuthenticated) {
  //     doSetError(undefined);
  //   }
  //   if (!token || !isAuthenticated) {
  //     silentRefresh();
  //   }
  // }, [
  //   token,
  //   isAuthenticated,
  //   userQuery.data,
  //   userQuery.isError,
  //   userQuery.error,
  //   error,
  //   navigate,
  //   setUserContext,
  // ]);

  useEffect(() => {
    const handleTokenUpdate = (event: any) => {
      console.log("tokenUpdated event received event");
      const newToken = event.detail;
      setUserContext({
        token: newToken,
        isAuthenticated: true,
        user: user,
      });
    };

    window.addEventListener("tokenUpdated", handleTokenUpdate);

    return () => {
      window.removeEventListener("tokenUpdated", handleTokenUpdate);
    };
  }, [setUserContext, user]);

  // Make the provider update only when it should
  const memoedValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      error,
      login,
      logout,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, error, isAuthenticated, token]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext should be used inside AuthProvider");
  }

  return context;
};

export { AuthContextProvider, useAuthContext };

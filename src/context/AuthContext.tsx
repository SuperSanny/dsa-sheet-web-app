"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types";

type State = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
};

type Action =
  | { type: "INIT"; user: User; token: string }
  | { type: "LOGIN"; user: User; token: string }
  | { type: "LOGOUT" }
  | { type: "DONE_LOADING" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INIT":
    case "LOGIN":
      return { user: action.user, token: action.token, isLoading: false };
    case "LOGOUT":
      return { user: null, token: null, isLoading: false };
    case "DONE_LOADING":
      return { ...state, isLoading: false };
    default:
      return state;
  }
}

interface AuthContextType extends State {
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const raw = localStorage.getItem("user");

    if (token && raw) {
      try {
        const user = JSON.parse(raw) as User;
        dispatch({ type: "INIT", user, token });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "DONE_LOADING" });
      }
    } else {
      dispatch({ type: "DONE_LOADING" });
    }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "LOGIN", user, token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

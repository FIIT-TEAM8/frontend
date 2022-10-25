import { createContext, useContext } from "react";
import { User } from "./Interfaces";

// Terrible... require FIX
const initialUserState: User = {
  username: {},
  articlesInReport: [],
  reportId: 0,
  user: undefined,
  id: "",
};

export const UserContext = createContext(initialUserState);

export const useUser = () => useContext(UserContext);

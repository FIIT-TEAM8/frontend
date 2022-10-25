import { Stack, Button } from "@mui/material";
import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import { useUser } from "../Utils/UserContext";

export default function MainBar() {
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenSignup, setIsOpenSignup] = useState(false);
  const { user, logout } = useUser();

  const onLoginOpen = () => {
    setIsOpenSignup(false);
    setIsOpenLogin(true);
  };

  const onLoginClose = () => {
    setIsOpenLogin(false);
  };

  const onLogout = () => {
    logout();
  };

  const onSignupOpen = () => {
    setIsOpenLogin(false);
    setIsOpenSignup(true);
  };

  const onSignupClose = () => {
    setIsOpenSignup(false);
  };

  return (
    <div>
      <Stack
        direction="row"
        alignItems="flex-end"
        justifyContent="flex-end"
        spacing={0.5}
        m={2}
      >
        {user ? (
          <Button color="primary" variant="outlined" onClick={onLogout}>
            Log out
          </Button>
        ) : (
          <>
            <Button color="primary" variant="contained" onClick={onLoginOpen}>
              Log in
            </Button>
            <Button color="primary" variant="outlined" onClick={onSignupOpen}>
              Sign up
            </Button>
          </>
        )}
      </Stack>

      <Login
        isOpen={isOpenLogin}
        onClose={onLoginClose}
        onSignupOpen={onSignupOpen}
      />
      <Signup
        isOpen={isOpenSignup}
        onClose={onSignupClose}
        onLoginOpen={onLoginOpen}
      />
    </div>
  );
}

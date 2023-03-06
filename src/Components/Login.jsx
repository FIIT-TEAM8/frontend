import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  TextField,
  Stack,
  IconButton,
  InputAdornment
} from "@mui/material";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { initialLoginValues, loginValidationSchema } from "../Utils/AccountSchemas";
import { useUser } from "../Utils/UserContext";
import HomeLink from "./HomeLink";

export default function Login({ isOpen, onClose = () => {}, onSignupOpen = () => {} }) {
  // diplayed password means showing the plain text of entered string
  const [displayedPassword, setDisplayedPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password"); // set to hide the plain text of entered password
  // handling visibility of the login dialog
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  // show/hide incorrect credentials error message
  const [incorrectCredentials, setIncorrectCredentials] = useState(false);
  const { login } = useUser();

  const formikLogin = useFormik({
    initialValues: initialLoginValues,
    validationSchema: loginValidationSchema,

    // method to handle login form submit
    onSubmit: async (loginData) => {
      // give values to UserProvider, if the values are correct,
      // call the parent method to close login dialog
      const isLogged = await login(loginData);
      if (isLogged) {
        onClose();
      } else {
        setIncorrectCredentials(true);
      }
    }
  });

  // method to handle click on the visibility icon
  const onVisibilityClick = () => {
    if (displayedPassword) {
      // if the password is displayed, hiding it by updating states
      setDisplayedPassword(false);
      setPasswordType("password");
    } else {
      // the opposite case
      setDisplayedPassword(true);
      setPasswordType("text");
    }
  };

  // parent component is handling the open and close state
  useEffect(() => {
    setIsOpenDialog(isOpen);

    // set initial values before next open of the dialog
    if (!isOpen) {
      formikLogin.values.username = initialLoginValues.username;
      formikLogin.values.password = initialLoginValues.password;
    }
  }, [isOpen]);

  // if the content of textfield changes, error message is hidden and formik handles validation
  const onFieldChange = (e) => {
    setIncorrectCredentials(false);
    formikLogin.handleChange(e);
  };

  return (
    <Dialog open={isOpenDialog} onClose={onClose}>
      <DialogContent sx={{ m: "auto", width: 250 }}>
        <form onSubmit={formikLogin.handleSubmit}>
          <Stack sx={{ mb: 1 }} spacing={1}>
            <HomeLink variant="p" />
            <Typography variant="h2">Log in</Typography>
          </Stack>
          <Stack spacing={3} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              id="username"
              name="username"
              label="Username"
              value={formikLogin.values.username}
              onChange={onFieldChange}
              error={formikLogin.touched.username && Boolean(formikLogin.errors.username)}
              helperText={formikLogin.touched.username && formikLogin.errors.username}
              margin="dense"
              variant="standard"
              color="secondary"
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type={passwordType}
              value={formikLogin.values.password}
              onChange={onFieldChange}
              error={formikLogin.touched.password && Boolean(formikLogin.errors.password)}
              helperText={formikLogin.touched.password && formikLogin.errors.password}
              margin="dense"
              variant="standard"
              color="secondary"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton sx={{ mb: 2 }} onClick={onVisibilityClick}>
                      {displayedPassword ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined fontSize="inherit" />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {incorrectCredentials && (
              <Typography color="error">The username or password is incorrect.</Typography>
            )}

            <Stack spacing={2}>
              <Button color="primary" variant="contained" fullWidth type="submit">
                Log in
              </Button>
              <Typography variant="caption" align="center" color="secondary">
                OR
              </Typography>
              <Button color="primary" variant="outlined" fullWidth onClick={onSignupOpen}>
                Sign up
              </Button>
            </Stack>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}

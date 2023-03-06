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
import { initialSignupValues, signupValidationSchema } from "../Utils/AccountSchemas";
import { useUser } from "../Utils/UserContext";
import HomeLink from "./HomeLink";

export default function Signup({ isOpen, onClose, onLoginOpen }) {
  // diplayed password means showing the plain text of entered string
  const [displayedPassword, setDisplayedPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password"); // set to hide the plain text of entered password
  // handling visibility of the signup dialog
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  // show/hide "taken username" error message
  const [takenUsername, setTakenUsername] = useState(false);
  const { signup } = useUser();

  const formikLogin = useFormik({
    initialValues: initialSignupValues,
    validationSchema: signupValidationSchema,

    // method to handle signup form submit
    onSubmit: async (signupData) => {
      // give values to UserProvider, if the values are correct,
      // call the parent method to close signup dialog
      const isSignedup = await signup(signupData);
      if (isSignedup) {
        onClose();
      } else {
        setTakenUsername(true);
      }
    }
  });

  // method to handle click on the visibility icon
  const onVisibilityClick = () => {
    // if the password is displayed, hiding it by updating states
    if (displayedPassword) {
      setDisplayedPassword(false);
      setPasswordType("password");
    } else {
      setDisplayedPassword(true);
      setPasswordType("text");
    }
  };

  // parent component is handling the open and close state
  useEffect(() => {
    setIsOpenDialog(isOpen);

    // set initial values before next open of the dialog
    if (!isOpen) {
      formikLogin.values.username = initialSignupValues.username;
      formikLogin.values.password = initialSignupValues.password;
    }
  }, [isOpen]);

  // if the content of textfield changes, error message is hidden and formik handles validation
  const onFieldChange = (e) => {
    setTakenUsername(false);
    formikLogin.handleChange(e);
  };

  return (
    <Dialog open={isOpenDialog} onClose={onClose}>
      <DialogContent sx={{ m: "auto", width: 250 }}>
        <form onSubmit={formikLogin.handleSubmit}>
          <Stack sx={{ mb: 1 }} spacing={1}>
            <HomeLink variant="p" />
            <Typography variant="h2">Sign up</Typography>
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

            {takenUsername && <Typography color="error">The username already exists.</Typography>}

            <Stack spacing={2}>
              <Button color="primary" variant="contained" fullWidth type="submit">
                Sign up
              </Button>
              <Typography variant="caption" align="center" color="secondary">
                OR
              </Typography>
              <Button color="primary" variant="outlined" fullWidth onClick={onLoginOpen}>
                Log in
              </Button>
            </Stack>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}

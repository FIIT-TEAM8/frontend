import * as yup from "yup";

export const initialLoginValues = {
  username: "",
  password: "",
};

export const initialSignupValues = {
  // TODO add more fields to sign up process
  username: "",
  password: "",
};

export const loginValidationSchema = yup.object({
  username: yup.string("Enter your username").required("Username is required"),
  password: yup.string("Enter your password").required("Password is required"),
});

export const signupValidationSchema = yup.object({
  username: yup.string("Enter your username").required("Username is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password is too short")
    // .matches(/[a-z][A-Z][0-9]/, 'Password has to contain lower and upper case and number.')
    .required("Password is required"),
});

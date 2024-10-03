"use server";
import { signupSchema } from "./schemas/SignUpSchema";
import { ApiResponse, SignUpFormState } from "./types/utils";
import axios, { AxiosError } from "axios";
// import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url";
// import { headers } from "next/headers";

export const onSignUpSubmit = async (
  prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> => {
  // console.log(formData);

  const signUpData = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  // console.log(signUpData);

  const parse = signupSchema.safeParse(signUpData);

  if (!parse.success) {
    return {
      errors: {
        ...parse.error.formErrors.fieldErrors,
      },
    };
  }

  if (signUpData.password !== signUpData.confirmPassword) {
    return {
      errors: {
        confirmPassword: ["Passwords do not match"],
      },
    };
  }

  // create user
  // TODO : Email verification

  try {
    const response = await axios.post<ApiResponse>(
      "http://localhost:3000/api/sign-up",
      signUpData
    );
    // console.log(response);

    if (response.data.success) {
      return {
        errors: {},
        message: response.data.message,
        success: true,
      };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    // console.log(axiosError);

    return {
      errors: {},
      message: `Error: ${axiosError.response?.data?.message}`,
      success: false,
    };
  }

  return {
    errors: {},
  };
};

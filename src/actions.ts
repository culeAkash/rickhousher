"use server";

import * as zod from "zod";
import { z } from "zod";
import { signupSchema } from "./schemas/SignUpSchema";
import { ApiResponse, FormState } from "./utils/types";
import axios, { AxiosError } from "axios";

export const onSignUpSubmit = async (
  prevState,
  formData
): Promise<FormState> => {
  console.log(formData);

  const signUpData = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  console.log(signUpData);

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
    console.log(response);

    if (response.data.success) {
      return {
        errors: {},
        message: response.data.message,
        success: true,
      };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(axiosError);

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

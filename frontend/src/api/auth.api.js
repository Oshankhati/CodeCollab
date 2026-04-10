// import axios from "axios";
// import { BASE_URL } from "./base";

// export const registerUser = (data) => {
//   return axios.post(`${BASE_URL}/api/auth/register`, data);
// };

// export const loginUser = (data) => {
//   return axios.post(`${BASE_URL}/api/auth/login`, data);
// };


import axios from "axios";
import { BASE_URL } from "./base";

/* REGISTER */
export const registerUser = (data) => {
  return axios.post(`${BASE_URL}/api/auth/register`, data);
};

/* LOGIN */
export const loginUser = (data) => {
  return axios.post(`${BASE_URL}/api/auth/login`, data);
};

/* FORGOT PASSWORD */
export const forgotPassword = (data) => {
  return axios.post(`${BASE_URL}/api/auth/forgot-password`, data);
};

export const resetPassword = (token, data) => {
  return axios.post(`${BASE_URL}/api/auth/reset-password/${token}`, data);
};
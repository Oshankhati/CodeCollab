import axios from "axios";
import { BASE_URL } from "./base";

export const registerUser = (data) => {
  return axios.post(`${BASE_URL}/api/auth/register`, data);
};

export const loginUser = (data) => {
  return axios.post(`${BASE_URL}/api/auth/login`, data);
};

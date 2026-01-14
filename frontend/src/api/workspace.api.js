import axios from "axios";
import { BASE_URL } from "./base";

export const createWorkspace = (data, token) => {
  return axios.post(`${BASE_URL}/api/workspaces`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getMyWorkspaces = (token) => {
  return axios.get(`${BASE_URL}/api/workspaces/my`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const inviteUser = (id, data, token) => {
  return axios.post(`${BASE_URL}/api/workspaces/${id}/invite`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

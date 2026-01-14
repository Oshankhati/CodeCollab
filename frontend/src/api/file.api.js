import axios from "axios";
import { BASE_URL } from "./base";

export const createFile = (data, token) => {
  return axios.post(`${BASE_URL}/api/files`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getFiles = (workspaceId, token) => {
  return axios.get(`${BASE_URL}/api/files/workspace/${workspaceId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getFile = (id, token) => {
  return axios.get(`${BASE_URL}/api/files/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateFile = (id, data, token) => {
  return axios.put(`${BASE_URL}/api/files/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

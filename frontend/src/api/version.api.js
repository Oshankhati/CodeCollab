import axios from "axios";
import { BASE_URL } from "./base";

export const createVersion = (data, token) =>
  axios.post(`${BASE_URL}/api/versions`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getVersions = (fileId, token) =>
  axios.get(`${BASE_URL}/api/versions/${fileId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const restoreVersion = (versionId, token) =>
  axios.post(`${BASE_URL}/api/versions/restore/${versionId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

import axios from "axios";
import { BASE_URL } from "./base";

export const uploadZip = (workspaceId, file, token) => {
  const form = new FormData();
  form.append("zip", file);

  return axios.post(
    `${BASE_URL}/api/upload/zip/${workspaceId}`,
    form,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        // ❗ DO NOT set Content-Type manually
      },
    }
  );
};

export const downloadZip = (workspaceId, token) =>
  axios.get(`${BASE_URL}/api/files/zip/${workspaceId}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

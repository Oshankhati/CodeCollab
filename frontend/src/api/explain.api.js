import axios from "axios";
import { BASE_URL } from "./base";

export const explainProject = (workspaceId, token) => {
  return axios.post(
    `${BASE_URL}/api/explain`,
    { workspaceId },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

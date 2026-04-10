import axios from "axios";
import { BASE_URL } from "./base";

export const getHeatmap = (workspaceId, token) => {
  return axios.get(`${BASE_URL}/api/analytics/heatmap/${workspaceId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
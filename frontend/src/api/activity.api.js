import axios from "axios";
import {BASE_URL} from "./base";

export const getActivity = (workspaceId,token)=>{
 return axios.get(`${BASE_URL}/api/activity/${workspaceId}`,{
  headers:{Authorization:`Bearer ${token}`}
 });
};

export const clearActivity = (workspaceId, token) => {
  return axios.delete(`${BASE_URL}/api/activity/${workspaceId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getRecentActivity = (token) => {
  return axios.get(`${BASE_URL}/api/activity/recent`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
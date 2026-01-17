import axios from "axios";
import { BASE_URL } from "./base";

/* Get my workspaces */
export const getMyWorkspaces = (token) =>
  axios.get(`${BASE_URL}/api/workspaces/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });

/* Create workspace */
export const createWorkspace = (data, token) =>
  axios.post(`${BASE_URL}/api/workspaces`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

/* Invite user */
export const inviteUser = (workspaceId, email, token) =>
  axios.post(
    `${BASE_URL}/api/workspaces/${workspaceId}/invite`,
    { email },
    { headers: { Authorization: `Bearer ${token}` } }
  );

/* Get pending invites */
export const getInvites = (token) =>
  axios.get(`${BASE_URL}/api/workspaces/invites`, {
    headers: { Authorization: `Bearer ${token}` },
  });

/* Accept invite */
export const acceptInvite = (workspaceId, token) =>
  axios.post(
    `${BASE_URL}/api/workspaces/${workspaceId}/accept`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

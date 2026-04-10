
import axios from "axios";
import { BASE_URL } from "./base";

/* =====================================================
   COMMON AUTH HEADER
===================================================== */

const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

/* =====================================================
   FILE CRUD
===================================================== */

export const getFile = (id, token) =>
  axios.get(`${BASE_URL}/api/files/${id}`, authHeader(token));

export const updateFile = (id, data, token) =>
  axios.put(`${BASE_URL}/api/files/${id}`, data, authHeader(token));

export const deleteItem = (id, token) =>
  axios.delete(`${BASE_URL}/api/files/${id}`, authHeader(token));

export const renameItem = (id, name, token) =>
  axios.put(
    `${BASE_URL}/api/files/${id}/rename`,
    { name },
    authHeader(token)
  );

/* =====================================================
   FILE TREE
===================================================== */

export const getFileTree = (workspaceId, token) =>
  axios.get(
    `${BASE_URL}/api/files/tree/${workspaceId}`,
    authHeader(token)
  );

/* =====================================================
   CREATE FILE / FOLDER
===================================================== */

export const createFileOrFolder = (data, token) =>
  axios.post(
    `${BASE_URL}/api/files/create`,
    data,
    authHeader(token)
  );

/* =====================================================
   FILE LOCKING
===================================================== */

export const lockFile = (id, token) =>
  axios.post(
    `${BASE_URL}/api/files/${id}/lock`,
    {},
    authHeader(token)
  );

export const unlockFile = (id, token) =>
  axios.post(
    `${BASE_URL}/api/files/${id}/unlock`,
    {},
    authHeader(token)
  );

/* =====================================================
   VERSIONING
===================================================== */

export const createVersion = (data, token) =>
  axios.post(
    `${BASE_URL}/api/files/version`,
    data,
    authHeader(token)
  );

export const getVersions = (fileId, token) =>
  axios.get(
    `${BASE_URL}/api/files/version/${fileId}`,
    authHeader(token)
  );

export const restoreVersion = (versionId, token) =>
  axios.post(
    `${BASE_URL}/api/files/version/restore/${versionId}`,
    {},
    authHeader(token)
  );
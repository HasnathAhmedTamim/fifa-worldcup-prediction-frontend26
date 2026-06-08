"use client";

import { useSyncExternalStore } from "react";

export type StoredUser = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  total_points?: number;
};

export const AUTH_CHANGE_EVENT = "auth-change";

const emitAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

export const getStoredUser = (): StoredUser | null => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const getStoredToken = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("accessToken");
};

export const saveAuthStorage = (token: string, user: StoredUser) => {
  localStorage.setItem("accessToken", token);
  localStorage.setItem("user", JSON.stringify(user));

  emitAuthChange();
};

export const clearAuthStorage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");

  emitAuthChange();
};

const subscribe = (callback: () => void) => {
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};

const getSnapshot = () => {
  return JSON.stringify(getStoredUser());
};

const getServerSnapshot = () => {
  return "null";
};

export const useAuthUser = () => {
  const userString = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  try {
    return JSON.parse(userString) as StoredUser | null;
  } catch {
    return null;
  }
};

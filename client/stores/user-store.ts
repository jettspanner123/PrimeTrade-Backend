"use client";
import { create } from "zustand";
import { BASE_USER } from "../../shared/types/user/user.types";
import { persist, createJSONStorage } from "zustand/middleware";
import { BaseSyntheticEvent } from "react";

export const USER_SESSION_STORAGE_KEY: string = "USER_SESSION_STORAGE";

interface UserStore {
    user: BASE_USER | null;
    setUser: (user: BASE_USER | null) => void;
}

const userStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
        }),
        {
            name: USER_SESSION_STORAGE_KEY,
        },
    ),
);

export function useAuthUser() {
    return userStore();
}

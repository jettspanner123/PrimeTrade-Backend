import { create } from "zustand";

interface DialogStore {
    isCreateTodoModelOpen: boolean;
    setCreateTodoModelOpen: (open: boolean) => void;
}

export const dialogStore = create<DialogStore>((set) => ({
    isCreateTodoModelOpen: false,
    setCreateTodoModelOpen: (isCreateTodoModelOpen: boolean) =>
        set({ isCreateTodoModelOpen }),
}));

export function useDialogStore() {
    return dialogStore();
}

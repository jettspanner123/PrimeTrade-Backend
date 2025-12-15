import { DashboardType, DashboardTypes } from "../constants/dashboard-tasb";
import { create } from "zustand";

interface DashboardTabsStore {
    currentTab: DashboardType;
    setCurrentTab: (tab: DashboardType) => void;
}

const dashboardTabsStore = create<DashboardTabsStore>((set) => ({
    currentTab: DashboardTypes.Dashboard,
    setCurrentTab: (currentTab) => set({ currentTab }),
}));

export function useDashboardTabsStore() {
    return dashboardTabsStore();
}

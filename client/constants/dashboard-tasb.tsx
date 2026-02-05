import React from "react";
import {
    ChartAreaIcon,
    FolderClosedIcon,
    HouseIcon,
    TrashIcon,
    UserCircleIcon,
} from "lucide-react";

export const DashboardTypes = {
    Dashboard: "DASHBOARD",
    RecentlyDeleted: "RECENT_DELETED",
    Archived: "ARCHIVED",
    Statistics: "STATISTICS",
    Profile: "PROFILE",
} as const;
export type DashboardType =
    (typeof DashboardTypes)[keyof typeof DashboardTypes];

export function GetIconForTab(tab: DashboardType): React.JSX.Element {
    switch (tab) {
        case DashboardTypes.Dashboard:
            return <HouseIcon />;
        case DashboardTypes.RecentlyDeleted:
            return <TrashIcon />;
        case DashboardTypes.Archived:
            return <FolderClosedIcon />;
        case DashboardTypes.Profile:
            return <UserCircleIcon />;
        default:
            return <ChartAreaIcon />;
    }
}

import React from "react";
import {
    ChartAreaIcon,
    FolderClosedIcon,
    HouseIcon,
    TrashIcon,
} from "lucide-react";

export const DashboardTypes = {
    Dashboard: "DASHBOARD",
    RecentlyDeleted: "RECENT_DELETED",
    Archived: "ARCHIVED",
    Statistics: "STATISTICS",
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
        default:
            return <ChartAreaIcon />;
    }
}

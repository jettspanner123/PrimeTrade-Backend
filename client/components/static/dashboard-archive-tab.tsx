import { TASKS_RESPONSE } from "../../../shared/types/task/task.types";
import { BASE_USER } from "../../../shared/types/user/user.types";
import React from "react";
import Dashboard_TaskItemSkeleton from "@/components/static/dashboard-task-loading-skeleton";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { FolderClosedIcon } from "lucide-react";
import Dashboard_TaskItem from "@/components/static/dashboard-task-item";

interface DashboardArchivedTaskContentProps {
    isTasksLoading: boolean;
    taskData: TASKS_RESPONSE | null;
    user: BASE_USER;
}

export default function Dashboard_ArchivedContent({
    isTasksLoading,
    taskData,
    user,
}: DashboardArchivedTaskContentProps): React.ReactElement {
    return (
        <div>
            {isTasksLoading ? (
                <div className={"w-full grid grid-cols-3 gap-4"}>
                    <Dashboard_TaskItemSkeleton />
                </div>
            ) : taskData?.tasks?.length === 0 ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia>
                            <FolderClosedIcon />
                        </EmptyMedia>
                        <EmptyTitle>No Archived Tasks!</EmptyTitle>
                        <EmptyDescription>
                            Archived tasks will appear here once you mark them
                            as archived.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className={"w-full grid grid-cols-3 gap-4"}>
                    {taskData!.tasks!.map((task, index) => {
                        return (
                            <Dashboard_TaskItem
                                key={index}
                                task={task}
                                user={user}
                                index={index}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

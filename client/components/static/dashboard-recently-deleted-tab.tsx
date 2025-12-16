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
import { TrashIcon } from "lucide-react";
import Dashboard_RecentlyDeletedTaskItem from "@/components/static/dashboard-recently-deleted-task-item";
import { motion } from "framer-motion";

interface DashboardRecentlyDeletedTaskContentProps {
    isTasksLoading: boolean;
    taskData: TASKS_RESPONSE | null;
    user: BASE_USER;
}

export default function Dashboard_RecentlyDeletedContent({
    isTasksLoading,
    taskData,
    user,
}: DashboardRecentlyDeletedTaskContentProps): React.ReactElement {
    return (
        <div>
            {isTasksLoading ? (
                <div className={"w-full grid grid-cols-2 md:grid-cols-3 gap-4"}>
                    <Dashboard_TaskItemSkeleton />
                </div>
            ) : taskData?.tasks?.length === 0 ? (
                <motion.div
                    animate={{
                        opacity: 1,
                        filter: "blur(0px)",
                    }}
                    initial={{
                        opacity: 0,
                        filter: "blur(10px)",
                    }}
                >
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia>
                                <TrashIcon />
                            </EmptyMedia>
                            <EmptyTitle>No Recently Deleted Tasks!</EmptyTitle>
                            <EmptyDescription>
                                You haven&apos;t deleted any tasks yet. Once a
                                task is deleted it will show here.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                </motion.div>
            ) : (
                <div className={"w-full grid grid-cols-2 md:grid-cols-3 gap-4"}>
                    {taskData!.tasks!.map((task, index) => {
                        return (
                            <Dashboard_RecentlyDeletedTaskItem
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

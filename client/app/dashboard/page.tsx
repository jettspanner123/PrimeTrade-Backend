"use client";
import React from "react";
import SessionTimedOutCard from "@/components/shared/session-timed-out-card";
import Dashboard_CreateTodoDialog from "@/components/static/dashboard-create-todo-dialog";
import { useAuthUser } from "@/stores/user-store";
import { Toaster } from "sonner";
import { Card } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import APIService from "@/lib/api/api.service";
import CachingKeys from "@/constants/caching-keys";
import { BASE_USER } from "../../../shared/types/user/user.types";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
    BarChart2Icon,
    ClipboardPlusIcon,
} from "lucide-react";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { useDialogStore } from "@/stores/dialog-store";
import Dashboard_TaskItemSkeleton from "@/components/static/dashboard-task-loading-skeleton";
import Dashboard_TaskItem from "@/components/static/dashboard-task-item";
import { useDashboardTabsStore } from "@/stores/dashboard-tabs";
import {
    BASE_TASK,
    TASKS_RESPONSE,
    TASK_STATS_RESPONSE,
} from "../../../shared/types/task/task.types";
import { DashboardTypes, GetIconForTab } from "@/constants/dashboard-tasb";
import { motion } from "framer-motion";
import Dashboard_ArchivedContent from "@/components/static/dashboard-archive-tab";
import Dashboard_RecentlyDeletedContent from "@/components/static/dashboard-recently-deleted-tab";

export default function DashboardPage(): React.JSX.Element {
    const { user, setUser } = useAuthUser();

    const [hasMounted, setHasMounted] = React.useState<boolean>(false);
    React.useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return (
            <main className="w-screen h-screen flex justify-center items-start !py-[4rem]">
                <Spinner className={"size-10"} />
            </main>
        );
    }

    if (!user) {
        return (
            <main className="w-screen h-screen flex justify-center items-center">
                <SessionTimedOutCard />
            </main>
        );
    }

    return <DashboardContent user={user} setUser={setUser} />;
}

interface DashboardContentProps {
    user: BASE_USER;
    setUser: (user: BASE_USER | null) => void;
}

function DashboardContent({
    user,
    setUser,
}: DashboardContentProps): React.JSX.Element {
    const { data: taskData, isPending: isTasksLoading } = useQuery({
        queryFn: () => APIService.fetchTasks(user.id),
        queryKey: [CachingKeys.TASK_KEY, user.id],
        enabled: !!user,
    });

    const { data: deletedTaskData, isPending: isDeletedTaskLoading } = useQuery(
        {
            queryFn: () => APIService.getDeletedTasks(user.id),
            queryKey: [CachingKeys.DELETED_TASK_KEY, user.id],
        },
    );

    const { data: archivedTaskData, isPending: isArchivedTaskLoading } =
        useQuery({
            queryFn: () => APIService.getArchivedTasks(user.id),
            queryKey: [CachingKeys.ARCHIVED_TASK_KEY, user.id],
            enabled: !!user,
        });

    const { data: taskStatsData, isPending: isTaskStatsLoading } = useQuery({
        queryFn: () => APIService.getTaskStats(user.id),
        queryKey: [CachingKeys.TASK_STATS_KEY, user.id],
        enabled: !!user,
    });

    const { currentTab, setCurrentTab } = useDashboardTabsStore();

    return (
        <React.Fragment>
            <Toaster position="bottom-center" />
            <main className="flex flex-col items-center md:!py-[2rem] !p-4">
                <Dashboard_CreateTodoDialog user={user} setUser={setUser} />

                {/* // Main dashboard content */}
                <div className="md:flex gap-4 w-full max-w-[1200px] min-h-[500px] !mt-4">


                    {/*Sidebar*/}
                    <Card className="flex-1 !px-4 py-4 md:py-6 !mb-4 md:!mb-0">
                        <div className={"w-full flex md:flex-col gap-6"}>
                            {Object.values(DashboardTypes).map(
                                (type, index) => {
                                    const TabIcon = GetIconForTab(type);
                                    return (
                                        <Button
                                            className={
                                                "flex justify-center md:justify-start items-center flex-1 "
                                            }
                                            onClick={() => {
                                                setCurrentTab(type);
                                            }}
                                            variant={
                                                currentTab === type
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            key={`sidebar-tab-${type}`}
                                        >
                                            {TabIcon}
                                            <span className={"md:block hidden"}>
                                                {type}
                                            </span>
                                        </Button>
                                    );
                                },
                            )}
                        </div>
                    </Card>

                    {/*Displayed Content*/}

                    <Card className="flex-[5] !px-6">
                        {currentTab === DashboardTypes.Dashboard ? (
                            <Dashboard_HomeContent
                                isTasksLoading={isTasksLoading}
                                user={user}
                                taskData={taskData!}
                            />
                        ) : currentTab === DashboardTypes.RecentlyDeleted ? (
                            <Dashboard_RecentlyDeletedContent
                                isTasksLoading={isDeletedTaskLoading}
                                taskData={deletedTaskData!}
                                user={user}
                            />
                        ) : currentTab === DashboardTypes.Archived ? (
                            <Dashboard_ArchivedContent
                                isTasksLoading={isArchivedTaskLoading}
                                taskData={archivedTaskData!}
                                user={user}
                            />
                        ) : (
                            <Dashboard_StatisticsContent
                                isStatsLoading={isTaskStatsLoading}
                                statsData={taskStatsData ?? null}
                            />
                        )}
                    </Card>
                </div>
            </main>
        </React.Fragment>
    );
}

interface DashboardHomeContentProps {
    isTasksLoading: boolean;
    taskData: TASKS_RESPONSE | null;
    user: BASE_USER;
}

function Dashboard_HomeContent({
    isTasksLoading,
    taskData,
    user,
}: DashboardHomeContentProps): React.JSX.Element {
    const { setCreateTodoModelOpen } = useDialogStore();
    return (
        <div>
            {isTasksLoading ? (
                <div className={"w-full grid grid-cols-2 md:grid-cols-3 gap-4"}>
                    <Dashboard_TaskItemSkeleton />
                    <Dashboard_TaskItemSkeleton />
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
                                <ClipboardPlusIcon />
                            </EmptyMedia>
                            <EmptyTitle>No Tasks Yet!</EmptyTitle>
                            <EmptyDescription>
                                You haven&apos;t created any tasks yet. Get
                                started by creating your first task.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button
                                onClick={() => {
                                    setCreateTodoModelOpen(true);
                                }}
                            >
                                Create Task
                            </Button>
                        </EmptyContent>
                    </Empty>
                </motion.div>
            ) : (
                <div className={"w-full grid grid-cols-2 md:grid-cols-3 gap-4"}>
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

interface DashboardStatisticsContentProps {
    isStatsLoading: boolean;
    statsData: TASK_STATS_RESPONSE | null;
}

function Dashboard_StatisticsContent({
    isStatsLoading,
    statsData,
}: DashboardStatisticsContentProps): React.JSX.Element {
    if (isStatsLoading || !statsData) {
        return (
            <motion.div
                animate={{
                    opacity: 1,
                    filter: "blur(0px)",
                }}
                initial={{
                    opacity: 0,
                    filter: "blur(10px)",
                }}
                className="flex h-full w-full items-center justify-center"
            >
                <Spinner className="size-6" />
            </motion.div>
        );
    }

    if (!statsData.success || !statsData.stats) {
        return (
            <motion.div
                animate={{
                    opacity: 1,
                    filter: "blur(0px)",
                }}
                initial={{
                    opacity: 0,
                    filter: "blur(10px)",
                }}
                className="flex h-full w-full items-center justify-center"
            >
                <p className="text-sm text-red-500">
                    Failed to load statistics. Please try again later.
                </p>
            </motion.div>
        );
    }

    const {
        totalTasks,
        activeTasks,
        completedTasks,
        archivedTasks,
        deletedTasks,
    } = statsData.stats;

    const maxValue = Math.max(
        totalTasks,
        activeTasks,
        completedTasks,
        archivedTasks,
        deletedTasks,
        1,
    );

    const rows = [
        { label: "Active", value: activeTasks },
        { label: "Completed", value: completedTasks },
        { label: "Archived", value: archivedTasks },
        { label: "Deleted", value: deletedTasks },
    ];

    return (
        <motion.div
            animate={{
                opacity: 1,
                filter: "blur(0px)",
            }}
            initial={{
                opacity: 0,
                filter: "blur(10px)",
            }}
            className="flex h-full flex-col gap-6 py-4"
        >
            {/* Top summary cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card className="flex flex-col gap-1 px-4 py-3">
                    <span className="text-xs uppercase text-muted-foreground">
                        Total Tasks
                    </span>
                    <span className="text-2xl font-semibold">{totalTasks}</span>
                </Card>
                <Card className="flex flex-col gap-1 px-4 py-3">
                    <span className="text-xs uppercase text-muted-foreground">
                        Active
                    </span>
                    <span className="text-2xl font-semibold">
                        {activeTasks}
                    </span>
                </Card>
                <Card className="flex flex-col gap-1 px-4 py-3">
                    <span className="text-xs uppercase text-muted-foreground">
                        Completed
                    </span>
                    <span className="text-2xl font-semibold">
                        {completedTasks}
                    </span>
                </Card>
                <Card className="flex flex-col gap-1 px-4 py-3">
                    <span className="text-xs uppercase text-muted-foreground">
                        Archived
                    </span>
                    <span className="text-2xl font-semibold">
                        {archivedTasks}
                    </span>
                </Card>
            </div>

            {/* Distribution "chart" */}
            <Card className="flex flex-1 flex-col gap-4 px-4 py-3">
                <div className="flex items-center gap-2">
                    <BarChart2Icon className="size-4" />
                    <span className="text-sm font-medium">
                        Task distribution by state
                    </span>
                </div>

                <div className="flex flex-1 flex-col justify-center gap-3">
                    {rows.map((row) => {
                        const percentage = Math.round(
                            (row.value / maxValue) * 100,
                        );
                        return (
                            <div
                                key={row.label}
                                className="flex items-center gap-3"
                            >
                                <span className="w-20 text-xs text-muted-foreground">
                                    {row.label}
                                </span>
                                <div className="flex-1 rounded-full bg-muted">
                                    <div
                                        className="h-3 rounded-full bg-primary transition-all"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="w-10 text-right text-xs">
                                    {row.value}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Secondary insight card */}
            <Card className="flex flex-col gap-3 px-4 py-3">
                <span className="text-sm font-medium">
                    Productivity & cleanup insights
                </span>
                <div className="grid grid-cols-2 gap-4 md:gap-8">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase text-muted-foreground">
                            Completion rate
                        </span>
                        <span className="text-2xl font-semibold">
                            {totalTasks === 0
                                ? "0%"
                                : `${Math.round(
                                      (completedTasks / totalTasks) * 100,
                                  )}%`}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Share of all tasks that are marked completed.
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase text-muted-foreground">
                            Cleanup rate
                        </span>
                        <span className="text-2xl font-semibold">
                            {totalTasks === 0
                                ? "0%"
                                : `${Math.round(
                                      ((archivedTasks + deletedTasks) /
                                          totalTasks) *
                                          100,
                                  )}%`}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Archived or deleted tasks vs. all tasks.
                        </span>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

"use client";
import React from "react";
import SessionTimedOutCard from "@/components/shared/session-timed-out-card";
import Dashboard_CreateTodoDialog from "@/components/static/dashboard-create-todo-dialog";
import { useAuthUser } from "@/stores/user-store";
import { Toaster } from "sonner";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import APIService from "@/lib/api/api.service";
import CachingKeys from "@/constants/caching-keys";
import { BASE_USER } from "../../../shared/types/user/user.types";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ClipboardPlusIcon } from "lucide-react";
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
import { TASKS_RESPONSE } from "../../../shared/types/task/task.types";
import { DashboardTypes, GetIconForTab } from "@/constants/dashboard-tasb";

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

    const { currentTab, setCurrentTab } = useDashboardTabsStore();

    return (
        <React.Fragment>
            <Toaster position="bottom-center" />
            <main className="flex flex-col items-center !py-[2rem] ">
                <Dashboard_CreateTodoDialog user={user} setUser={setUser} />

                {/* // Main dashboard content */}
                <div className="flex gap-4 w-full max-w-[1200px] h-[500px] !mt-4">
                    {/*Sidebar*/}
                    <Card className="flex-1 !px-4">
                        {Object.values(DashboardTypes).map((type, index) => {
                            const TabIcon = GetIconForTab(type);
                            return (
                                <Button
                                    className={
                                        "flex justify-start items-center"
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
                                    {type}
                                </Button>
                            );
                        })}
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
                            <div>Recently Deleted</div>
                        ) : currentTab === DashboardTypes.Archived ? (
                            <div>Archived</div>
                        ) : (
                            <div>Statistics</div>
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
                <div className={"w-full grid grid-cols-3 gap-4"}>
                    <Dashboard_TaskItemSkeleton />
                    <Dashboard_TaskItemSkeleton />
                    <Dashboard_TaskItemSkeleton />
                </div>
            ) : taskData?.tasks?.length === 0 ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia>
                            <ClipboardPlusIcon />
                        </EmptyMedia>
                        <EmptyTitle>No Tasks Yet!</EmptyTitle>
                        <EmptyDescription>
                            You haven&apos;t created any tasks yet. Get started
                            by creating your first task.
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

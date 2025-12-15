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

    const { setCreateTodoModelOpen } = useDialogStore();

    return (
        <React.Fragment>
            <Toaster position="bottom-center" />
            <main className="flex flex-col items-center !py-[2rem] ">
                <Dashboard_CreateTodoDialog user={user} setUser={setUser} />

                {/* // Main dashboard content */}
                <div className="flex gap-4 w-full max-w-[1200px] h-[500px] !mt-4">
                    <Card className="flex-1"></Card>
                    <Card className="flex-1/2 !px-6">
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
                                        You haven&apos;t created any tasks yet.
                                        Get started by creating your first task.
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
                    </Card>
                </div>
            </main>
        </React.Fragment>
    );
}

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
import { ClipboardPlusIcon, TrashIcon } from "lucide-react";
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
} from "../../../shared/types/task/task.types";
import { DashboardTypes, GetIconForTab } from "@/constants/dashboard-tasb";
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from "@/components/ui/item";
import { motion } from "framer-motion";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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
            queryKey: [CachingKeys.DELETED_TASK_KEY],
        },
    );

    const { currentTab, setCurrentTab } = useDashboardTabsStore();

    console.log("Deleted Task", deletedTaskData);
    console.log("Normal Task", taskData);

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
                            <Dashboard_RecentlyDeleatedContent
                                isTasksLoading={isDeletedTaskLoading}
                                taskData={deletedTaskData!}
                                user={user}
                            />
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

interface DashboardRecentlyDeletedTaskContentProps {
    isTasksLoading: boolean;
    taskData: TASKS_RESPONSE | null;
    user: BASE_USER;
}

function Dashboard_RecentlyDeleatedContent({
    isTasksLoading,
    taskData,
    user,
}: DashboardRecentlyDeletedTaskContentProps): React.ReactElement {
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
                            <TrashIcon />
                        </EmptyMedia>
                        <EmptyTitle>No Recently Deleted Tasks!</EmptyTitle>
                        <EmptyDescription>
                            You haven&apos;t deleted any tasks yet. Once a task
                            is deleted it will show here.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className={"w-full grid grid-cols-3 gap-4"}>
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

interface DashboardRecentlyDeletedTaskItemProps {
    task: BASE_TASK;
    user: BASE_USER;
    index: number;
}

function Dashboard_RecentlyDeletedTaskItem({
    task,
    user,
    index,
}: DashboardRecentlyDeletedTaskItemProps): React.JSX.Element {
    const queryClient = useQueryClient();
    const restoreTaskMutation = useMutation({
        mutationFn: APIService.restoreTask,
        mutationKey: [
            CachingKeys.TASK_KEY,
            user.id,
            CachingKeys.DELETED_TASK_KEY,
        ],
        onSuccess: async (data) => {
            if (!data.success) {
                toast.error(data.message);
                return;
            }

            queryClient.setQueryData<TASKS_RESPONSE>(
                [CachingKeys.TASK_KEY, user.id],
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        tasks: old.tasks?.filter((t) => t.id !== task.id) ?? [],
                    };
                },
            );

            await queryClient.invalidateQueries({
                queryKey: [
                    user.id,
                    CachingKeys.TASK_KEY,
                ],
            });
            toast.success(data.message);
        },
    });

    function onTaskRestore() {
        restoreTaskMutation.mutate({
            taskId: task.id,
            userId: user.id,
        });
    }

    return (
        <motion.span
            animate={{
                opacity: 1,
                filter: "blur(0px)",
            }}
            initial={{
                opacity: 0,
                filter: "blur(10px)",
            }}
            exit={{
                opacity: 0,
                filter: "blur(10px)",
            }}
            transition={{
                duration: 0.3,
                delay: 0.05 * index,
            }}
            className={"min-h-[50px] flex flex-col justify-start"}
        >
            <AlertDialog>
                <Item
                    variant={"outline"}
                    className={
                        "h-full w-full cursor-pointer !p-0 flex justify-start items-start hover:dark:bg-white/10 overflow-clip hover:bg-black/5"
                    }
                >
                    <AlertDialogTrigger className={"w-full h-full"}>
                        <ItemContent className={"!p-4 h-full w-full"}>
                            <ItemTitle className={"text-left"}>
                                {task.title.length < 45
                                    ? task.title
                                    : task.title.substring(0, 15) + "..."}
                            </ItemTitle>
                            {task.description && (
                                <ItemDescription className={"!p-0 text-left"}>
                                    {task.description.length < 25
                                        ? task.description
                                        : task.description.substring(0, 25) +
                                          "..."}
                                </ItemDescription>
                            )}
                        </ItemContent>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Restore task?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This task will be restored to the main task's
                                list.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={onTaskRestore}>
                                Restore
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </Item>
            </AlertDialog>
        </motion.span>
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

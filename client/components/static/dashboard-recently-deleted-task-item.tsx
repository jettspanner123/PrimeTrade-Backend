import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIService from "@/lib/api/api.service";
import CachingKeys from "@/constants/caching-keys";
import { toast } from "sonner";
import {
    BASE_TASK,
    TASKS_RESPONSE,
} from "../../../shared/types/task/task.types";
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
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from "@/components/ui/item";
import { BASE_USER } from "../../../shared/types/user/user.types";

interface DashboardRecentlyDeletedTaskItemProps {
    task: BASE_TASK;
    user: BASE_USER;
    index: number;
}

export default function Dashboard_RecentlyDeletedTaskItem({
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
                queryKey: [user.id, CachingKeys.TASK_KEY],
            });
            await queryClient.invalidateQueries({
                queryKey: [CachingKeys.TASK_STATS_KEY, user.id],
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
                                This task will be restored to the main
                                task&#39;s list.
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

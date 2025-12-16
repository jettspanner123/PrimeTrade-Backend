import {
    BASE_TASK,
    UPDATE_TASK_DTO,
    updateTaskSchema,
} from "../../../shared/types/task/task.types";
import { BASE_USER } from "../../../shared/types/user/user.types";
import { TASKS_RESPONSE } from "../../../shared/types/task/task.types";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIService from "@/lib/api/api.service";
import { toast } from "sonner";
import CachingKeys from "@/constants/caching-keys";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TaskStatus } from "../../../server/src/db/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";

interface Dashboard_TaskItemProps {
    task: BASE_TASK;
    user: BASE_USER;
    index: number;
}

export default function Dashboard_TaskItem({
    task,
    user,
    index,
}: Dashboard_TaskItemProps): React.JSX.Element {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [selectedTaskStatus, setSelectedTaskStatus] = React.useState(
        task.status,
    );

    const queryClient = useQueryClient();
    const deleteTaskMutation = useMutation({
        mutationFn: APIService.deleteTask,
        onSuccess: async (data) => {
            if (!data.success) {
                toast.error(`Failed to delete task! ${data.message}`);
                return;
            }

            queryClient.setQueryData<TASKS_RESPONSE>(
                [CachingKeys.TASK_KEY, user.id],
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        tasks: old.tasks!.filter((t) => t.id !== task.id),
                    };
                },
            );

            await queryClient.invalidateQueries({
                queryKey: [
                    CachingKeys.TASK_KEY,
                    user.id,
                    CachingKeys.DELETED_TASK_KEY,
                ],
            });
            toast.success(data.message);
            setIsDeleteDialogOpen(false);
            setTimeout(() => {
                setIsEditDialogOpen(false);
            }, 500);
        },
    });
    const updateTaskMutation = useMutation({
        mutationFn: APIService.updateTask,
        onSuccess: async (data) => {
            if (!data.success) {
                toast.error(`Failed to update task! ${data.errors}`);
                return;
            }

            await queryClient.invalidateQueries({
                queryKey: [CachingKeys.TASK_KEY, user.id],
            });
            toast.success(data.message);
            setIsEditDialogOpen(false);
        },
    });
    const form = useForm<UPDATE_TASK_DTO>({
        resolver: zodResolver(updateTaskSchema),
        defaultValues: {
            task: {
                title: task.title,
                description: task.description ?? undefined,
            },
            taskId: task.id,
            userId: user.id,
            status: selectedTaskStatus,
        },
    });

    function onDeleteTask() {
        deleteTaskMutation.mutate({
            taskId: task.id,
            userId: user.id,
        });
    }

    function onUpdateTask(formData: UPDATE_TASK_DTO) {
        const { taskId, task: updatedTask, userId } = formData;
        updateTaskMutation.mutate({
            taskId,
            userId,
            task: updatedTask,
            status: selectedTaskStatus,
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
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <AlertDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Item
                            variant={"outline"}
                            className={
                                "h-full w-full cursor-pointer hover:dark:bg-white/10 hover:bg-black/5 relative"
                            }
                        >
                            <ItemContent>
                                <ItemTitle>
                                    {task.title.length < 45
                                        ? task.title
                                        : task.title.substring(0, 45) + "..."}
                                </ItemTitle>
                                {task.description && (
                                    <ItemDescription>
                                        {task.description.length < 25
                                            ? task.description
                                            : task.description.substring(
                                                  0,
                                                  25,
                                              ) + "..."}
                                    </ItemDescription>
                                )}
                            </ItemContent>
                        </Item>
                    </DialogTrigger>

                    {/*// Update Task Dialog*/}
                    <DialogContent className={"sm:max-w-[550px]"}>
                        <DialogHeader>
                            <DialogTitle>Edit Task</DialogTitle>
                            <DialogDescription>
                                You can update task here. Click on the save
                                button to save task.
                            </DialogDescription>

                            <form className={"flex flex-col gap-6 !mt-4"}>
                                <div className={"grid gap-4"}>
                                    <Label>Title</Label>
                                    <Input
                                        {...form.register("task.title")}
                                        placeholder={"Enter title."}
                                        id="title"
                                    />
                                </div>

                                <div className={"grid gap-4"}>
                                    <Label>Description</Label>
                                    <Textarea
                                        {...form.register("task.description")}
                                        className="max-h-[300px] min-h-[250px]"
                                        id="title"
                                        placeholder="Enter description."
                                    />
                                </div>

                                <div className={"grid gap-4"}>
                                    <Label>Status</Label>
                                    <Select
                                        value={selectedTaskStatus}
                                        onValueChange={(value) => {
                                            setSelectedTaskStatus(
                                                value as TaskStatus,
                                            );
                                        }}
                                    >
                                        <SelectTrigger className={"w-full"}>
                                            <SelectValue
                                                placeholder={task.status}
                                                className={"w-full"}
                                            />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Status
                                                </SelectLabel>
                                                {Object.values(TaskStatus).map(
                                                    (status) => {
                                                        return (
                                                            <SelectItem
                                                                value={status}
                                                                key={`${status}-${task.id}`}
                                                            >
                                                                {status}
                                                            </SelectItem>
                                                        );
                                                    },
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </form>
                            <AnimatePresence>
                                {Object.keys(form.formState.errors).length >
                                    0 && (
                                    <motion.ul
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
                                        className="list-disc pl-5 text-sm text-red-600 dark:text-red-300 !pt-4"
                                    >
                                        {Object.values(
                                            form.formState.errors,
                                        ).map((error, index) => (
                                            <li key={index}>
                                                {error?.message}
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </DialogHeader>
                        <DialogFooter>
                            <div className={"flex justify-between w-full"}>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant={"ghost"}
                                        className={"cursor-pointer"}
                                    >
                                        <TrashIcon className={"text-red-500"} />
                                    </Button>
                                </AlertDialogTrigger>
                                <span className={"flex gap-2"}>
                                    <DialogClose asChild>
                                        <Button variant={"outline"}>
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type={"button"}
                                        onClick={form.handleSubmit(
                                            onUpdateTask,
                                        )}
                                    >
                                        Save
                                    </Button>
                                </span>
                            </div>
                        </DialogFooter>
                    </DialogContent>

                    {/*Confirmation Dialog for deleting task*/}
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Do you want to delete the task?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                This will delete this task from the database.
                                This action can be redone!
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel className={"cursor-pointer"}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={onDeleteTask}
                                className={"cursor-pointer"}
                            >
                                Delete Task
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Dialog>
        </motion.span>
    );
}

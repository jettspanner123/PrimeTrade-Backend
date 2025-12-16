import { BASE_USER } from "../../../shared/types/user/user.types";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
    CREATE_TASK_DTO,
    createTaskSchema,
} from "../../../shared/types/task/task.types";
import { zodResolver } from "@hookform/resolvers/zod";
import APIService from "@/lib/api/api.service";
import { toast } from "sonner";
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
import RegistrationScreenTopBanner from "@/components/shared/registration-screen-top-banner";
import { Button } from "@/components/ui/button";
import { LogOut, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CachingKeys from "@/constants/caching-keys";
import { Spinner } from "@/components/ui/spinner";
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
import { useDialogStore } from "@/stores/dialog-store";

interface Dashboard_CreateTodoDialogProps {
    user: BASE_USER;
    setUser: (data: BASE_USER | null) => void;
}

export default function Dashboard_CreateTodoDialog({
    user,
    setUser,
}: Dashboard_CreateTodoDialogProps): React.JSX.Element {
    const router = useRouter();
    const queryClient = useQueryClient();
    const createTaskMutation = useMutation({
        mutationFn: APIService.createTask,
        onSuccess: async (data) => {
            if (!data.success) {
                toast.error("Failed to create task. Please try again.");
                return;
            }
            await queryClient.invalidateQueries({
                queryKey: [CachingKeys.TASK_KEY, user.id],
            });
            await queryClient.invalidateQueries({
                queryKey: [CachingKeys.TASK_STATS_KEY, user.id],
            });
            toast.success("Task created successfully!");
            setCreateTodoModelOpen(false);
            form.reset();
        },
    });

    const [isLogoutAlertDialogOpen, setIsLogoutAlertDialogOpen] =
        React.useState(false);
    const logoutMutation = useMutation({
        mutationFn: APIService.logout,
        onSuccess: (data) => {
            if (!data.success) {
                toast.error("Failed to logout. Please try again.");
                return;
            }

            setIsLogoutAlertDialogOpen(false);
            setTimeout(() => {
                router.push("/");
                setUser(null);
            }, 500);
        },
    });

    // React hook form for task creation
    const form = useForm<CREATE_TASK_DTO>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: "",
            description: undefined,
            userId: "",
        },
    });

    // Model Open State
    const { isCreateTodoModelOpen, setCreateTodoModelOpen } = useDialogStore();

    // Handle task add submition
    async function onFormSubmit(formData: CREATE_TASK_DTO): Promise<void> {
        const { title, description } = formData;
        const userId: string = user!.id!;
        createTaskMutation.mutate({ title, description, userId });
    }

    // Handle user logout
    async function onPerformLogout(): Promise<void> {
        const data = await APIService.logout();
        if (!data.success) {
            toast.error("Failed to logout. Please try again.");
            return;
        }
        router.push("/");
        setUser(null);
    }

    return (
        <Dialog open={isCreateTodoModelOpen} onOpenChange={setCreateTodoModelOpen}>
            {/* // Trigger for adding a new task */}
            <AlertDialog>
                <RegistrationScreenTopBanner
                    trailingChildren={
                        <div className="flex gap-4 items-center">
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus />
                                    <span className={"md:block hidden"}>
                                        Create Task
                                    </span>
                                </Button>
                            </DialogTrigger>
                            <AlertDialogTrigger asChild>
                                <Button
                                    // onClick={onPerformLogout}
                                    variant={"secondary"}
                                >
                                    <LogOut />
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Do you really want to log out?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Once logged out, you will have to log
                                        back in with your credentials.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={onPerformLogout}
                                    >
                                        Log out
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </div>
                    }
                />

                {/* // Dialog content for adding a new task */}
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>Create Task</DialogTitle>
                        <DialogDescription>
                            Add a new task items and description for{" "}
                            <Badge variant={"outline"}>{user?.username}</Badge>{" "}
                            Click save when you are done.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={form.handleSubmit(onFormSubmit)}
                        className="!mt-4 flex flex-col gap-6"
                    >
                        {/* // Title input */}
                        <div className="grid gap-4">
                            <Label>Title</Label>
                            <Input
                                {...form.register("title")}
                                id="title"
                                type="text"
                                placeholder="Get Internship"
                            />
                        </div>

                        {/* // Description input */}
                        <div className="grid gap-4">
                            <Label>
                                Description{" "}
                                <span className="opacity-50">(optional)</span>
                            </Label>
                            <Textarea
                                {...form.register("description")}
                                className="max-h-[300px] min-h-[250px]"
                                id="title"
                                placeholder="I want to get internship at top tech companies"
                            />
                        </div>
                    </form>

                    {/* // Display form errors */}
                    {Object.keys(form.formState.errors).length > 0 && (
                        <motion.ul
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            initial={{ opacity: 0, filter: "blur(10px)" }}
                            exit={{ opacity: 0, filter: "blur(10px)" }}
                            className="list-disc pl-5 text-sm text-red-600 dark:text-red-300"
                        >
                            {Object.values(form.formState.errors).map(
                                (error, index) => (
                                    <li key={index}>{error?.message}</li>
                                ),
                            )}
                        </motion.ul>
                    )}

                    {/* // Dialog footer with action buttons */}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button
                                onClick={form.handleSubmit(onFormSubmit)}
                                type="submit"
                                disabled={createTaskMutation.isPending}
                            >
                                {createTaskMutation.isPending ? (
                                    <Spinner />
                                ) : (
                                    <span>Add Task</span>
                                )}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </AlertDialog>
        </Dialog>
    );
}

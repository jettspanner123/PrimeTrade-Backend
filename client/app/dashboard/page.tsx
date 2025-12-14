"use client";
import React from "react";
import { useAuthUser } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import RegistrationScreenTopBanner from "@/components/shared/registration-screen-top-banner";
import { Plus } from "lucide-react";
import {
    DialogDescription,
    DialogHeader,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    Dialog,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import {
    CREATE_TASK_DTO,
    createTaskSchema,
} from "../../../shared/types/task/task.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import SessionTimedOutCard from "@/components/shared/session-timed-out-card";
import { toast, Toaster } from "sonner";
import APIService from "@/lib/api/api.service";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DashboardPage(): React.JSX.Element {
    const router = useRouter();
    const { user, setUser } = useAuthUser();

    React.useEffect(() => {
        async function something() {
            const data = await APIService.fetchTasks(user?.id!);
            console.log(data);
        }
        something();
    }, [user?.id]);

    const form = useForm<CREATE_TASK_DTO>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: "",
            description: undefined,
            userId: user!.id!,
        },
    });
    if (!user) {
        return (
            <main className="w-screen h-screen flex justify-center items-center">
                <SessionTimedOutCard />
            </main>
        );
    }

    async function onFormSubmit(formData: CREATE_TASK_DTO) {
        const { title, description, userId } = formData;
        const data = await APIService.createTask({
            title,
            description,
            userId,
        });

        console.log(data);

        if (!data.success) {
            toast.error("Failed to create task. Please try again.");
            return;
        }

        toast.success("Task created successfully!");
        form.reset();
    }

    async function onPerformLogout() {
        const data = await APIService.logout();
        if (!data.success) {
            toast.error("Failed to logout. Please try again.");
            return;
        }
        setUser(null);
        router.push("/");
    }

    return (
        <React.Fragment>
            <Toaster position="bottom-center" />
            <main className="flex flex-col items-center !py-[2rem]">
                <Dialog>
                    <RegistrationScreenTopBanner
                        trailingChildren={
                            <div className="flex gap-4 items-center">
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus />
                                        Add Todo
                                    </Button>
                                </DialogTrigger>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button
                                            onClick={onPerformLogout}
                                            variant={"secondary"}
                                        >
                                            <LogOut />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Logout</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        }
                    />

                    <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                            <DialogTitle>Add Todo</DialogTitle>
                            <DialogDescription>
                                Add a new todo items and description for{" "}
                                <Badge variant={"outline"}>
                                    {user?.username}
                                </Badge>{" "}
                                Click save when you are done.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={form.handleSubmit(onFormSubmit)}
                            className="!mt-4 flex flex-col gap-6"
                        >
                            <div className="grid gap-4">
                                <Label>Title</Label>
                                <Input
                                    {...form.register("title")}
                                    id="title"
                                    type="text"
                                    placeholder="Get Internship"
                                />
                            </div>

                            <div className="grid gap-4">
                                <Label>
                                    Description{" "}
                                    <span className="opacity-50">
                                        (optional)
                                    </span>
                                </Label>
                                <Textarea
                                    {...form.register("description")}
                                    className="max-h-[300px] min-h-[250px]"
                                    id="title"
                                    placeholder="I want to get internship at top tech companies"
                                />
                            </div>
                        </form>

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

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button
                                    onClick={form.handleSubmit(onFormSubmit)}
                                    type="submit"
                                >
                                    Add Task
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <div className="flex gap-4 w-full max-w-[1200px] h-[500px] !mt-4">
                    <Card className="flex-1"></Card>
                    <Card className="flex-1/2"></Card>
                </div>
            </main>
        </React.Fragment>
    );
}

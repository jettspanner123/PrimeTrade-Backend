import React from "react";
import {
    BASE_USER,
    USER_RESPONSE,
} from "../../../shared/types/user/user.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import APIService from "@/lib/api/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CachingKeys from "@/constants/caching-keys";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { UserCircleIcon } from "lucide-react";

const profileUpdateSchema = z.object({
    firstName: z
        .string()
        .min(1, { message: "First name is required." }),
    lastName: z.string().optional(),
    email: z.string().email({ message: "Invalid email address." }),
    username: z
        .string()
        .min(8, { message: "Username must be at least 8 characters." }),
});

type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;

function formatProfileError(
    errors: Array<string> | string | null | undefined,
): string {
    if (errors == null) return "We couldn't update your profile. Please try again.";
    if (Array.isArray(errors)) return errors.length ? errors.join(" ") : "We couldn't update your profile. Please try again.";
    return typeof errors === "string" ? errors : "We couldn't update your profile. Please try again.";
}

interface DashboardProfileTabProps {
    isProfileLoading: boolean;
    profileData: USER_RESPONSE | null | undefined;
    user: BASE_USER;
    setUser: (user: BASE_USER | null) => void;
}

export default function Dashboard_ProfileContent({
    isProfileLoading,
    profileData,
    user,
    setUser,
}: DashboardProfileTabProps): React.ReactElement {
    const queryClient = useQueryClient();

    const profileUser = profileData?.user ?? user;

    const form = useForm<ProfileUpdateFormValues>({
        resolver: zodResolver(profileUpdateSchema),
        defaultValues: {
            firstName: profileUser?.firstName ?? "",
            lastName: profileUser?.lastName ?? undefined,
            email: profileUser?.email ?? "",
            username: profileUser?.username ?? "",
        },
        values: {
            firstName: profileUser?.firstName ?? "",
            lastName: profileUser?.lastName ?? undefined,
            email: profileUser?.email ?? "",
            username: profileUser?.username ?? "",
        },
    });

    const updateProfileMutation = useMutation({
        mutationFn: ({
            id,
            user: payload,
        }: {
            id: string;
            user: ProfileUpdateFormValues;
        }) => APIService.updateUser(id, payload),
        onSuccess: (data) => {
            if (!data.success || !data.currentUser) {
                toast.error(formatProfileError(data.errors));
                return;
            }
            setUser(data.currentUser as BASE_USER);
            queryClient.invalidateQueries({
                queryKey: [CachingKeys.PROFILE_KEY, user.username],
            });
            toast.success("Profile updated successfully!");
        },
        onError: () => {
            toast.error("We couldn't update your profile. Please check your connection and try again.");
        },
    });

    function onProfileSubmit(values: ProfileUpdateFormValues): void {
        updateProfileMutation.mutate({ id: user.id, user: values });
    }

    if (isProfileLoading || !profileData) {
        return (
            <motion.div
                animate={{ opacity: 1, filter: "blur(0px)" }}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                className="flex h-full w-full items-center justify-center py-12"
            >
                <Spinner className="size-8" />
            </motion.div>
        );
    }

    if (!profileData.success || !profileData.user) {
        return (
            <motion.div
                animate={{ opacity: 1, filter: "blur(0px)" }}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                className="flex h-full w-full items-center justify-center py-12"
            >
                <p className="text-sm text-destructive">
                    Failed to load profile. Please try again later.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            animate={{ opacity: 1, filter: "blur(0px)" }}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            className="flex flex-col gap-6 py-4"
        >
            <div className="flex items-center gap-2">
                <UserCircleIcon className="size-5" />
                <span className="text-lg font-medium">Profile</span>
            </div>

            <Card className="flex flex-col gap-4 px-4 py-4">
                <span className="text-sm font-medium">Account info</span>
                <div className="grid gap-2 text-sm text-muted-foreground">
                    <p>
                        <span className="font-medium text-foreground">
                            Username:
                        </span>{" "}
                        {profileUser.username}
                    </p>
                    <p>
                        <span className="font-medium text-foreground">
                            Email:
                        </span>{" "}
                        {profileUser.email}
                    </p>
                    <p>
                        <span className="font-medium text-foreground">
                            Name:
                        </span>{" "}
                        {profileUser.firstName}
                        {profileUser.lastName
                            ? ` ${profileUser.lastName}`
                            : ""}
                    </p>
                </div>
            </Card>

            <Card className="flex flex-col gap-4 px-4 py-4">
                <span className="text-sm font-medium">Edit profile</span>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onProfileSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="First name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last name (optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Last name"
                                            {...field}
                                            value={field.value ?? ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Username (min 8 characters)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={
                                updateProfileMutation.isPending ||
                                !form.formState.isDirty
                            }
                        >
                            {updateProfileMutation.isPending ? (
                                <Spinner className="size-4" />
                            ) : (
                                "Save changes"
                            )}
                        </Button>
                    </form>
                </Form>
            </Card>
        </motion.div>
    );
}

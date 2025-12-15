"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React from "react";
import Link from "next/link";
import RegistrationScreenTopBanner from "@/components/shared/registration-screen-top-banner";
import { useForm } from "react-hook-form";
import {
    REGISTER_DTO,
    REGISTER_RESPONSE,
    registerSchema,
} from "../../../shared/types/auth/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import APIService from "@/lib/api/api.service";
import CachingKeys from "@/constants/caching-keys";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/stores/user-store";
import { Spinner } from "@/components/ui/spinner";

export default function SignupPage(): React.JSX.Element {
    const router = useRouter();
    const signUpSchema = registerSchema
        .extend({
            confirmPassword: z.string({
                error: "Confirm Password not provided!",
            }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            error: "Password and Confirm Password should match!",
            path: ["confirmPassword"],
        });
    type SIGNUP_DTO = z.infer<typeof signUpSchema>;

    const form = useForm<SIGNUP_DTO>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: "",
            email: "",
            password: "",
            username: "",
            confirmPassword: "",
            lastName: undefined,
        },
    });

    const signUpMutation = useMutation({
        mutationFn: APIService.register,
        mutationKey: [CachingKeys.SIGNUP_KEY],
        onSuccess: (data: REGISTER_RESPONSE) => {
            if (!data.success) {
                toast.error(data.errors);
                return;
            }

            toast.success(`Welcome ${data.user?.firstName}`);
            setUser(data.user);
            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);
        },
    });

    const { setUser } = useAuthUser();

    async function onFormSubmit(formData: SIGNUP_DTO) {
        const { firstName, lastName, username, email, password } = formData;
        const signUpData = {
            firstName,
            lastName,
            username,
            email,
            password,
        } satisfies REGISTER_DTO;
        signUpMutation.mutate(signUpData);
    }

    return (
        <React.Fragment>
            <main className="w-screen h-screen flex flex-col gap-2 justify-center items-center">
                <Toaster />
                <RegistrationScreenTopBanner />
                <Card className="w-full max-w-[600px]">
                    <motion.div layout>
                        <CardHeader>
                            <CardTitle>Signup</CardTitle>
                            <CardDescription>
                                Enter the following details to create an
                                accound.
                            </CardDescription>
                        </CardHeader>
                    </motion.div>

                    <CardContent>
                        <form
                            onSubmit={form.handleSubmit(onFormSubmit)}
                            className="flex flex-col gap-6"
                        >
                            {/* First Name & Last Name */}
                            <motion.div layout className="flex gap-6">
                                <div className="grid gap-2 w-full">
                                    <Label>First Name</Label>
                                    <Input
                                        {...form.register("firstName")}
                                        id="first_name"
                                        type="text"
                                        placeholder="Singh"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2 w-full">
                                    <Label>Last Name</Label>
                                    <Input
                                        {...form.register("lastName")}
                                        id="last_name"
                                        type="text"
                                        placeholder="Singh"
                                        required
                                    />
                                </div>
                            </motion.div>

                            {/* Email Id */}
                            <motion.div layout className="grid gap-2">
                                <Label>Email Id</Label>
                                <Input
                                    {...form.register("email")}
                                    id="email"
                                    type="email"
                                    placeholder="hello@example.com"
                                    required
                                />
                            </motion.div>

                            {/* Username */}
                            <motion.div layout className="grid gap-2">
                                <Label>Username</Label>
                                <Input
                                    {...form.register("username")}
                                    id="username"
                                    type="text"
                                    placeholder="mumbo_jumbo"
                                    required
                                />
                            </motion.div>

                            {/* Password */}
                            <motion.div layout className="flex gap-6">
                                <div className="grid gap-2 w-full">
                                    <Label>Password</Label>
                                    <Input
                                        {...form.register("password")}
                                        id="password"
                                        type="password"
                                        placeholder="********"
                                        required
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div className="grid gap-2 w-full">
                                    <Label>Confirm Password</Label>
                                    <Input
                                        {...form.register("confirmPassword")}
                                        id="confirm_password"
                                        type="password"
                                        placeholder="********"
                                        required
                                    />
                                </div>
                            </motion.div>
                        </form>

                        <AnimatePresence>
                            {Object.keys(form.formState.errors).length > 0 && (
                                <motion.ul
                                    layout
                                    initial={{
                                        opacity: 0,
                                        filter: "blur(10px)",
                                    }}
                                    animate={{
                                        opacity: 1,
                                        filter: "blur(0px)",
                                    }}
                                    exit={{ opacity: 0, filter: "blur(10px)" }}
                                    className="list-disc pl-5 text-sm text-red-300 pt-4"
                                >
                                    <AnimatePresence>
                                        {Object.entries(
                                            form.formState.errors,
                                        ).map(([field, error]) => (
                                            <motion.li
                                                key={field}
                                                layout
                                                initial={{ opacity: 0, y: -4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -4 }}
                                            >
                                                {error?.message}
                                            </motion.li>
                                        ))}
                                    </AnimatePresence>
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </CardContent>

                    <CardFooter>
                        <motion.div
                            layout
                            className="flex flex-col gap-3 w-full"
                        >
                            <Button
                                onClick={form.handleSubmit(onFormSubmit)}
                                className="w-full"
                            >
                                {signUpMutation.isPending ? (
                                    <Spinner />
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                            <Link href={"/"}>
                                <Button className="w-full" variant={"outline"}>
                                    Login
                                </Button>
                            </Link>
                        </motion.div>
                    </CardFooter>
                </Card>
            </main>
        </React.Fragment>
    );
}


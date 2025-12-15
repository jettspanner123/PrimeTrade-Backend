import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardTitle,
    CardHeader,
    CardFooter,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import PasswordInput from "../shared/password-input";
import { useForm } from "react-hook-form";
import { LOGIN_DTO, loginSchema } from "../../../shared/types/auth/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import APIService from "@/lib/api/api.service";
import CachingKeys from "@/constants/caching-keys";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";
import { useAuthUser } from "@/stores/user-store";

export default function LoginPage(): React.JSX.Element {
    const { setUser } = useAuthUser();
    const router = useRouter();
    const form = useForm<LOGIN_DTO>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const loginMutation = useMutation({
        mutationFn: APIService.login,
        mutationKey: [CachingKeys.LOGIN_KEY],
        onSuccess: (data) => {
            if (!data.success) {
                toast.error(`Login failed. ${data.errors}`);
                return;
            }
            setUser(data.user);
            router.push("/dashboard");
        },
    });
    return (
        <Card className="w-full max-w-[600px]">
            <motion.div layout>
                <CardHeader>
                    <CardTitle>Login to you account</CardTitle>
                    <CardDescription>
                        Enter your username and password below to login to your
                        account.
                    </CardDescription>
                </CardHeader>
            </motion.div>
            <CardContent className="w-full">
                <form className={"flex flex-col gap-6"}>
                    <motion.div layout className={"grid gap-2"}>
                        <Label htmlFor="email">Username</Label>
                        <Input
                            {...form.register("username")}
                            id="username"
                            type="text"
                            placeholder="mumbo_jumbo"
                            required
                        />
                    </motion.div>

                    <motion.div layout className={"grid gap-2"}>
                        <Label htmlFor="email">Password</Label>

                        <Input
                            {...form.register("password")}
                            id="password"
                            type="password"
                            placeholder="********"
                            required
                        />
                    </motion.div>
                </form>

                <AnimatePresence>
                    {Object.keys(form.formState.errors).length > 0 && (
                        <motion.ul
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            initial={{ opacity: 0, filter: "blur(10px)" }}
                            exit={{ opacity: 0, filter: "blur(10px)" }}
                            className="list-disc pl-5 text-sm text-red-600 dark:text-red-300 !pt-4"
                        >
                            {Object.values(form.formState.errors).map(
                                (error, index) => (
                                    <li key={index}>{error?.message}</li>
                                ),
                            )}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 w-full">
                <motion.div layout className="w-full grid gap-3">
                    <Button
                        onClick={form.handleSubmit((formData: LOGIN_DTO) => {
                            loginMutation.mutate(formData);
                        })}
                        type="submit"
                        className="w-full"
                    >
                        {loginMutation.isPending ? <Spinner /> : "Login"}
                    </Button>
                    <Link href={"/signup"} className="w-full">
                        <Button variant={"outline"} className="w-full">
                            Signup
                        </Button>
                    </Link>
                </motion.div>
            </CardFooter>
        </Card>
    );
}

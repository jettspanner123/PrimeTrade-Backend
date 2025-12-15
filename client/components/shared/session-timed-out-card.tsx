import React from "react";
import {
    Card,
    CardTitle,
    CardHeader,
    CardFooter,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import APIService from "@/lib/api/api.service";
import { toast } from "sonner";

export default function SessionTimedOutCard(): React.JSX.Element {
    const router = useRouter();

    async function logout(): Promise<void> {
        const res = await APIService.logout();
        if (!res || !res.success) toast.error("Could not logout");

        toast.success("User Logged Out!");
        router.push("/");
    }

    return (
        <motion.div
            animate={{ opacity: 1, filter: "blur(0px)" }}
            initial={{ opacity: 0, filter: "blur(10px)" }}
        >
            <Card className="w-full min-w-[400px]">
                <CardHeader>
                    <CardTitle>Session Timed Out!</CardTitle>
                    <CardDescription>
                        Please login again to continue with your exciting tasks.
                    </CardDescription>
                </CardHeader>

                <CardFooter>
                    <Button onClick={logout} className="w-full">
                        Continue to Login Page.
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

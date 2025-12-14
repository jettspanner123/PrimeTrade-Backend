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
import Link from "next/link";

export default function SessionTimedOutCard(): React.JSX.Element {
    return (
        <motion.div
            animate={{ opacity: 1, filter: "blur(0px)" }}
            initial={{ opacity: 0, filter: "blur(10px)" }}
        >
            <Card className="w-full max-w-[500px]">
                <CardHeader>
                    <CardTitle>Session Timed Out!</CardTitle>
                    <CardDescription>
                        Please login again to continue with your exciting todos.
                    </CardDescription>
                </CardHeader>

                <CardFooter>
                    <div className="w-full">
                        <Link href={"/"} className="w-full">
                            <Button className="w-full">
                                Continue to Login Page.
                            </Button>
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

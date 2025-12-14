import React from "react";
import {
    Card,
    CardHeader,
    CardDescription,
    CardContent,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { FaNoteSticky } from "react-icons/fa6";
import ToggleThemeButton from "./toogle-theme-button";
import { motion } from "framer-motion";

export default function RegistrationScreenTopBanner(): React.JSX.Element {
    return (
        <React.Fragment>
            <motion.div layout className="w-full max-w-[600px]">
                <Card className="w-full !py-4 !px-6">
                    <div className="w-full flex items-center justify-between">
                        <h1 className="font-bold flex items-center gap-2">
                            <Link href={"/"}>
                                <Button
                                    variant={"outline"}
                                    className="!m-0 !px-2"
                                >
                                    <FaNoteSticky />
                                </Button>
                            </Link>
                            Todo App
                        </h1>
                        <ToggleThemeButton />
                    </div>
                </Card>
            </motion.div>
        </React.Fragment>
    );
}

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
import { TooltipContent, Tooltip, TooltipTrigger } from "../ui/tooltip";

interface RegistrationScreenTopBannerProps {
    trailingChildren?: React.ReactNode;
}

export default function RegistrationScreenTopBanner({
    trailingChildren,
}: RegistrationScreenTopBannerProps): React.JSX.Element {
    const [isOnDashboardPage, setIsOnDashboardPage] = React.useState(false);

    React.useEffect(() => {
        if (window.location.pathname === "/dashboard")
            setIsOnDashboardPage(true);
    }, []);

    return (
        <React.Fragment>
            <motion.div
                id="top_header_banner"
                layout
                className={`w-full ${isOnDashboardPage ? "max-w-[1200px]" : "max-w-[600px]"}`}
            >
                <Card className="w-full !py-4 !px-6">
                    <div className="w-full flex items-center justify-between">
                        <h1 className="font-bold flex items-center gap-4">
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

                        <div className="flex items-center gap-4">
                            {trailingChildren}
                            <Tooltip>
                                <TooltipTrigger>
                                    <ToggleThemeButton />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Toggle Theme</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </React.Fragment>
    );
}

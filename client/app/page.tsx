"use client";
import React from "react";
import LoginPage from "../components/static/login";
import RegistrationScreenTopBanner from "@/components/shared/registration-screen-top-banner";
import { Toaster } from "sonner";

export default function Home(): React.JSX.Element {
    return (
        <React.Fragment>
            <Toaster />
            <main className="flex flex-col justify-center gap-2 items-center h-screen w-screen">
                <RegistrationScreenTopBanner />
                <LoginPage />
            </main>
        </React.Fragment>
    );
}

"use client";
import { useAuthUser } from "@/stores/user-store";
import React from "react";
export default function DashboardPage(): React.JSX.Element {
    const { user } = useAuthUser();
    return (
        <React.Fragment>
            <main>Hello {user?.username}</main>
        </React.Fragment>
    );
}

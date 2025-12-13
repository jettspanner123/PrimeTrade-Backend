import ToggleThemeButton from "@/components/shared/toogle-theme-button";
import React from "react";

export default function Home(): React.JSX.Element {
    return (
        <React.Fragment>
            <main className="h-screen w-screen flex justify-center items-center">
                <ToggleThemeButton />
            </main>
        </React.Fragment>
    );
}

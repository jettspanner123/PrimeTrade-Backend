import React from "react";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard_TaskItemSkeleton(): React.JSX.Element {
    return (
        <Item variant={"outline"} className={"h-full w-full"}>
            <ItemContent>
                <ItemTitle>
                    <Skeleton className={"h-[15px] w-[150px]"} />
                </ItemTitle>
                <Skeleton className={"h-[15px] w-full bg-accent/50 !mt-2"} />
                <Skeleton className={"h-[15px] bg-accent/50 w-[50%]"} />
            </ItemContent>
        </Item>
    );
}
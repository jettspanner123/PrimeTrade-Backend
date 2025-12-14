import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES: Array<string> = ["/dashboard"];
const PUBLIC_ROUTES: Array<string> = ["/", "/register"];
const COOKIE_TOKE_NAME: string = "AUTH_TOKEN";

export default async function middleware(request: NextRequest) {
    const currentPath: string = request.nextUrl.pathname;
    const isProtectedRoute: boolean = PROTECTED_ROUTES.includes(currentPath);
    const isPublicRoute: boolean = PUBLIC_ROUTES.includes(currentPath);

    const cookie = (await cookies()).get(COOKIE_TOKE_NAME)?.value;

    if (isProtectedRoute && !cookie)
        return NextResponse.redirect(new URL("/", request.nextUrl));

    if (isPublicRoute && cookie)
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl));

    return NextResponse.next();
}

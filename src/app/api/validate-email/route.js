import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email || typeof email !== "string") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email is required",
                },
                { status: 400 }
            );
        }

        const trimmedEmail = email.trim();

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailRegex.test(trimmedEmail)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email format",
                },
                { status: 400 }
            );
        }

        const encodedEmail =
            encodeURIComponent(trimmedEmail);

        const response = await fetch(
            `https://api.xposedornot.com/v1/check-email/${encodedEmail}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
                cache: "no-store",
            }
        );

        const data = await response.json();

        // Email найден в известных утечках
        if (response.ok && data.status === "success") {
            const breaches = Array.isArray(data.breaches)
                ? data.breaches.flat()
                : [];

            return NextResponse.json({
                success: true,
                breached: true,
                breaches,
                message:
                    "This email was found in known data breaches.",
            });
        }

        // Email не найден
        if (
            response.status === 404 ||
            data.Error === "Not found"
        ) {
            return NextResponse.json({
                success: true,
                breached: false,
                breaches: [],
                message:
                    "This email was not found in known data breaches.",
            });
        }

        // Лимит запросов
        if (response.status === 429) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Too many requests. Please try again later.",
                },
                { status: 429 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message:
                    "XposedOrNot verification failed.",
            },
            { status: response.status }
        );
    } catch (error) {
        console.error("Email verification error:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    "An error occurred while checking the email.",
            },
            { status: 500 }
        );
    }
}
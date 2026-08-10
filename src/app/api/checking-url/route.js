import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        success: true,
        message: "VirusTotal API route is working",
    });
}

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url || typeof url !== "string") {
            return NextResponse.json(
                {
                    success: false,
                    message: "URL is required",
                },
                { status: 400 }
            );
        }

        const trimmedUrl = url.trim();

        let parsedUrl;

        try {
            parsedUrl = new URL(trimmedUrl);
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid URL",
                },
                { status: 400 }
            );
        }

        if (
            parsedUrl.protocol !== "http:" &&
            parsedUrl.protocol !== "https:"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Only HTTP and HTTPS URLs are supported",
                },
                { status: 400 }
            );
        }

        const apiKey = process.env.VIRUSTOTAL_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "VIRUSTOTAL_API_KEY is missing",
                },
                { status: 500 }
            );
        }

        const urlId = Buffer.from(trimmedUrl)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        const response = await fetch(
            `https://www.virustotal.com/api/v3/urls/${urlId}`,
            {
                method: "GET",
                headers: {
                    "x-apikey": apiKey,
                },
                cache: "no-store",
            }
        );

        if (response.status === 404) {
            return NextResponse.json({
                success: true,
                found: false,
                message:
                    "This URL has not been analyzed by VirusTotal yet.",
            });
        }

        if (!response.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "VirusTotal request failed",
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        const stats =
            data?.data?.attributes?.last_analysis_stats || {};

        return NextResponse.json({
            success: true,
            found: true,
            stats: {
                harmless: stats.harmless || 0,
                malicious: stats.malicious || 0,
                suspicious: stats.suspicious || 0,
                undetected: stats.undetected || 0,
            },
        });

    } catch (error) {
        console.error(
            "VirusTotal error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Server error",
            },
            { status: 500 }
        );
    }
}
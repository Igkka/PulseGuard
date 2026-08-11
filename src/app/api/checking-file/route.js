import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json(
                {
                    success: false,
                    message: "File not found",
                },
                { status: 400 }
            );
        }

        const apiKey = process.env.VIRUSTOTAL_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                {
                    success: false,
                    message: "VirusTotal API key is missing",
                },
                { status: 500 }
            );
        }

        const uploadData = new FormData();
        uploadData.append("file", file);

        const uploadResponse = await fetch(
            "https://www.virustotal.com/api/v3/files",
            {
                method: "POST",
                headers: {
                    "x-apikey": apiKey,
                },
                body: uploadData,
            }
        );

        const uploadText = await uploadResponse.text();

        let uploadResult;

        try {
            uploadResult = JSON.parse(uploadText);
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid response from VirusTotal",
                },
                { status: 502 }
            );
        }

        if (!uploadResponse.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        uploadResult?.error?.message ||
                        "File upload failed",
                },
                { status: uploadResponse.status }
            );
        }

        const analysisId =
            uploadResult?.data?.id;

        if (!analysisId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Analysis ID was not received",
                },
                { status: 500 }
            );
        }

        // Ждём завершения анализа
        let analysis = null;

        for (let i = 0; i < 10; i++) {
            await new Promise((resolve) =>
                setTimeout(resolve, 3000)
            );

            const analysisResponse = await fetch(
                `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
                {
                    headers: {
                        "x-apikey": apiKey,
                    },
                }
            );

            const analysisText =
                await analysisResponse.text();

            let analysisResult;

            try {
                analysisResult =
                    JSON.parse(analysisText);
            } catch {
                continue;
            }

            if (!analysisResponse.ok) {
                continue;
            }

            analysis =
                analysisResult?.data?.attributes;

            if (
                analysis?.status ===
                "completed"
            ) {
                break;
            }
        }

        if (!analysis) {
            return NextResponse.json({
                success: true,
                completed: false,
                message:
                    "File was uploaded, but the analysis is still running.",
            });
        }

        const stats =
            analysis.stats || {};

        return NextResponse.json({
            success: true,
            completed: true,
            stats: {
                malicious:
                    stats.malicious || 0,
                suspicious:
                    stats.suspicious || 0,
                harmless:
                    stats.harmless || 0,
                undetected:
                    stats.undetected || 0,
            },
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message ||
                    "Server error",
            },
            { status: 500 }
        );
    }
}
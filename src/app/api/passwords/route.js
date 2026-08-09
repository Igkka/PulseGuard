import CryptoJS from "crypto-js";

export async function POST(request) {
    try {
        const { passwords } = await request.json();

        const secret = process.env.STORAGE_SECRET;

        if (!secret) {
            return Response.json(
                {
                    success: false,
                    error: "SECRET_PASSWORD is missing",
                },
                { status: 500 }
            );
        }

        const encrypted = CryptoJS.AES
            .encrypt(
                JSON.stringify(passwords),
                secret
            )
            .toString();

        return Response.json({
            success: true,
            data: encrypted,
        });

    } catch (error) {
        console.error(error);

        return Response.json(
            {
                success: false,
                error: "Encryption failed",
            },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const { data } = await request.json();

        const secret = process.env.STORAGE_SECRET;

        if (!secret) {
            return Response.json(
                {
                    success: false,
                    error: "SECRET_PASSWORD is missing",
                },
                { status: 500 }
            );
        }

        const bytes = CryptoJS.AES.decrypt(
            data,
            secret
        );

        const decrypted = bytes.toString(
            CryptoJS.enc.Utf8
        );

        if (!decrypted) {
            return Response.json(
                {
                    success: false,
                    error: "Decryption failed",
                },
                { status: 400 }
            );
        }

        const passwords = JSON.parse(decrypted);

        return Response.json({
            success: true,
            passwords,
        });

    } catch (error) {
        console.error(error);

        return Response.json(
            {
                success: false,
                error: "Decryption failed",
            },
            { status: 500 }
        );
    }
}
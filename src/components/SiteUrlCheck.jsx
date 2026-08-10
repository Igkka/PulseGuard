"use client";

import { useState } from "react";
import { spendCoin } from "./SpendCoins";
import "@/components/style/SiteUrlCheck.css"

export default function SiteSecurityCheck() {
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const [stats, setStats] = useState(null);

    const checkUrl = async () => {
        const trimmedUrl = url.trim();

        if (!trimmedUrl) {
            setStatus("invalid");
            setMessage("Enter a URL");
            return;
        }

        setStatus("checking");
        setMessage("");
        setStats(null);

        if (!spendCoin()) {
            setStatus("error");
            setMessage("You don't have enough coins!");
            return;
        }

        try {
            const response = await fetch(
                "/api/checking-url",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        url: trimmedUrl,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                setStatus("error");
                setMessage(
                    data.message ||
                    "URL verification failed"
                );
                return;
            }

            if (!data.found) {
                setStatus("not_found");
                setMessage(data.message);
                return;
            }

            setStats(data.stats);

            if (data.stats.malicious > 0) {
                setStatus("danger");
                setMessage(
                    "This URL was detected as malicious."
                );
            } else if (data.stats.suspicious > 0) {
                setStatus("suspicious");
                setMessage(
                    "This URL was detected as suspicious."
                );
            } else {
                setStatus("safe");
                setMessage(
                    "No malicious detections were found."
                );
            }

        } catch (error) {
            console.error(error);

            setStatus("error");
            setMessage(
                "An error occurred while checking the URL."
            );
        }
    };

    return (
        <section className="siteurlcheck">

            <h2>Site Security Check</h2>
            <div className="sitecontent">
          
            {status === "checking" && (
                <p>Checking...</p>
            )}

            {status === "safe" && (
                <div className="success">
                    🟢 {message}
                </div>
            )}

            {status === "suspicious" && (
                <div className="warning">
                    🟡 {message}
                </div>
            )}

            {status === "danger" && (
                <div className="error">
                    🔴 {message}
                </div>
            )}

            {status === "not_found" && (
                <div className="info">
                    ⚪ {message}
                </div>
            )}

            {status === "invalid" && (
                <div className="error">
                    {message}
                </div>
            )}

            {status === "error" && (
                <div className="error">
                    {message}
                </div>
            )}

            {stats && (
                <div className="scanStats">
                    <p>
                        Harmless: {stats.harmless}
                    </p>

                    <p>
                        Malicious: {stats.malicious}
                    </p>

                    <p>
                        Suspicious: {stats.suspicious}
                    </p>

                    <p>
                        Undetected: {stats.undetected}
                    </p>
                </div>
            )}
              <input
                type="url"
                className="checkedsite"
                value={url}
                onChange={(e) => {
                    setUrl(e.target.value);
                    setStatus("idle");
                    setMessage("");
                    setStats(null);
                }}
                placeholder="https://example.com"
                disabled={status === "checking"}
            />

            <button
                type="button"
                onClick={checkUrl}
                className="sitebtn"
                disabled={
                    !url.trim() ||
                    status === "checking"
                }
            >
                {status === "checking"
                    ? "Checking..."
                    : "Check URL"}
            </button>

        </div>

        </section>
    );
}
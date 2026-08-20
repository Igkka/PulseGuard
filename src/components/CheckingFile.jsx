"use client";

import { useState } from "react";
import { spendCoin } from "./SpendCoins";
import "@/components/style/CheckingFile.css"

export default function FileSecurity() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const [stats, setStats] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        setFile(selectedFile);
        setStatus("idle");
        setMessage("");
        setStats(null);
    };

    const checkFile = async () => {

        if (status === "checking") {
            return;
        }

        if (!file) {
            setStatus("error");
            setMessage("Select a file first");
            return;
        }

        if (!spendCoin()) {
            setStatus("error");
            setMessage("You don't have enough coins!");
            return;
        }

        setStatus("checking");
        setMessage("Checking file...");
        setStats(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(
                "/api/checking-file",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);
            } catch {
                console.error(
                    "Server response:",
                    text
                );
                setStatus("error");
                setMessage(
                    "Server returned an invalid response"
                );

                return;
            }

            if (
                !response.ok ||
                !data.success
            ) {
                setStatus("error");
                setMessage(
                    data.message ||
                    "File check failed"
                );

                return;
            }

            if (!data.completed) {
                setStatus("checking");
                setMessage(
                    "The file is still being analyzed. Try again later."
                );

                return;
            }

            const resultStats =
                data.stats || {};

            setStats(resultStats);

            if (
                resultStats.malicious > 0
            ) {
                setStatus("danger");
                setMessage(
                    "Malicious detections found!"
                );
            } else if (
                resultStats.suspicious > 0
            ) {
                setStatus("suspicious");
                setMessage(
                    "Suspicious detections found."
                );
            } else {
                setStatus("success");
                setMessage(
                    "No malicious detections found."
                );
            }

        } catch (error) {
            console.error(error);
            setStatus("error");
            setMessage(
                "Error while checking the file"
            );
        }
    };

    return (
        <>
        <div className="sectionline"></div>
        <h4>06</h4>
        <div className="sectionline"></div>

        <section id="filecheck" className="filecheck">
            <h2>File Security</h2>

            <input
                type="file"
                onChange={handleFileChange}
                className="checkedfile"
                disabled={
                    status === "checking"
                }
            />

            {file && (
                <p>
                    Selected file: {file.name}
                </p>
            )}

            {message && (
                <p className={status}>
                    {message}
                </p>
            )}

            {stats && (
                <div className="fileresults">
                    <h3>Scan Results</h3>

                    <p>
                        Malicious:{" "}
                        {stats.malicious}
                    </p>

                    <p>
                        Suspicious:{" "}
                        {stats.suspicious}
                    </p>

                    <p>
                        Harmless:{" "}
                        {stats.harmless}
                    </p>

                    <p>
                        Undetected:{" "}
                        {stats.undetected}
                    </p>
                </div>
            )}
        <button
            type="button"
            onClick={checkFile}
            className="checkfilebtn"
            disabled={!file || status === "checking"}
        >
            Check File
        </button>
        </section>
        </>
    );
}
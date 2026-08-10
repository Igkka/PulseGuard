"use client";

import { useState } from "react";
import "@/components/style/Email.css"

export default function EmailValidator() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const [breaches, setBreaches] = useState([]);
  
    const isValidFormat = (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    };

    const validateEmail = async () => {
        const trimmedEmail = email.trim();

        if (!isValidFormat(trimmedEmail)) {
            setStatus("invalid");
            setMessage("Invalid email format");
            return;
        }

        setStatus("checking");
        setMessage("");
        setBreaches([]);

        try {
            const response = await fetch("/api/validate-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: trimmedEmail }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setStatus("error");
                setMessage(data.message || "Email verification failed");
                return;
            }

            if (data.breached) {
                setStatus("breached");
                setMessage("This email was found in known data breaches.");
                setBreaches(data.breaches || []);
            } else {
                setStatus("safe");
                setMessage("This email was not found in known data breaches.");
            }
        } catch (error) {
            console.error(error);
            setStatus("error");
            setMessage("An error occurred while checking the email.");
        }
    };

    return (
        <section className="emailvalidator">
            <h2>Email Security Check</h2>

          <div className="emailcontent">
           
            {status === "safe" && (
                <div className="success">🟢 {message}</div>
            )}

            {status === "breached" && (
                <div className="error">
                    🔴 {message}

                    {breaches.length > 0 && (
                        <div>
                            <h3>Found in:</h3>
                            <ul>
                                {breaches.map((breach) => (
                                    <li key={breach.Name}>
                                        {breach.Name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {status === "invalid" && (
                <div className="error">{message}</div>
            )}

            {status === "error" && (
                <div className="error">{message}</div>
            )}

            <input
              className="chekedemail"
              type="email"
              value={email}
              onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus("idle");
                  setMessage("");
                  setBreaches([]);
              }}
              placeholder="Enter your email"
              disabled={status === "checking"}
            />


             <button
                type="button"
                className="emailbtn"
                onClick={validateEmail}
                disabled={!email.trim() || status === "checking"}
            >
                {status === "checking" ? "Checking..." : "Check Email"}
            </button>
            </div>
        </section>
    );
}
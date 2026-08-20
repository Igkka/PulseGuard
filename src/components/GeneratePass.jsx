"use client";

import { useState } from "react";
import "@/components/style/GeneratePass.css";
import { Copy } from "lucide-react";
import { spendCoin } from "./SpendCoins";

export default function GeneratePass() {
  const [newPassword, setNewPassword] = useState("");
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*-_";

    let chars = lowercase;

    if (useUppercase) chars += uppercase;
    if (useNumbers) chars += numbers;
    if (useSymbols) chars += symbols;

    if (!chars) {
      alert("Choose at least one character type!");
      return;
    }

    if (!spendCoin()) {
      alert("You don't have enough coins!");
      return;
    }

    let generatePassResult = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      generatePassResult += chars[randomIndex];
    }

    setNewPassword(generatePassResult);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!newPassword) {
      alert("Generate a password first!");
      return;
    }

    try {
      await navigator.clipboard.writeText(newPassword);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  return (
    <>
      <div className="sectionline"></div>
      <h4>02</h4>
      <div className="sectionline"></div>

      <section className="genpass" id="genpass">
        <div className="formgenerate">
          <h2>Generate Password</h2>

          <div className="genpasscontent">
            <div className="password-output">
              <p className="newgenpass">
                {newPassword || "Your Password Here"}
              </p>

              <button
                className="copybtn"
                onClick={handleCopy}
                type="button"
                aria-label="Copy password"
                title="Copy password"
              >
                <Copy size={20} />
              </button>
            </div>

            {copied && <p className="copy-message">Password copied!</p>}

            <div className="password-settings">
              <label htmlFor="passwordLength">
                Password length: <strong>{length}</strong>
              </label>

              <input
                id="passwordLength"
                type="range"
                min="8"
                max="64"
                step="1"
                value={length}
                onChange={(event) => setLength(Number(event.target.value))}
              />

              <div className="checkboxes">
                <label>
                  <input
                    type="checkbox"
                    checked={useUppercase}
                    onChange={(event) =>
                      setUseUppercase(event.target.checked)
                    }
                  />
                  Uppercase letters (A-Z)
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={useNumbers}
                    onChange={(event) => setUseNumbers(event.target.checked)}
                  />
                  Numbers (0-9)
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={useSymbols}
                    onChange={(event) => setUseSymbols(event.target.checked)}
                  />
                  Special symbols (!@#$...)
                </label>
              </div>
            </div>

            <button
              className="createpassbtn"
              onClick={handleGenerate}
              type="button"
            >
              Generate
            </button>
          </div>
        </div>
      </section>
    </>
  );
}


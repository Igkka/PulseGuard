

"use client"
import { useState } from "react";
import "@/components/style/GeneratePass.css"
import { Copy } from 'lucide-react';
import { spendCoin } from "./SpendCoins";

export default function GeneratePass(){

    const [newPassword,setNewPassword] = useState("")

    const handleGenerate = () => {
        let generatePassResult = "";
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

        if (!spendCoin()) {
            alert("You don't have enough coins!");
            return;
        }

        for (let i = 0; i < 16; i++) {
            generatePassResult += chars[Math.floor(Math.random() * chars.length)];
        }

        setNewPassword(generatePassResult);
    }

    const handleCopy = async () => {
        if (!newPassword) {
            alert("Generate a password first!");
            return;
        }

        try {
            await navigator.clipboard.writeText(newPassword);
            alert("Password copied!");
        } catch {
            alert("Copy failed. Please copy manually.");
        }
    }

    return(
        <>
        <div className="sectionline"></div>
        <h4>02</h4>
        <div className="sectionline"></div>
        <section className="genpass" id="genpass">

            <div className="formgenerate">
            
                <h2>Generate Password</h2>
                <div className="genpasscontent">
                    <p className="newgenpass">{newPassword === "" ? "Your Password Here" : newPassword} <Copy className="copybtn" onClick={handleCopy}/></p>
                    <button className="createpassbtn" onClick={handleGenerate}>Generate</button>
                </div>

            </div>

        </section>
        </>
    )
}
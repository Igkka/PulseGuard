"use client"
import "@/components/style/Balance.css"
import { useEffect, useState } from "react"
import { getStorageItem, setStorageItem } from "@/lib/auth"

export default function UserBalance(){

    const [balanceUser,setBalanceUser] = useState(0)

    useEffect(()=>{
        let balance = getStorageItem("balance", null);

        if (balance === null) {
            const plan = getStorageItem("plan", "free");
            balance = plan === "pro" ? "100" : "10";
            setStorageItem("balance", balance);
        }

        setBalanceUser(balance ? Number(balance) : 0)
    },[])

    return(
        <div className="balancecontent">
            <p>Balance: {balanceUser}</p>
        </div>
    )

}
"use client"

import "./style/Pricing.css";
import { useEffect, useState } from "react";
import { getUsers, getSession, saveUsers, setStorageItem } from "@/lib/auth";

const plans = [
    {
        title: "Free",
        price: "$0 - 15 credits",
        features: [
            "Basic Password Storage",
            "Password Strength Check",
            "Basic Support"
        ]
    },
    {
        title: "Pro",
        price: "$3 - 100 credit",
        features: [
            "Strong Password Storage",
            "Password Strength Check",
            "Strong Password Generator",
            "Checking For Mail Security",
            "Site Security Check",
            "Strong Support"
        ]
    }
];

export default function PricingPage() {
    const [currentPlan, setCurrentPlan] = useState("free");
    const [session, setSession] = useState({ isAuth: false, username: "", plan: "free" });

    useEffect(() => {
        const sessionData = getSession();
        setSession(sessionData);
        setCurrentPlan(sessionData.plan || "free");
    }, []);

    const choosePlan = (plantype) => {
        if (!session.isAuth) {
            alert("Please log in first!");
            return;
        }

        const users = getUsers();
        const user = users.find((u) => u.username === session.username);
        const storedPlan = session.plan || "free";

        if (!user) {
            alert("Please log in first!");
            return;
        }

        if (storedPlan === "pro" && plantype === "free") {
            alert("You cannot switch from the Pro plan to the Free plan.");
            return;
        }

        if (plantype === storedPlan) {
            alert("You already have this plan.");
            return;
        }

        user.plan = plantype;
        saveUsers(users);
        setStorageItem("plan", plantype);
        setCurrentPlan(plantype);

        alert(`You selected the ${plantype} plan!`);
        window.location.href = "/";
    };

    return (
        <section
            id="rates"
            className="rates"
        >
            <h2>Rates</h2>

            <div className="cards">
                {plans.map((plan) => (
                    <div
                        className="card"
                        key={plan.title}
                    >
                        <h3>{plan.title}</h3>
                        <p>{plan.price}</p>
                        <ul>
                            {plan.features.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                        <button onClick={() => choosePlan(plan.title.toLowerCase())}>
                            Select
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}

"use client"

import "./style/Pricing.css";
import { useEffect, useState } from "react";
import { getUsers, getSession, saveUsers } from "@/lib/auth";

const plans = [
    {
        title: "Free",
        price: "$0 - 15 credits",
        features: [
            "Basic Password Storage",
            "Password Strength Check",
            "Password Generator",
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
            "File Security Check",
            "Strong Support"
        ]
    }
];

const initialPaymentForm = {
    cardholder: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
};

export default function PricingPage() {
    const [currentPlan, setCurrentPlan] = useState("free");
    const [session, setSession] = useState({ isAuth: false, username: "", plan: "free" });
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [pendingPlan, setPendingPlan] = useState(null);
    const [paymentForm, setPaymentForm] = useState(initialPaymentForm);
    const [paymentMessage, setPaymentMessage] = useState("");

    useEffect(() => {
        const sessionData = getSession();
        setSession(sessionData);
        setCurrentPlan(sessionData.plan || "free");
    }, []);

    const savePaymentToStorage = (user, paymentData) => {
        const savedPayments = JSON.parse(localStorage.getItem("payments") || "[]");
        savedPayments.push(paymentData);
        localStorage.setItem("payments", JSON.stringify(savedPayments));
        localStorage.setItem(`payment:${user.username}`, JSON.stringify(paymentData));
    };

    const handlePaymentInput = (event) => {
        const { name, value } = event.target;
        let nextValue = value;

        if (name === "cardNumber") {
            nextValue = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
        }

        if (name === "expiry") {
            nextValue = value.replace(/\D/g, "").slice(0, 4);
            if (nextValue.length > 2) {
                nextValue = `${nextValue.slice(0, 2)}/${nextValue.slice(2)}`;
            }
        }

        if (name === "cvv") {
            nextValue = value.replace(/\D/g, "").slice(0, 4);
        }

        setPaymentForm((prev) => ({ ...prev, [name]: nextValue }));
    };

    const choosePlan = async (plantype) => {
        if (!session.isAuth) {
            alert("Please log in first!");
            return;
        }

        const users = await getUsers();
        const user = users.find((u) => u.username === session.username);

        if (!user) {
            alert("Please log in first!");
            return;
        }

        const storedPlan = user.plan || "free";

        if (storedPlan === "pro" && plantype === "free") {
            alert("You cannot switch from the Pro plan to the Free plan.");
            return;
        }

        if (plantype === storedPlan) {
            alert("You already have this plan.");
            return;
        }

        if (plantype === "pro") {
            setPendingPlan("pro");
            setPaymentMessage("");
            setShowPaymentModal(true);
            return;
        }

        user.plan = plantype;

        if (storedPlan === "free" && plantype === "pro") {
            localStorage.setItem("balance", "100");
        }

        await saveUsers(users);
        localStorage.setItem("plan", plantype);

        setCurrentPlan(plantype);
        alert(`You selected the ${plantype} plan!`);
        window.location.href = "/";
    };

    const handlePaymentSubmit = async (event) => {
        event.preventDefault();

        if (!session.isAuth || !pendingPlan) {
            return;
        }

        const users = await getUsers();
        const user = users.find((u) => u.username === session.username);

        if (!user) {
            return;
        }

        const paymentData = {
            username: session.username,
            plan: pendingPlan,
            cardholder: paymentForm.cardholder.trim(),
            cardNumber: paymentForm.cardNumber.replace(/\s+/g, ""),
            expiry: paymentForm.expiry.trim(),
            cvv: paymentForm.cvv.trim(),
            createdAt: new Date().toISOString()
        };

        user.plan = pendingPlan;
        user.payment = {
            cardholder: paymentData.cardholder,
            cardNumber: paymentData.cardNumber,
            expiry: paymentData.expiry,
            cvv: paymentData.cvv
        };

        savePaymentToStorage(user, paymentData);
        await saveUsers(users);
        localStorage.setItem("plan", pendingPlan);
        localStorage.setItem("balance", "100");

        setCurrentPlan(pendingPlan);
        setPaymentForm(initialPaymentForm);
        setShowPaymentModal(false);
        setPendingPlan(null);
        setPaymentMessage("Демо-оплата сохранена локально в браузере.");

        alert(`You selected the ${pendingPlan} plan!`);
        window.location.href = "/";
    };

    return (
        <section id="rates" className="rates">
            <h2>Rates</h2>

            <div className="cards">
                {plans.map((plan) => (
                    <div className="card" key={plan.title}>
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

            {showPaymentModal && (
                <div className="payment-backdrop" onClick={() => setShowPaymentModal(false)}>
                    <div className="payment-modal" onClick={(event) => event.stopPropagation()}>
                        <button className="payment-close" type="button" onClick={() => setShowPaymentModal(false)}>
                            ×
                        </button>
                        <h3>Payment Pro</h3>

                        <form onSubmit={handlePaymentSubmit} className="payment-form">
                            <label>
                                Card Name
                                <input
                                    type="text"
                                    name="cardholder"
                                    placeholder="Ivan Ivanov"
                                    value={paymentForm.cardholder}
                                    onChange={handlePaymentInput}
                                    required
                                />
                            </label>

                            <label>
                                Card Number 
                                <input
                                    type="text"
                                    name="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    value={paymentForm.cardNumber}
                                    onChange={handlePaymentInput}
                                    required
                                />
                            </label>

                            <div className="payment-row">
                                <label>
                                    Expiry
                                    <input
                                        type="text"
                                        name="expiry"
                                        placeholder="MM/YY"
                                        value={paymentForm.expiry}
                                        onChange={handlePaymentInput}
                                        required
                                    />
                                </label>

                                <label>
                                    CVV
                                    <input
                                        type="text"
                                        name="cvv"
                                        placeholder="123"
                                        value={paymentForm.cvv}
                                        onChange={handlePaymentInput}
                                        required
                                    />
                                </label>
                            </div>

                            <button className="payment-submit" type="submit">
                                Pay
                            </button>
                        </form>

                        {paymentMessage && <p className="payment-success">{paymentMessage}</p>}
                    </div>
                </div>
            )}
        </section>
    );
}

"use client";

import "@/components/style/Registration.css";
import { useRef, useState } from "react";
import Link from "next/link";
import {
    DEFAULT_AVATAR,
    registerUser,
} from "@/lib/auth";

export default function Registration() {
    const fileInputRef = useRef(null);

    const [blank, setBlank] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [avatar, setAvatar] = useState(DEFAULT_AVATAR);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            blank.username.trim() === "" ||
            blank.email.trim() === "" ||
            blank.password.trim() === ""
        ) {
            alert("Fill in all fields");
            return;
        }

        const result = registerUser({
            username: blank.username.trim(),
            email: blank.email.trim(),
            password: blank.password.trim(),
            avatar,
        });

        if (!result.success) {
            alert(result.error);
            return;
        }

        // Новый аккаунт получает Free-план
        localStorage.setItem("plan", "free");

        // Новый аккаунт получает 15 кредитов
        localStorage.setItem("balance", "15");

        alert("You are registered");

        window.location.href = "/";
    };

    const handleChange = (e) => {
        setBlank({
            ...blank,
            [e.target.name]: e.target.value,
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            setAvatar(event.target.result);
        };

        reader.readAsDataURL(file);
    };

    const handleUseDefaultAvatar = () => {
        setAvatar(DEFAULT_AVATAR);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <section className="registration">
            <form onSubmit={handleSubmit}>

                <h2>Registration</h2>

                <div className="avatar-section">
                    <img
                        src={avatar}
                        alt="Avatar"
                        className="avatar-preview"
                    />

                    <div className="avatar-actions">
                        <button
                            type="button"
                            className="avatar-picker-btn"
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                        >
                            Choose an avatar
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleAvatarChange}
                        />

                        {avatar !== DEFAULT_AVATAR && (
                            <button
                                type="button"
                                className="avatar-default-btn"
                                onClick={handleUseDefaultAvatar}
                            >
                                Use default
                            </button>
                        )}
                    </div>
                </div>

                <div className="blanks">
                    <input
                        name="username"
                        value={blank.username}
                        onChange={handleChange}
                        placeholder="Your username"
                    />

                    <input
                        name="email"
                        type="email"
                        value={blank.email}
                        onChange={handleChange}
                        placeholder="Your email"
                    />

                    <input
                        name="password"
                        type="password"
                        value={blank.password}
                        onChange={handleChange}
                        placeholder="Your password"
                    />
                </div>

                <button
                    className="registerbnt"
                    type="submit"
                >
                    Register
                </button>

                <p>
                    Have account?
                    <Link href="/login"> Sign In</Link>
                </p>

            </form>
        </section>
    );
}
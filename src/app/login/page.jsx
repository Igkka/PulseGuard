"use client";

import "@/components/style/login.css";
import { useState } from "react";
import Link from "next/link";
import { loginUser } from "@/lib/auth";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const signIn = (e) => {
    e.preventDefault();

    if (!login.trim() || !email.trim() || !password.trim()) {
      alert("Fill in all fields");
      return;
    }

    const result = loginUser({
      username: login.trim(),
      email: email.trim(),
      password: password.trim(),
    });

    if (!result.success) {
      alert(result.error);
      return;
    }

    alert("Welcome");
    window.location.href = "/";
  };

  return (
    <form onSubmit={signIn} className="loginpage">
      <div className="blanks">
        <input
          name="username"
          placeholder="Your username"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          name="email"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          name="password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="signinbtn" type="submit">
        Sign In
      </button>
      <p>
        No account?
        <Link href="/registration"> Register</Link>
      </p>
    </form>
  );
}

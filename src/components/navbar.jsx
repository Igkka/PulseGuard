"use client";

import "./style/navbar.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DEFAULT_AVATAR, getSession, logout } from "@/lib/auth";
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const [session, setSession] = useState({
    isAuth: false,
    username: "",
    avatar: DEFAULT_AVATAR,
    plan: "",
  });

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setSession(getSession());
  }, []);

  const handleLogout = () => {
    logout();
    setSession({ isAuth: false, username: "", avatar: DEFAULT_AVATAR, plan: "" });
    window.location.href = "/";
  };

  return (
    <header>
      <nav className="navbar">
        <a href="/" className="logo">PulseGuard</a>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <ul className="nav-links">
          <Link href="/">Home</Link>
          <a href="/#rates">Rates</a>
          <Link href="/doc">Documents</Link>  
          {session.plan === "free" ? (
            <Link href="/free">Free</Link>
          ) : session.plan === "pro" ? (
            <Link href="/pro">Pro</Link>
          ) : (
            ""
          )}
        </ul>

        {session.isAuth ? (
          <div className="user-profile">
            <img
              className="user-avatar"
              src={session.avatar}
              alt={`${session.username} avatar`}
            />
            <div className="user-meta">
              <h2>
                {session.username}
                {session.plan === "free"
                  ? " ᶠʳᵉᵉ"
                  : session.plan === "pro"
                  ? " ᴾᴿᴼ"
                  : ""}
              </h2>
              
            </div>

            <button type="button" className="logout-btn" onClick={handleLogout}>
              <LogOut/>
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link href="/login" className="login">
              Sign_In
            </Link>
            <Link href="/registration" className="register">
              Sign_Up
            </Link>
          </div>
        )}
      </nav>

    {menuOpen && (
        <div className="mobile-menu">
            <div className="mobile-nav-links">
                <Link href="/" onClick={() => setMenuOpen(false)}>
                    Home
                </Link>

                <a href="/#rates" onClick={() => setMenuOpen(false)}>
                    Rates
                </a>

                <Link href="/doc" onClick={() => setMenuOpen(false)}>
                    Documents
                </Link>
                {session.plan === "free" && (
                    <Link href="/free" onClick={() => setMenuOpen(false)}>
                        Free
                    </Link>
                )}
                {session.plan === "pro" && (
                    <Link href="/pro" onClick={() => setMenuOpen(false)}>
                        Pro
                    </Link>
                )}
            </div>

            {session.isAuth ? (
                <div className="mobile-user">
                    <div>     
                          <img className="mobile-user-avatar" src={session.avatar} alt="avatar"/>
                        <span>
                            {session.username}
                        </span>
                    </div>
                      <button className="mobile-logout" onClick={handleLogout}>
                        Log out
                    </button>

                </div>
            ) : (
                <div className="mobile-auth">

                    <Link href="/login" onClick={() => setMenuOpen(false)}>
                        Sign_In
                    </Link>

                    <Link href="/registration"  onClick={() => setMenuOpen(false)}>
                        Sign_Up
                    </Link>

                </div>
            )}

        </div>
    )}
      
    </header>
  );
}


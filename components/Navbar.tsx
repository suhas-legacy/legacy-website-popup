"use client";



import Image from "next/image";

import Link from "next/link";

import { useCallback, useEffect, useMemo, useState } from "react";

import { usePathname } from "next/navigation";

import { PANEL_URL, PANEL_URL_REGISTER } from "@/lib/constants";

import logo from "./logo.svg";



export function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();

  const isHomePage = pathname === "/";



  const isActiveLink = (path: string) => pathname === path;



  const navClassName = useMemo(() => {

    const parts = [];

    if (scrolled) parts.push("scrolled");

    return parts.join(" ");

  }, [scrolled]);



  const closeMenu = useCallback(() => setMenuOpen(false), []);



  useEffect(() => {

    const onScroll = () => setScrolled(window.scrollY > 60);

    window.addEventListener("scroll", onScroll, { passive: true });

    onScroll();

    return () => window.removeEventListener("scroll", onScroll);

  }, []);



  return (

    <>

      <nav id="navbar" className={navClassName}>

        <div className="nav-logo">

        <Image

          src={logo}

          alt="Legacy Global Bank"

          width={500}

          height={500}

          priority

          unoptimized

          style={{

            height: 120,

            width: "auto",

            filter: "drop-shadow(0 0 10px rgba(255,215,0,0.5))",

          }}

        />

        </div>

        <button

        type="button"

        id="mobile-menu-btn"

        className={menuOpen ? "active" : ""}

        aria-label="Toggle Menu"

        aria-expanded={menuOpen}

        onClick={() => setMenuOpen((o) => !o)}

      >

        <span className="bar" />

        <span className="bar" />

        <span className="bar" />

        </button>

        <ul className={`nav-links${menuOpen ? " active" : ""}`}>

        <li>

          <Link href="/" onClick={closeMenu} className={isActiveLink("/") ? "active" : ""}>

            Home

          </Link>

        </li>

        <li>

          <Link href="/why-us" onClick={closeMenu} className={isActiveLink("/why-us") ? "active" : ""}>

            Why Us

          </Link>

        </li>



        <li>

          <Link href="/accounts" onClick={closeMenu} className={isActiveLink("/accounts") ? "active" : ""}>

            Accounts

          </Link>

        </li>

        <li>

          <Link href="/market" onClick={closeMenu} className={isActiveLink("/market") ? "active" : ""}>

            Market

          </Link>

        </li>

        <li>

          <Link href="/downloads" onClick={closeMenu} className={isActiveLink("/contact") ? "active" : ""}>

            Downloads

          </Link>

        </li>

        <li>

          <Link href="/education" onClick={closeMenu}>

            Education

          </Link>

        </li>

        <li>

          <Link href="/calculators" onClick={closeMenu}>

            Calculators

          </Link>

        </li>

        <li>

          <Link href="/partnership" onClick={closeMenu} className={isActiveLink("/partnership") ? "active" : ""}>

            Partnership

          </Link>

        </li>

        <li>

          <Link href="/contact" onClick={closeMenu}>

            Contact

          </Link>

        </li>

        <li className="mobile-only-cta">

          <a href={PANEL_URL} className="btn-outline">

            Login

          </a>

          <a href={PANEL_URL_REGISTER} className="btn-gold">

            Start Trading

          </a>

        </li>

        </ul>

        <div className="nav-ctas">

        <a href={PANEL_URL} className="btn-outline">

          Login

        </a>

        <a href={PANEL_URL_REGISTER} className="btn-gold">

          Start Trading

        </a>

        </div>

      </nav>

    </>

  );

}


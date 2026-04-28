"use client";



import Image from "next/image";

import Link from "next/link";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { usePathname } from "next/navigation";

import { PANEL_URL, PANEL_URL_REGISTER } from "@/lib/constants";

import logo from "./logo.svg";



export function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const [introPhase, setIntroPhase] = useState<"enter" | "move" | "done">("enter");

  const pathname = usePathname();

  const isHomePage = pathname === "/";



  const isActiveLink = (path: string) => pathname === path;



  const logoRef = useRef<HTMLDivElement | null>(null);

  const [introTransform, setIntroTransform] = useState({ dx: 0, dy: 0, scale: 1 });



  const navClassName = useMemo(() => {

    const parts = [];

    if (scrolled) parts.push("scrolled");

    if (introPhase !== "done") parts.push("intro-running");

    return parts.join(" ");

  }, [introPhase, scrolled]);



  const closeMenu = useCallback(() => setMenuOpen(false), []);



  useEffect(() => {

    const onScroll = () => setScrolled(window.scrollY > 60);

    window.addEventListener("scroll", onScroll, { passive: true });

    onScroll();

    return () => window.removeEventListener("scroll", onScroll);

  }, []);



  useLayoutEffect(() => {

    if (introPhase === "done") return;



    const compute = () => {

      const el = logoRef.current;

      if (!el) return;



      const rect = el.getBoundingClientRect();

      const targetX = rect.left + rect.width / 2;

      const targetY = rect.top + rect.height / 2;



      const centerX = window.innerWidth / 2;

      const centerY = window.innerHeight / 2;



      const dx = targetX - centerX;

      const dy = targetY - centerY;



      const introHeight = 240;

      const targetHeight = rect.height || 120;

      const scale = targetHeight / introHeight;



      setIntroTransform({ dx, dy, scale });

    };



    compute();

    window.addEventListener("resize", compute);

    return () => window.removeEventListener("resize", compute);

  }, [introPhase]);



  useEffect(() => {

    // Check if animation has already played

    const hasPlayed = localStorage.getItem("navbarLogoAnimationPlayed");

    

    if (hasPlayed) {

      // Skip animation if already played

      setIntroPhase("done");

      return;

    }



    if (introPhase !== "enter") return;



    const t = window.setTimeout(() => {

      setIntroPhase("move");

      // Mark animation as played in localStorage

      localStorage.setItem("navbarLogoAnimationPlayed", "true");

    }, 1500);

    return () => window.clearTimeout(t);

  }, [introPhase]);



  return (

    <>

      {introPhase !== "done" && (

        <div className={`intro-overlay${introPhase === "move" ? " is-moving" : ""}`}>

          <div

            className="intro-logo"

            style={

              introPhase === "move"

                ? {

                    transform: `translate(calc(-50% + ${introTransform.dx}px), calc(-50% + ${introTransform.dy}px)) scale(${introTransform.scale})`,

                  }

                : undefined

            }

            onTransitionEnd={(e) => {

              if (e.propertyName !== "transform") return;

              setIntroPhase("done");

            }}

          >

            <Image

              src={logo}

              alt="Legacy Global Bank"

              width={800}

              height={800}

              priority

              unoptimized

              style={{

                height: 240,

                width: "auto",

                filter: "drop-shadow(0 0 18px rgba(255,215,0,0.55))",

              }}

            />

          </div>

        </div>

      )}



      <nav id="navbar" className={navClassName}>

        <div className="nav-logo" ref={logoRef}>

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


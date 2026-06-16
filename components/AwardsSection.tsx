"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Award {
  year: number;
  title: string;
  issuer: string;
  image: string;
  imageAlt: string;
}

const awards: Award[] = [
  // {
  //   year: 2025,
  //   title: "Best Multi-Asset Trading Platform",
  //   issuer: "FxDailyInfo, 2025",
  //   image: "/award1.jpeg",
  //   imageAlt: "FxDailyInfo Award",
  // },
  {
    year: 2025,
    title: "Excellence in Customer Support",
    issuer: "International Business Magazine, 2025",
    image: "/customersupport.jpeg",
    imageAlt: "International Business Magazine Award",
  },
  {
    year: 2024,
    title: "Most Transparent Broker",
    issuer: "World Finance Magazine, 2024",
    image: "/transpraent.jpeg",
    imageAlt: "World Finance Award",
  },
  {
    year: 2024,
    title: "Most Trusted Forex Broker",
    issuer: "World Business Outlook, 2024",
    image: "/trusted4.jpeg",
    imageAlt: "World Business Outlook Award",
  },
];

// Group awards by year
function groupByYear(items: Award[]) {
  const map: Record<number, Award[]> = {};
  for (const award of items) {
    if (!map[award.year]) map[award.year] = [];
    map[award.year].push(award);
  }
  // Sort years descending
  return Object.entries(map)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, list]) => ({ year: Number(year), list }));
}

export function AwardsSection() {
  const grouped = groupByYear(awards);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  useEffect(() => {
    const elements = document.querySelectorAll(".awards-year-group");
    
    // Set initial active year
    if (elements.length > 0) {
      const firstYear = Number(elements[0].getAttribute("data-year"));
      setActiveYear(firstYear);
    }

    const handleScroll = () => {
      let currentActive: number | null = null;
      // Define a responsive trigger offset: a fraction of the viewport height.
      const triggerOffset = Math.round(window.innerHeight * 0.40); // 35% of viewport height

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerOffset) {
          currentActive = Number(el.getAttribute("data-year"));
        }
      });

      if (currentActive !== null) {
        setActiveYear(currentActive);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once initially
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section id="awards" className="awards-section">
      <div className="awards-inner">
        {grouped.map(({ year, list }, gi) => (
          <div key={year} className="awards-year-group" data-year={year}>
            <div className={`awards-year-label ${activeYear === year ? "awards-year-label--active" : ""}`}>
              {year}
            </div>
            <div className="awards-cards-row">
              {list.map((award, i) => (
                <div
                  key={i}
                  className="award-card"
                  style={{ animationDelay: `${gi * 0.15 + i * 0.1}s` }}
                >
                  <div className="award-card-header">
                    <h3 className="award-card-title">{award.title}</h3>
                    <p className="award-card-issuer">{award.issuer}</p>
                  </div>
                  <div className="award-card-image-wrap">
                    <Image
                      src={award.image}
                      alt={award.imageAlt}
                      width={320}
                      height={220}
                      className="award-card-image"
                      priority={gi === 0}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

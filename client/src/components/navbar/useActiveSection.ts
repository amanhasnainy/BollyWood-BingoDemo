import { useEffect, useState } from "react";
import { navLinks } from "./navbarData";

export function useActiveSection() {
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    const sectionIds = navLinks
      .map((link) => link.sectionId)
      .filter((id): id is string => id !== null);

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );

    elements.forEach((element) => observer.observe(element));

    const onScroll = () => {
      if (window.scrollY < 120) setActiveId("home");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return activeId;
}

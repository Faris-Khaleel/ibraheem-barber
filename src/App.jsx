import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  List,
  Phone,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";
import { CutRitual } from "./CutRitual";
import { DubaiMeridian } from "./DubaiMeridian";
import { siteConfig } from "./siteConfig";

const smallImage = (src) => src.replace(".webp", "-sm.webp");

const navItems = [
  ["Work", "#work"],
  ["Services", "#services"],
  ["About", "#about"],
  ["Contact", "#contact"],
];

function usePageMotion() {
  const [scrolled, setScrolled] = useState(false);
  const [heroOffset, setHeroOffset] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 32);
        setHeroOffset(Math.min(y * 0.08, 64));
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { scrolled, heroOffset };
}

function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll("[data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.setAttribute("data-visible", "true"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12%", threshold: 0.08 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function BookingLink({ children, className = "", icon = false, ariaLabel }) {
  const isConfigured = Boolean(siteConfig.whatsappNumber);
  const href = isConfigured ? siteConfig.whatsappUrl : "#contact";
  return (
    <a
      className={className}
      href={href}
      aria-label={ariaLabel || "Book with Ibraheem on WhatsApp"}
      target={isConfigured ? "_blank" : undefined}
      rel={isConfigured ? "noreferrer" : undefined}
      data-contact-placeholder={!isConfigured ? "true" : undefined}
    >
      {icon && <WhatsappLogo weight="fill" aria-hidden="true" />}
      {children}
    </a>
  );
}

function Navbar({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <a className="wordmark" href="#top" aria-label="Ibraheem home">
        {siteConfig.name}
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map(([label, href]) => (
          <a href={href} key={href}>{label}</a>
        ))}
        <BookingLink className="nav-book">Book / WhatsApp</BookingLink>
      </nav>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={24} /> : <List size={26} />}
      </button>
      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`} id="mobile-menu">
        <nav aria-label="Mobile navigation">
          {navItems.map(([label, href], index) => (
            <a href={href} key={href} onClick={() => setMenuOpen(false)}>
              <span>0{index + 1}</span>{label}
            </a>
          ))}
        </nav>
        <BookingLink className="button button--cream" icon>Book on WhatsApp</BookingLink>
        <p>{siteConfig.role} — {siteConfig.location}</p>
      </div>
    </header>
  );
}

function Hero({ offset }) {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__rail">
        <div className="hero__copy hero-reveal">
          <p className="hero__statement">Precision.<br />Style.<br />Identity.</p>
          <p className="eyebrow">{siteConfig.role} — {siteConfig.location}</p>
          <BookingLink className="button button--sand">Book on WhatsApp</BookingLink>
        </div>
        <a className="scroll-cue" href="#work">
          <ArrowDown size={24} aria-hidden="true" />
          <span>Scroll to discover</span>
        </a>
      </div>
      <div className="hero__media" style={{ "--hero-offset": `${offset}px` }}>
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={siteConfig.images.hero}
          aria-hidden="true"
        >
          <source src={siteConfig.images.heroVideo} type="video/mp4" />
        </video>
        <img
          className="hero__poster"
          src={siteConfig.images.hero}
          srcSet={`${smallImage(siteConfig.images.hero)} 720w, ${siteConfig.images.hero} 2048w`}
          sizes="100vw"
          alt="Precision fade being shaped with clippers"
          width="1280"
          height="720"
          fetchPriority="high"
        />
        <div className="hero__shade" />
      </div>
      <h1 className="hero__name" id="hero-title" aria-label="Ibraheem">
        {siteConfig.name}
      </h1>
      <div className="hero__index" aria-hidden="true">DXB — 25.20° N</div>
    </section>
  );
}

function WorkGallery() {
  return (
    <section className="work section-dark" id="work" aria-labelledby="work-title">
      <div className="section-kicker" data-reveal>
        <span>01</span>
        <h2 id="work-title">Selected work</h2>
        <p>A study in shape, texture, and finish.</p>
      </div>
      <div className="work-grid">
        {siteConfig.work.map((item, index) => (
          <figure className={`work-card work-card--${index + 1}`} key={item.src} data-reveal>
            <div className="work-card__image">
              <img
                src={item.src}
                srcSet={`${smallImage(item.src)} 720w, ${item.src} ${item.width}w`}
                sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 40vw"
                alt={item.alt}
                loading="lazy"
                width={item.width}
                height={item.height}
              />
            </div>
            <figcaption><span>0{index + 1}</span>{item.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="services" id="services" aria-labelledby="services-title">
      <div className="sr-only">
        <h2 id="services-title">Services</h2>
      </div>
      {siteConfig.services.map((service, index) => (
        <a className="service-row" href="#contact" key={service} data-reveal>
          <span className="service-row__number">0{index + 1}</span>
          <span className="service-row__name">{service}</span>
          <ArrowRight className="service-row__arrow" size={52} weight="thin" aria-hidden="true" />
        </a>
      ))}
    </section>
  );
}

function About() {
  return (
    <section className="about section-dark" id="about" aria-labelledby="about-title">
      <div className="about__image" data-reveal>
        <img
          src={siteConfig.images.portrait}
          srcSet={`${smallImage(siteConfig.images.portrait)} 720w, ${siteConfig.images.portrait} 1536w`}
          sizes="(max-width: 700px) 100vw, 54vw"
          alt="Portrait of Ibraheem in his barber studio"
          loading="lazy"
          width="1086"
          height="1448"
        />
        <span>Personal craft / individual finish</span>
      </div>
      <div className="about__content" data-reveal>
        <p className="eyebrow">Meet /</p>
        <h2 id="about-title">Ibraheem</h2>
        <p className="about__role">{siteConfig.role}<br />{siteConfig.location}</p>
        <p className="about__body">{siteConfig.about}</p>
        <BookingLink className="text-link">Book a cut <ArrowRight size={22} /></BookingLink>
      </div>
    </section>
  );
}

function ImageBreak() {
  return (
    <section className="image-break" aria-label="The details make the difference">
      <img
        src={siteConfig.images.detail}
        srcSet={`${smallImage(siteConfig.images.detail)} 720w, ${siteConfig.images.detail} 2048w`}
        sizes="100vw"
        alt="Close-up precision clipper work"
        loading="lazy"
        width="2048"
        height="1152"
      />
      <div className="image-break__shade" />
      <p data-reveal>The details<br />make the difference.</p>
      <span aria-hidden="true">02 — CRAFT</span>
    </section>
  );
}

function Contact() {
  const phoneConfigured = Boolean(siteConfig.phoneNumber);
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="contact__title" data-reveal>
        <p className="eyebrow">Personal Barber — UAE</p>
        <h2 id="contact-title">Based in<br />Dubai.</h2>
      </div>
      <div className="contact__actions" data-reveal>
        <p>Ready when you are.</p>
        <BookingLink className="contact-link" icon>
          <span>WhatsApp Ibraheem</span>
          <ArrowRight size={34} weight="thin" />
        </BookingLink>
        {phoneConfigured ? (
          <a className="contact-link contact-link--phone" href={`tel:${siteConfig.phoneNumber}`}>
            <Phone size={28} />
            <span>{siteConfig.phoneDisplay}</span>
          </a>
        ) : (
          <div className="contact-link contact-link--phone" aria-label="Phone number placeholder">
            <Phone size={28} />
            <span>{siteConfig.phoneDisplay}</span>
          </div>
        )}
        {!siteConfig.whatsappNumber && (
          <p className="contact__note">Contact details are ready to connect when the final number is supplied.</p>
        )}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="final-cta section-dark" aria-labelledby="final-title">
      <div data-reveal>
        <p className="eyebrow">Dubai, UAE</p>
        <h2 id="final-title">Ready for<br />a fresh cut?</h2>
      </div>
      <BookingLink className="button button--sand button--large">Book with Ibraheem</BookingLink>
    </section>
  );
}

function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  return (
    <footer className="footer section-dark">
      <a className="wordmark" href="#top">{siteConfig.name}</a>
      <p>{siteConfig.role} — {siteConfig.location}</p>
      <p>© {year} {siteConfig.name}</p>
    </footer>
  );
}

export function App() {
  const { scrolled, heroOffset } = usePageMotion();
  useReveal();

  return (
    <>
      <Navbar scrolled={scrolled} />
      <main>
        <Hero offset={heroOffset} />
        <WorkGallery />
        <CutRitual />
        <DubaiMeridian />
        <Services />
        <About />
        <ImageBreak />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
      <BookingLink className={`mobile-book ${scrolled ? "is-visible" : ""}`} icon>
        Book on WhatsApp
      </BookingLink>
    </>
  );
}

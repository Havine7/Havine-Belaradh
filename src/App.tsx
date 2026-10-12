import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Menu,
  X,
  Smartphone,
  Sparkles,
  Globe,
  ChevronDown,
} from "lucide-react";
import { demos, demoKey, plans, type DemoKey } from "./content";
const photo = (id: string, _width = 1200) => {
  const images: Record<string, string> = {
    "photo-1509440159596-0249088772ff": "/images/boulangerie.svg",
    "photo-1562322140-8baeececf3df": "/images/coiffure.svg",
    "photo-1620626011761-996317b8d101": "/images/plombier.svg",
  };
  return images[id];
};
function useReveal() {
  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-pending");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    const elements = document.querySelectorAll(
      ".section-heading, .service, .project, .price-card, .about, .faq, .contact",
    );
    elements.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add("reveal-pending");
        observer.observe(el);
      }
    });
    return () => {
      observer.disconnect();
      elements.forEach((el) => el.classList.remove("reveal-pending"));
    };
  }, []);
}
function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        document.querySelector<HTMLButtonElement>(".menu")?.focus();
      }
    };
    if (open) window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="header">
      <a className="brand" href="/" aria-label="Havine Belaradh, accueil">
        havine<span>.</span>
      </a>
      <nav
        id="navigation-principale"
        aria-label="Navigation principale"
        className={open ? "nav open" : "nav"}
      >
        <a onClick={() => setOpen(false)} href="#services">
          Services
        </a>
        <a onClick={() => setOpen(false)} href="#realisations">
          Réalisations
        </a>
        <a onClick={() => setOpen(false)} href="#tarifs">
          Tarifs
        </a>
        <a onClick={() => setOpen(false)} href="#apropos">
          À propos
        </a>
        <a
          onClick={() => setOpen(false)}
          className="button small"
          href="#contact"
        >
          Demander mon site <ArrowUpRight size={16} />
        </a>
      </nav>
      <button
        className="menu"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        aria-controls="navigation-principale"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
function Contact() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT?.trim();
  const enabled = Boolean(endpoint && /^https:\/\//.test(endpoint));
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!enabled) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return;
    setStatus("sending");
    try {
      const response = await fetch(endpoint!, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Envoi impossible");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }
  return (
    <section id="contact" className="contact section">
      <div>
        <span className="eyebrow">ET SI ON EN PARLAIT ?</span>
        <h2>
          Et si l’on créait
          <br />
          <em>le vôtre ?</em>
        </h2>
        <p>
          Présentez-moi votre activité et vos envies.
          <br />
          Nous définirons ensemble une solution adaptée.
        </p>
        <div className="contact-note">
          <span className="dot" />
          Un échange simple, sans engagement.
        </div>
      </div>
      <form onSubmit={submit}>
        <div className="form-row">
          <label>
            Votre nom
            <input
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              placeholder="Camille Martin"
            />
          </label>
          <label>
            Votre adresse e-mail
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={200}
              placeholder="camille@exemple.fr"
            />
          </label>
        </div>
        <label>
          Votre activité
          <input
            name="activity"
            maxLength={150}
            placeholder="Boulangerie, salon, artisan…"
          />
        </label>
        <label>
          Votre projet
          <select name="pack" defaultValue="">
            <option value="">Je souhaite être conseillé</option>
            {plans.map((p) => (
              <option key={p.name}>
                {p.name} — {p.price} €
              </option>
            ))}
          </select>
        </label>
        <label>
          Quelques mots sur vos besoins
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={4}
            placeholder="Parlez-moi de votre projet, de vos objectifs et de votre calendrier."
          />
        </label>
        <label className="honeypot" aria-hidden="true">
          Site web
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <label className="consent">
          <input type="checkbox" required />
          J’accepte que ces informations soient utilisées pour répondre à ma
          demande.
        </label>
        <p className="form-info">
          {enabled
            ? "Vos données sont transmises au service de formulaire configuré, uniquement pour traiter votre demande."
            : "Le formulaire sera activé après configuration du service de réception. Aucun message ne peut être envoyé actuellement."}
        </p>
        <button className="button" disabled={!enabled || status === "sending"}>
          {status === "sending" ? "Envoi en cours…" : "Envoyer ma demande"}
          <ArrowUpRight size={18} />
        </button>
        <p role="status" aria-live="polite">
          {status === "success"
            ? "Votre demande a bien été envoyée. Merci !"
            : status === "error"
              ? "L’envoi a échoué. Vérifiez votre connexion et réessayez."
              : ""}
        </p>
      </form>
    </section>
  );
}
function Portfolio() {
  useReveal();
  return (
    <div className="portfolio">
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <Header />
      <main id="contenu">
        <section className="hero">
          <div className="hero-topline">
            <span>HAVINE BELARADH — DESIGN & DÉVELOPPEMENT WEB</span>
            <span>Portfolio / 2026</span>
          </div>
          <div className="hero-copy">
            <h1>
              Le beau au service
              <br />
              de votre <span className="serif accent">ambition.</span>
            </h1>
            <div className="hero-bottom-row">
              <div className="hero-index" aria-hidden="true">
                (01 — 06)
              </div>
              <div className="hero-intro">
                <p>
                  Des sites vitrines pensés pour les commerçants, les artisans
                  et les petites entreprises. Une présence juste, soignée, à
                  votre image.
                </p>
                <div className="hero-actions">
                  <a className="button" href="#contact">
                    Demander mon site <ArrowUpRight size={18} />
                  </a>
                  <a className="text-link" href="#realisations">
                    Explorer les projets <ArrowRight size={17} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-editorial" aria-hidden="true">
            <span>Le sens du détail.</span>
            <div className="editorial-mark">
              h<span>.</span>
            </div>
            <span>Des idées aux pixels.</span>
          </div>
        </section>
        <div className="trust-strip">
          <span>UNE PRÉSENCE WEB À VOTRE IMAGE</span>
          <span>Commerçants</span>
          <span>Artisans</span>
          <span>Indépendants</span>
          <span>Petites entreprises</span>
        </div>
        <section id="services" className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">CE QUE JE FAIS</span>
              <h2>
                Votre métier,
                <br />
                <em>sa vitrine.</em>
              </h2>
            </div>
            <p>
              Un site vitrine pour présenter votre activité, vos services et vos
              coordonnées. Une conception attentive, du contenu à la navigation.
            </p>
          </div>
          <div className="service-grid">
            {[
              {
                icon: Globe,
                title: "Un site à votre image",
                text: "Une identité soignée et une présentation claire de votre activité, pour donner une belle première impression.",
              },
              {
                icon: Smartphone,
                title: "À l’aise sur tous les écrans",
                text: "Une expérience fluide sur mobile, tablette et ordinateur. Vos clients vous découvrent où qu’ils soient.",
              },
              {
                icon: Sparkles,
                title: "Simple, jusque dans les détails",
                text: "Des pages légères, une navigation intuitive et les informations utiles toujours à portée de main.",
              },
            ].map((s, i) => (
              <article className="service" key={s.title}>
                <span className="service-icon">
                  <s.icon size={23} />
                </span>
                <span className="number">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="realisations" className="section projects">
          <div className="section-heading">
            <div>
              <span className="eyebrow">UNE IDÉE DU POSSIBLE</span>
              <h2>
                Trois métiers.
                <br />
                <em>Trois signatures.</em>
              </h2>
            </div>
            <p>
              Des projets fictifs, de véritables sites à explorer.
              <br />
              Imaginez maintenant le vôtre.
            </p>
          </div>
          <div className="project-grid">
            {Object.entries(demos).map(([key, d], i) => (
              <a
                className={`project ${d.color}`}
                href={`/demos/${key}`}
                key={key}
              >
                <div className="project-description">
                  <span className="project-count">/ 0{i + 1}</span>
                  <span className="eyebrow">{d.type}</span>
                  <h3>{d.name}</h3>
                  <p>
                    {i === 0
                      ? "Un univers chaleureux, où le savoir-faire artisanal prend toute sa place."
                      : i === 1
                        ? "Une parenthèse douce, une identité élégante et un parcours tout en simplicité."
                        : "Une présentation structurée pour découvrir les services et comprendre la démarche."}
                  </p>
                  <span className="project-visit">
                    Explorer la démonstration <ArrowUpRight size={20} />
                  </span>
                  <span className="project-fiction">
                    Projet fictif — site interactif
                  </span>
                </div>
                <div className="project-image">
                  <div className="preview-bar">
                    <span>{d.name}</span>
                    <span>Site de démonstration ↗</span>
                  </div>
                  <div className="preview-content">
                    <div className="preview-copy">
                      <span>{d.eyebrow}</span>
                      <h4>{d.title}</h4>
                      <span className="preview-cta">{d.action} ↗</span>
                    </div>
                    <img
                      loading="lazy"
                      decoding="async"
                      width="900"
                      height="1050"
                      sizes="(max-width: 640px) 48vw, (max-width: 900px) 38vw, 360px"
                      srcSet={`${photo(d.image, 400)} 400w, ${photo(d.image, 700)} 700w, ${photo(d.image, 1000)} 1000w`}
                      src={photo(d.image, 700)}
                      alt={
                        i === 0
                          ? "Illustration originale de pains artisanaux"
                          : i === 1
                            ? "Illustration originale d’un salon de coiffure"
                            : "Illustration originale d’une salle de bain"
                      }
                    />
                  </div>
                  <div className="preview-footer">
                    <span>{d.type}</span>
                    <span>Une démonstration signée havine.</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
        <section id="tarifs" className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">DES OFFRES TRANSPARENTES</span>
              <h2>
                Le bon point
                <br />
                <em>de départ.</em>
              </h2>
            </div>
            <p>
              Choisissez le point de départ qui vous correspond.
              <br />
              Le périmètre est confirmé avant toute réalisation.
            </p>
          </div>
          <div className="pricing-grid">
            {plans.map((p, i) => (
              <article
                className={`price-card ${i === 1 ? "featured" : ""}`}
                key={p.name}
              >
                {i === 1 && (
                  <span className="recommended">LE JUSTE ÉQUILIBRE</span>
                )}
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <div className="price">
                  {p.price} <span>€</span>
                  <small>pour la création du site</small>
                </div>
                <a
                  className={i === 1 ? "button" : "button outline"}
                  href={`#contact`}
                  onClick={() => {
                    const s = document.querySelector<HTMLSelectElement>(
                      'select[name="pack"]',
                    );
                    if (s) s.value = `${p.name} — ${p.price} €`;
                  }}
                >
                  Choisir ce pack <ArrowUpRight size={17} />
                </a>
                <ul>
                  {p.features.map((f) => (
                    <li key={f}>
                      <Check size={16} />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="limit">{p.limit}</p>
              </article>
            ))}
          </div>
          <p className="pricing-note">
            Tarifs de création, paiement unique. Textes et images fournis par le
            client. Nom de domaine, hébergement payant, abonnements tiers,
            maintenance et modifications après livraison non inclus. Statut
            fiscal et conditions de facturation précisés dans le devis.
          </p>
        </section>
        <section className="section about" id="apropos">
          <div className="about-art">
            <div className="monogram">
              h<span>.</span>
            </div>
            <div className="about-label">Curiosité. Rigueur. Créativité.</div>
          </div>
          <div>
            <span className="eyebrow">DERRIÈRE LES PIXELS</span>
            <h2>
              Bonjour,
              <br />
              moi c’est <span className="serif accent">Havine.</span>
            </h2>
            <p>
              Je m’appelle Havine Belaradh et je suis étudiant en deuxième année
              de Licence Informatique.
            </p>
            <p>
              J’aime transformer des idées en expériences web simples et
              soignées. Mon objectif : rendre une présence en ligne
              professionnelle accessible aux entreprises de proximité.
            </p>
            <div className="skills">
              <span>React</span>
              <span>TypeScript</span>
              <span>Tailwind CSS</span>
              <span>Vite</span>
            </div>
          </div>
        </section>
        <section className="section faq">
          <span className="eyebrow">LES QUESTIONS UTILES</span>
          <h2>Avant de se lancer.</h2>
          {[
            [
              "Comment se déroule un projet ?",
              "Nous échangeons sur votre activité, validons le périmètre et vos contenus, puis je réalise le site. Les retours inclus dans votre pack permettent d’affiner le résultat avant livraison.",
            ],
            [
              "Quel est le délai de réalisation ?",
              "Le calendrier dépend du nombre de pages et de la disponibilité des contenus. Une date est convenue dans le devis avant le début du projet.",
            ],
            [
              "Pourrai-je modifier mon site ?",
              "Vous recevez les fichiers du projet. Les offres n’incluent pas de tableau de bord d’édition : les modifications de contenu nécessitent une intervention sur les fichiers ou une prestation complémentaire.",
            ],
            [
              "Le nom de domaine et l’hébergement sont-ils inclus ?",
              "Non. Nous choisissons une solution adaptée à votre projet. Les frais éventuels de domaine, d’hébergement et de services externes restent à votre charge.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <ChevronDown size={19} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
        <Contact />
      </main>
      <footer className="footer">
        <a className="brand" href="/">
          havine<span>.</span>
        </a>
        <span>© {new Date().getFullYear()} Havine Belaradh</span>
        <a href="/confidentialite">Confidentialité & informations</a>
        <a href="#">Retour en haut ↑</a>
      </footer>
    </div>
  );
}
function Demo({ id }: { id: DemoKey }) {
  const d = demos[id];
  const [notice, setNotice] = useState("");
  useEffect(() => {
    document.title = `${d.name} — Démonstration fictive | Havine Belaradh`;
  }, [d]);
  return (
    <div className={`demo ${d.color}`}>
      <div className="demo-banner">
        <a href="/">← Retour au portfolio</a>
        <span>Projet fictif · Aucun service réel</span>
      </div>
      <header className="demo-header">
        <a href="#" className="demo-logo">
          {d.name}
          <small>{d.type}</small>
        </a>
        <nav aria-label="Navigation du site de démonstration">
          <a href="#prestations">
            {id === "boulangerie" ? "Nos produits" : "Prestations"}
          </a>
          <a href="#maison">À propos</a>
          <a className="demo-button" href="#demande">
            {id === "coiffure"
              ? "Réserver"
              : id === "plombier"
                ? "Demander un devis"
                : "Nous rendre visite"}
          </a>
        </nav>
      </header>
      <main>
        <section className="demo-hero">
          <div>
            <span className="eyebrow">{d.eyebrow}</span>
            <h1>{d.title}</h1>
            <p>{d.intro}</p>
            <a href="#prestations" className="demo-button">
              {d.action}
              <ArrowRight size={18} />
            </a>
          </div>
          <img
            src={photo(d.image)}
            alt={
              d.type === "Boulangerie artisanale"
                ? "Sélection de pains artisanaux"
                : d.type === "Salon de coiffure"
                  ? "Salon de coiffure"
                  : "Salle de bain et installation sanitaire"
            }
          />
        </section>
        <section id="prestations" className="demo-section">
          <span className="eyebrow">
            {id === "boulangerie" ? "FAIT AVEC SOIN" : "À VOTRE SERVICE"}
          </span>
          <h2>
            {id === "boulangerie"
              ? "Nos douceurs du quotidien"
              : "Des prestations pensées pour vous"}
          </h2>
          <div className="demo-cards">
            {d.items.map(([title, text, price]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
                <strong>{price}</strong>
                <a href="#demande">
                  {id === "boulangerie"
                    ? "Informations pratiques"
                    : "Faire une demande"}{" "}
                  <ArrowUpRight size={17} />
                </a>
              </article>
            ))}
          </div>
          <p className="demo-disclaimer">
            Prestations et tarifs illustratifs. Ce site présente une entreprise
            fictive.
          </p>
        </section>
        <section className="demo-about demo-section" id="maison">
          <h2>{d.section}</h2>
          <div>
            <p>{d.about}</p>
            <p>
              Une démonstration créée par Havine Belaradh pour illustrer les
              possibilités d’un site vitrine.
            </p>
          </div>
        </section>
        <section className="demo-section demo-contact" id="demande">
          <div>
            <span className="eyebrow">INFORMATIONS PRATIQUES</span>
            <h2>
              {id === "boulangerie"
                ? "La porte est ouverte."
                : "Parlons de vos envies."}
            </h2>
            <p>{d.hours}</p>
            <p>{d.address}</p>
            <p className="demo-disclaimer">
              Adresse et horaires fictifs. Aucun appel, réservation ou devis
              réel.
            </p>
          </div>
          {id === "boulangerie" ? (
            <div className="visit-card">
              <h3>Du pain frais, chaque matin.</h3>
              <p>
                Cette vitrine de démonstration vous plaît ? Discutons d’un site
                pour votre commerce.
              </p>
              <a className="demo-button" href="/#contact">
                Contacter Havine <ArrowUpRight size={18} />
              </a>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setNotice(
                  "Demande de démonstration validée. Rien n’a été envoyé et aucune réservation n’a été effectuée.",
                );
                e.currentTarget.reset();
              }}
            >
              <label>
                Votre nom
                <input required name="name" autoComplete="name" />
              </label>
              <label>
                E-mail
                <input
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                />
              </label>
              {id === "coiffure" && (
                <label>
                  Date souhaitée
                  <input
                    required
                    name="date"
                    type="date"
                    min={new Date().toLocaleDateString("en-CA")}
                  />
                </label>
              )}
              <label>
                {id === "coiffure" ? "Prestation souhaitée" : "Votre besoin"}
                <select required name="service">
                  <option value="">Choisir une prestation</option>
                  {d.items.map((i) => (
                    <option key={i[0]}>{i[0]}</option>
                  ))}
                </select>
              </label>
              <label>
                Message
                <textarea name="message" required rows={3} />
              </label>
              <button className="demo-button">
                Tester la demande <ArrowRight size={18} />
              </button>
              <p className="demo-disclaimer">
                Formulaire de démonstration : aucune donnée transmise.
              </p>
              <p role="status" aria-live="polite">
                {notice}
              </p>
            </form>
          )}
        </section>
      </main>
      <footer className="demo-footer">
        <span>{d.name} · Projet fictif</span>
        <a href="/">Un site signé Havine Belaradh ↗</a>
      </footer>
    </div>
  );
}
function Privacy() {
  return (
    <div className="legal">
      <a href="/">← Retour au portfolio</a>
      <h1>Confidentialité & informations</h1>
      <h2>Responsable du portfolio</h2>
      <p>
        Havine Belaradh, étudiant en deuxième année de Licence Informatique. Ce
        portfolio présente son activité de création de sites web et trois
        projets fictifs.
      </p>
      <h2>Formulaire de contact</h2>
      <p>
        Le formulaire est inactif tant que le service de réception n’est pas
        configuré. Une fois activé, votre nom, votre adresse e-mail et votre
        message sont transmis au prestataire configuré pour répondre à votre
        demande. Aucun usage publicitaire n’est prévu. Les coordonnées
        permettant l’exercice des droits, le prestataire et la durée de
        conservation doivent être complétés avant activation publique.
      </p>
      <h2>Images et données techniques</h2>
      <p>
        Les illustrations originales et les polices sont hébergées avec ce site.
        Aucun chargement depuis Unsplash ou Google Fonts n’est effectué. Aucun
        outil d’analyse ni cookie publicitaire n’est installé par ce site.
        L’hébergeur et le prestataire de formulaire peuvent traiter des données
        techniques selon leurs propres politiques.
      </p>
      <h2>Informations à compléter avant publication commerciale</h2>
      <p>
        Adresse professionnelle, contact direct, statut juridique, identifiants
        légaux applicables, identité et coordonnées de l’hébergeur, conditions
        de vente et régime fiscal. Ces informations n’ont pas été inventées.
      </p>
    </div>
  );
}
export default function App() {
  const path = window.location.pathname;
  const id = demoKey(path);
  if (id) return <Demo id={id} />;
  if (path === "/confidentialite") return <Privacy />;
  if (path !== "/" && path !== "/index.html")
    return (
      <div className="legal">
        <h1>Page introuvable</h1>
        <a href="/">Retour au portfolio</a>
      </div>
    );
  return <Portfolio />;
}

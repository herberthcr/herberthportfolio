'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CVData, Experience, Project } from '@/types/cv';

type Lang = 'en' | 'es';
type Theme = 'paper' | 'ink' | 'midnight';
type TypePairing = 'editorial' | 'mono-first' | 'all-sans';
type DisplayFont = 'fraunces' | 'sourceserif' | 'crimson' | 'instrument' | 'inter';

const UI: Record<Lang, {
  experience: string; roles: (n: number) => string;
  projects: string; projectsAside: string;
  education: string; languages: string;
  skills: string; skillsCols: [string, string, string];
  filter: string; tagsLabel: (n: number) => string;
  all: string;
  downloadPdf: string; getInTouch: string;
  basedLabel: string; experienceLabel: string; contactLabel: string;
  yearsSuffix: (n: number) => string;
  featured: string; visitProject: string; personal: string;
  sideWork: string;
  admin: string; printPdf: string;
  madeBy: string;
  themeLabel: string; typographyLabel: string; displayFontLabel: string;
  themes: Record<Theme, string>;
  types: Record<TypePairing, string>;
  darkModeLabel: string; lightModeLabel: string;
  roleSeparator: string;
}> = {
  en: {
    experience: 'Professional experience.',
    roles: (n) => `${n} roles`,
    projects: 'Selected projects.',
    projectsAside: 'Side work & experiments',
    education: 'Education.',
    languages: 'Languages.',
    skills: 'Skills & tools.',
    skillsCols: ['Programming', 'Game & Creative tech', 'Product & Leadership'],
    filter: 'Filter by technology',
    tagsLabel: (n) => `· ${n} tags`,
    all: 'All',
    downloadPdf: '↓ download pdf',
    getInTouch: '✉ get in touch',
    basedLabel: 'Based',
    experienceLabel: 'Experience',
    contactLabel: 'Contact',
    yearsSuffix: (n) => `${n} years`,
    featured: 'Featured',
    visitProject: 'visit project →',
    personal: 'Personal',
    sideWork: 'Side work & experiments',
    admin: 'admin',
    printPdf: 'print / pdf',
    madeBy: 'Made by hand',
    themeLabel: 'Theme',
    typographyLabel: 'Body pairing',
    displayFontLabel: 'Display font',
    themes: { paper: 'paper', ink: 'ink', midnight: 'midnight' },
    types: { editorial: 'Editorial', 'mono-first': 'Mono', 'all-sans': 'Sans' },
    darkModeLabel: 'dark mode',
    lightModeLabel: 'light mode',
    roleSeparator: ' · ',
  },
  es: {
    experience: 'Experiencia profesional.',
    roles: (n) => `${n} roles`,
    projects: 'Proyectos destacados.',
    projectsAside: 'Trabajo paralelo y experimentos',
    education: 'Educación.',
    languages: 'Idiomas.',
    skills: 'Habilidades y herramientas.',
    skillsCols: ['Programación', 'Juegos y tecnología creativa', 'Producto y liderazgo'],
    filter: 'Filtrar por tecnología',
    tagsLabel: (n) => `· ${n} etiquetas`,
    all: 'Todas',
    downloadPdf: '↓ descargar pdf',
    getInTouch: '✉ contáctame',
    basedLabel: 'Ubicación',
    experienceLabel: 'Experiencia',
    contactLabel: 'Contacto',
    yearsSuffix: (n) => `${n} años`,
    featured: 'Destacado',
    visitProject: 'visitar proyecto →',
    personal: 'Personal',
    sideWork: 'Trabajo paralelo y experimentos',
    admin: 'admin',
    printPdf: 'imprimir / pdf',
    madeBy: 'Hecho a mano',
    themeLabel: 'Tema',
    typographyLabel: 'Tipografía',
    displayFontLabel: 'Fuente display',
    themes: { paper: 'papel', ink: 'tinta', midnight: 'noche' },
    types: { editorial: 'Editorial', 'mono-first': 'Mono', 'all-sans': 'Sans' },
    darkModeLabel: 'modo oscuro',
    lightModeLabel: 'modo claro',
    roleSeparator: ' · ',
  },
};

function computeYears(experience: Experience[]): number {
  const years = experience
    .map((e) => {
      const m = /(\d{4})/.exec(e.startDate);
      return m ? parseInt(m[1], 10) : NaN;
    })
    .filter((y) => !isNaN(y));
  if (!years.length) return 0;
  const earliest = Math.min(...years);
  return new Date().getFullYear() - earliest;
}

function splitName(full: string): { first: string; rest: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], rest: '' };
  return { first: parts[0], rest: parts.slice(1).join(' ') };
}

export default function Home() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [language, setLanguage] = useState<Lang>('en');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('paper');
  const [typePairing, setTypePairing] = useState<TypePairing>('editorial');
  const [displayFont, setDisplayFont] = useState<DisplayFont>('sourceserif');
  const [tweaksOpen, setTweaksOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/cv/${language}`)
      .then((r) => r.json())
      .then((d: CVData) => setCvData(d))
      .catch((e) => console.error(e));
  }, [language]);

  const t = UI[language];

  const allTech = useMemo(() => {
    if (!cvData) return [] as string[];
    const s = new Set<string>();
    cvData.experience.forEach((e) => e.technologies.forEach((x) => s.add(x)));
    return Array.from(s).sort();
  }, [cvData]);

  if (!cvData) {
    return (
      <div className="cv-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--ink-3)' }}>
          loading…
        </span>
      </div>
    );
  }

  const p = cvData.personalInfo;
  const { first, rest } = splitName(p.name);
  const nameDisplay = rest
    ? { line1: first, line2: rest }
    : { line1: first, line2: '' };

  // Match design: first name plain; last name has its "t" italicized in accent
  // (e.g. "Cas<em>t</em>ro."). If no "t", render plain.
  const renderFirstLine = (s: string) => s;
  const renderLastLine = (s: string) => {
    if (!s) return null;
    const lower = s.toLowerCase();
    const tIdx = lower.indexOf('t');
    const trailing = s.endsWith('.') ? '' : '.';
    if (tIdx === -1) {
      return <>{s}{trailing}</>;
    }
    return (
      <>
        {s.slice(0, tIdx)}
        <em>{s.slice(tIdx, tIdx + 1)}</em>
        {s.slice(tIdx + 1)}
        {trailing}
      </>
    );
  };

  const totalYears = computeYears(cvData.experience);
  const matchesFilter = (e: Experience) =>
    !selectedTech || e.technologies.includes(selectedTech);

  const featured = cvData.projects.find((x) => x.featured) ?? cvData.projects[0];
  const restProjects = featured ? cvData.projects.filter((x) => x !== featured) : [];

  const tagline = p.tagline ?? p.summary.split('\n')[0];
  const bodySummary = p.tagline ? p.summary : p.summary.split('\n').slice(1).join('\n').trim() || p.summary;
  const availability = p.availability ?? (language === 'es' ? 'Disponible' : 'Available');

  return (
    <div className="cv-root" data-theme={theme} data-type={typePairing} data-display={displayFont}>
      {/* Top bar */}
      <div className="topbar">
        <div className="topbar-inner">
          <span className="topbar-name">
            <span className="dot" />
            {p.name.toLowerCase()}
          </span>
          <div className="topbar-right">
            <a href="#experience">{language === 'es' ? 'experiencia' : 'experience'}</a>
            <a href="#projects">{language === 'es' ? 'proyectos' : 'projects'}</a>
            <a href="#skills">{language === 'es' ? 'habilidades' : 'skills'}</a>
            <span className="sep">·</span>
            <button
              onClick={() => setTheme(theme === 'midnight' ? 'paper' : 'midnight')}
              aria-label={theme === 'midnight' ? t.lightModeLabel : t.darkModeLabel}
              title={theme === 'midnight' ? t.lightModeLabel : t.darkModeLabel}
            >
              {theme === 'midnight' ? '☀ light' : '☾ dark'}
            </button>
            <span className="sep">·</span>
            <button onClick={() => window.print()}>{t.printPdf}</button>
            <span className="sep">·</span>
            <Link href="/admin">{t.admin}</Link>
            <span className="sep">·</span>
            <button
              onClick={() => setLanguage('en')}
              className={language === 'en' ? 'active' : ''}
            >EN</button>
            <span className="sep">|</span>
            <button
              onClick={() => setLanguage('es')}
              className={language === 'es' ? 'active' : ''}
            >ES</button>
          </div>
        </div>
      </div>

      <main>
        {/* Hero */}
        <header className="hero">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-meta">
                <span className="label">{t.basedLabel}</span>
                <span className="val">{p.location}</span>
                <span className="label">{t.experienceLabel}</span>
                <span className="val">{t.yearsSuffix(totalYears)}</span>
                <span className="label">{t.contactLabel}</span>
                <span className="val">{p.email}</span>
              </div>
              <div>
                <h1 className="hero-name">
                  {renderFirstLine(nameDisplay.line1)}
                  {nameDisplay.line2 && (
                    <>
                      <br />
                      {renderLastLine(nameDisplay.line2)}
                    </>
                  )}
                </h1>
                <div className="hero-title">
                  <span className="role">{p.title}</span>
                  <span className="avail">{availability}</span>
                </div>
                <p className="hero-summary">{tagline}</p>
                <p className="hero-body">{bodySummary}</p>
                <div className="hero-actions">
                  <button className="btn btn-primary" onClick={() => window.print()}>
                    {t.downloadPdf}
                  </button>
                  <a className="btn" href={`mailto:${p.email}`}>{t.getInTouch}</a>
                  {p.social.linkedin && (
                    <a className="btn" href={p.social.linkedin} target="_blank" rel="noreferrer">linkedin ↗</a>
                  )}
                  {p.social.github && (
                    <a className="btn" href={p.social.github} target="_blank" rel="noreferrer">github ↗</a>
                  )}
                  {p.social.portfolio && (
                    <a className="btn" href={p.social.portfolio} target="_blank" rel="noreferrer">portfolio ↗</a>
                  )}
                </div>

                <div className="filter">
                  <div
                    className={`filter-head ${filterOpen ? 'open' : ''}`}
                    onClick={() => setFilterOpen((v) => !v)}
                  >
                    <span className="lhs">
                      <span>{t.filter}</span>
                      <span className="count">
                        {selectedTech ? `· ${selectedTech}` : t.tagsLabel(allTech.length)}
                      </span>
                    </span>
                    <span className="caret">›</span>
                  </div>
                  <div className={`filter-body ${filterOpen ? '' : 'collapsed'}`}>
                    <button
                      className={`chip all ${selectedTech === null ? 'active' : ''}`}
                      onClick={() => setSelectedTech(null)}
                    >
                      {t.all}
                    </button>
                    {allTech.map((tech) => (
                      <button
                        key={tech}
                        className={`chip ${selectedTech === tech ? 'active' : ''}`}
                        onClick={() => setSelectedTech(tech === selectedTech ? null : tech)}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Experience */}
        <section className="section" id="experience">
          <div className="container">
            <div className="section-head">
              <span className="section-num">§ 01</span>
              <h2 className="section-title">
                <span>{t.experience}</span>
                <span className="aside">{t.roles(cvData.experience.length)}</span>
              </h2>
            </div>
            <div className="exp-list">
              {cvData.experience.map((exp, i) => (
                <article
                  key={exp.id}
                  className={`exp ${selectedTech && !matchesFilter(exp) ? 'dim' : ''}`}
                >
                  <div className="exp-meta">
                    <span className="idx">No. {String(i + 1).padStart(2, '0')}</span>
                    <span className="dates">{exp.startDate} — {exp.endDate}</span>
                    <span className="loc">{exp.location}</span>
                  </div>
                  <div className="exp-body">
                    <h3>{exp.title}</h3>
                    <div className="exp-company">
                      <span className="company-name">{exp.company}</span>
                      {exp.website && (
                        <>
                          <span style={{ color: 'var(--ink-4)' }}>/</span>
                          <a
                            className="url"
                            href={exp.website.startsWith('http') ? exp.website : `https://${exp.website}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {exp.website} ↗
                          </a>
                        </>
                      )}
                    </div>
                    <ul className="exp-desc">
                      {exp.description.map((d, idx) => (
                        <li key={idx}>{d}</li>
                      ))}
                    </ul>
                    <div className="exp-tech">
                      {exp.technologies.map((tech) => (
                        <button
                          key={tech}
                          className={selectedTech === tech ? 'active' : ''}
                          onClick={() => setSelectedTech(tech === selectedTech ? null : tech)}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        {cvData.projects.length > 0 && (
          <section className="section" id="projects">
            <div className="container">
              <div className="section-head">
                <span className="section-num">§ 02</span>
                <h2 className="section-title">
                  <span>{t.projects}</span>
                  <span className="aside">{t.projectsAside}</span>
                </h2>
              </div>

              {featured && <FeaturedProject project={featured} t={t} />}

              {restProjects.map((proj) => (
                <article key={proj.id} className="proj-compact">
                  <div className="exp-meta">
                    <span className="dates">{proj.year}</span>
                  </div>
                  <div>
                    <h4>{proj.name}</h4>
                    <p>{proj.description}</p>
                    <div className="proj-tech" style={{ marginBottom: 10 }}>
                      {proj.technologies.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                    {proj.link && (
                      <a className="proj-link" href={proj.link} target="_blank" rel="noreferrer">
                        {t.visitProject}
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Education + Languages */}
        <section className="section">
          <div className="container">
            <div className="twocol">
              <span className="section-num">§ 03</span>
              <div>
                <h3 className="subhead">{t.education}</h3>
                {cvData.education.map((e) => (
                  <div key={e.id} className="edu-item">
                    <p className="deg">{e.degree}</p>
                    <p className="inst">{e.institution}</p>
                    <p className="yr">{e.year}</p>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="subhead">{t.languages}</h3>
                {cvData.languages.map((l, i) => (
                  <div key={i} className="lang-item">
                    <span className="l">{l.language}</span>
                    <span className="p">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="section skills-section" id="skills" style={{ borderBottom: 'none' }}>
          <div className="container">
            <div className="section-head">
              <span className="section-num">§ 04</span>
              <h2 className="section-title">
                <span>{t.skills}</span>
              </h2>
            </div>
            <div className="skills-grid">
              <span />
              <SkillColumn title={t.skillsCols[0]} items={cvData.skills.programming} />
              <SkillColumn title={t.skillsCols[1]} items={cvData.skills.gameAndCreativeTech} />
              <SkillColumn title={t.skillsCols[2]} items={cvData.skills.productAndManagement} />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <span>© {new Date().getFullYear()} · {p.name}</span>
          <span>{t.madeBy} · {p.location}</span>
        </div>
      </footer>

      {/* Tweaks */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 110 }}>
        <button
          className="btn"
          onClick={() => setTweaksOpen((v) => !v)}
          style={{ fontFamily: 'var(--f-mono)' }}
          aria-label="Toggle tweaks"
        >
          {tweaksOpen ? '×' : '⚙'} {language === 'es' ? 'ajustes' : 'tweaks'}
        </button>
      </div>
      {tweaksOpen && (
        <div className="tweaks" style={{ display: 'block' }}>
          <h5>{t.displayFontLabel}</h5>
          <div className="tweaks-row tweaks-row-5">
            {([
              { key: 'fraunces', label: 'Fraunces' },
              { key: 'sourceserif', label: 'Source' },
              { key: 'crimson', label: 'Crimson' },
              { key: 'instrument', label: 'Instrument' },
              { key: 'inter', label: 'Inter' },
            ] as { key: DisplayFont; label: string }[]).map((d) => (
              <button
                key={d.key}
                className={displayFont === d.key ? 'active' : ''}
                onClick={() => setDisplayFont(d.key)}
                title={d.label}
              >
                {d.label}
              </button>
            ))}
          </div>
          <h5>{t.themeLabel}</h5>
          <div className="tweaks-row">
            {(['paper', 'ink', 'midnight'] as Theme[]).map((th) => (
              <button
                key={th}
                className={theme === th ? 'active' : ''}
                onClick={() => setTheme(th)}
              >
                {t.themes[th]}
              </button>
            ))}
          </div>
          <h5>{t.typographyLabel}</h5>
          <div className="tweaks-row">
            {(['editorial', 'mono-first', 'all-sans'] as TypePairing[]).map((tp) => (
              <button
                key={tp}
                className={typePairing === tp ? 'active' : ''}
                onClick={() => setTypePairing(tp)}
              >
                {t.types[tp]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FeaturedProject({ project, t }: { project: Project; t: (typeof UI)[Lang] }) {
  const parts = project.name.split(' ');
  const first = parts[0];
  const rest = parts.slice(1).join(' ');
  return (
    <article className="proj-hero">
      <div className="exp-meta">
        <span className="idx">{t.featured}</span>
        <span className="dates">{project.year}</span>
        <span className="loc">{t.personal}</span>
      </div>
      <div>
        <div className="proj-visual featured">
          {project.link && (
            <iframe
              src={project.link}
              loading="lazy"
              title={`${project.name} live preview`}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, background: 'var(--bg-elev)' }}
            />
          )}
          <span className="label">{project.name.toLowerCase()}.preview</span>
        </div>
        <h3>
          <em>{first}</em>{rest ? ` ${rest}` : ''}
        </h3>
        <p className="proj-desc">{project.description}</p>
        <div className="proj-tech">
          {project.technologies.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        {project.link && (
          <a className="proj-link" href={project.link} target="_blank" rel="noreferrer">
            {t.visitProject}
          </a>
        )}
      </div>
    </article>
  );
}

function SkillColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="skill-col">
      <h4>{title}</h4>
      <div className="skill-list">
        {items.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
    </div>
  );
}

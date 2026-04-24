import fs from 'fs';
import path from 'path';
import { CVData } from '@/types/cv';
import { notFound } from 'next/navigation';
import './print.css';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }];
}

async function loadCV(lang: string): Promise<CVData | null> {
  const filePath = path.join(process.cwd(), 'data', `cv-${lang}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

const LABELS = {
  en: {
    experience: 'Experience',
    projects: 'Selected projects',
    education: 'Education',
    languages: 'Languages',
    skills: 'Skills & tools',
    programming: 'Programming',
    creative: 'Game & Creative tech',
    product: 'Product & Leadership',
  },
  es: {
    experience: 'Experiencia',
    projects: 'Proyectos destacados',
    education: 'Educación',
    languages: 'Idiomas',
    skills: 'Habilidades y herramientas',
    programming: 'Programación',
    creative: 'Juegos y tecnología creativa',
    product: 'Producto y liderazgo',
  },
} as const;

export default async function PrintCV({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== 'en' && lang !== 'es') notFound();
  const cv = await loadCV(lang);
  if (!cv) notFound();

  const t = LABELS[lang as 'en' | 'es'];
  const p = cv.personalInfo;

  const socials = [
    { label: 'linkedin', url: p.social.linkedin },
    { label: 'github', url: p.social.github },
    { label: 'portfolio', url: p.social.portfolio },
    { label: 'web', url: p.social.website },
  ].filter((s) => s.url);

  return (
    <div className="cv-print">
      {/* Header */}
      <header className="head">
        <h1>{p.name}</h1>
        <p className="title">{p.title}</p>
        <p className="contact">
          {[p.email, p.phone, p.location].filter(Boolean).join('  ·  ')}
        </p>
        {socials.length > 0 && (
          <p className="contact">
            {socials.map((s) => s.url.replace(/^https?:\/\//, '').replace(/\/$/, '')).join('  ·  ')}
          </p>
        )}
        {p.tagline && <p className="tagline">{p.tagline}</p>}
        <p className="summary">{p.summary}</p>
      </header>

      {/* Experience */}
      <section>
        <h2>{t.experience}</h2>
        {cv.experience.map((e) => (
          <article className="exp" key={e.id}>
            <div className="exp-head">
              <span className="role-line">
                <span className="role">{e.title}</span>
                {' · '}
                <span className="company">{e.company}</span>
              </span>
              <span className="meta">
                {e.startDate} – {e.endDate}
                {e.location ? ` · ${e.location}` : ''}
              </span>
            </div>
            {e.description.filter((d) => d.trim().length > 0).length > 0 && (
              <ul>
                {e.description
                  .filter((d) => d.trim().length > 0)
                  .map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
              </ul>
            )}
            {e.technologies.length > 0 && (
              <p className="tech">{e.technologies.join(' · ')}</p>
            )}
          </article>
        ))}
      </section>

      {/* Projects */}
      {cv.projects.length > 0 && (
        <section>
          <h2>{t.projects}</h2>
          {cv.projects.map((proj) => (
            <article className="proj" key={proj.id}>
              <div className="exp-head">
                <span className="role-line">
                  <span className="role">{proj.name}</span>
                  {proj.type ? (
                    <>
                      {' · '}
                      <span className="company">{proj.type}</span>
                    </>
                  ) : null}
                </span>
                <span className="meta">
                  {proj.year}
                  {proj.link ? ` · ${proj.link.replace(/^https?:\/\//, '').replace(/\/$/, '')}` : ''}
                </span>
              </div>
              <p className="proj-desc">{proj.description}</p>
              {proj.technologies.length > 0 && (
                <p className="tech">{proj.technologies.join(' · ')}</p>
              )}
            </article>
          ))}
        </section>
      )}

      {/* Education + Languages */}
      <section className="two-col">
        <div>
          <h2>{t.education}</h2>
          {cv.education.map((e) => (
            <article className="edu" key={e.id}>
              <p className="edu-deg">{e.degree}</p>
              <p className="edu-meta">
                {e.institution} · {e.year}
              </p>
            </article>
          ))}
        </div>
        <div>
          <h2>{t.languages}</h2>
          {cv.languages.map((l, i) => (
            <p className="lang-line" key={i}>
              <span>{l.language}</span>
              <span className="meta">{l.proficiency}</span>
            </p>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2>{t.skills}</h2>
        <div className="skills">
          <div>
            <h4>{t.programming}</h4>
            <p>{cv.skills.programming.join(', ')}</p>
          </div>
          <div>
            <h4>{t.creative}</h4>
            <p>{cv.skills.gameAndCreativeTech.join(', ')}</p>
          </div>
          <div>
            <h4>{t.product}</h4>
            <p>{cv.skills.productAndManagement.join(', ')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

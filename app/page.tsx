'use client';

import { useEffect, useState } from 'react';
import { CVData } from '@/types/cv';
import Link from 'next/link';

export default function Home() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [allTechnologies, setAllTechnologies] = useState<string[]>([]);

  useEffect(() => {
    fetchCV(language);
  }, [language]);

  const fetchCV = async (lang: 'en' | 'es') => {
    try {
      const response = await fetch(`/api/cv/${lang}`);
      const data = await response.json() as CVData;
      setCvData(data);

      const techs = new Set<string>();
      data.experience.forEach((exp) => {
        exp.technologies.forEach((tech: string) => techs.add(tech));
      });
      setAllTechnologies(Array.from(techs).sort());
    } catch (error) {
      console.error('Error fetching CV:', error);
    }
  };

  const filteredExperience = selectedTech
    ? cvData?.experience.filter((exp) =>
        exp.technologies.includes(selectedTech)
      )
    : cvData?.experience;

  const translations = {
    en: {
      experience: 'Professional Experience',
      projects: 'Projects',
      education: 'Education',
      languages: 'Languages',
      skills: 'Skills',
      filter: 'Filter by Technology',
      all: 'All',
    },
    es: {
      experience: 'Experiencia Profesional',
      projects: 'Proyectos',
      education: 'Educación',
      languages: 'Idiomas',
      skills: 'Habilidades',
      filter: 'Filtrar por Tecnología',
      all: 'Todos',
    },
  };

  const t = translations[language];

  if (!cvData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-8 py-3 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">{cvData.personalInfo.name}</span>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xs text-gray-500 hover:text-gray-700">Admin</Link>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'font-bold text-gray-900' : 'text-gray-500'}
              >
                EN
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setLanguage('es')}
                className={language === 'es' ? 'font-bold text-gray-900' : 'text-gray-500'}
              >
                ES
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            {cvData.personalInfo.name}
          </h1>
          <p className="text-2xl text-gray-600 mb-6 font-light">
            {cvData.personalInfo.title}
          </p>
          
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
            <span>{cvData.personalInfo.email}</span>
            <span className="text-gray-300">•</span>
            <span>{cvData.personalInfo.phone}</span>
            <span className="text-gray-300">•</span>
            <span>{cvData.personalInfo.location}</span>
          </div>

          <div className="flex gap-4 mb-8">
            <a href={cvData.personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer" 
               className="text-sm text-gray-700 hover:text-gray-900 underline">
              LinkedIn
            </a>
            <a href={cvData.personalInfo.social.github} target="_blank" rel="noopener noreferrer"
               className="text-sm text-gray-700 hover:text-gray-900 underline">
              GitHub
            </a>
            <a href={cvData.personalInfo.social.website} target="_blank" rel="noopener noreferrer"
               className="text-sm text-gray-700 hover:text-gray-900 underline">
              Website
            </a>
            <a href={cvData.personalInfo.social.portfolio} target="_blank" rel="noopener noreferrer"
               className="text-sm text-gray-700 hover:text-gray-900 underline">
              Portfolio
            </a>
          </div>

          <p className="text-base text-gray-700 leading-relaxed max-w-4xl">
            {cvData.personalInfo.summary}
          </p>
        </div>

        {/* Technology Filter */}
        <div className="mb-12 bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">{t.filter}</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTech(null)}
              className={`px-4 py-2 text-sm rounded-md transition ${
                selectedTech === null
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {t.all}
            </button>
            {allTechnologies.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech)}
                className={`px-4 py-2 text-sm rounded-md transition ${
                  selectedTech === tech
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {/* Experience */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t.experience}</h2>
          <div className="space-y-10">
            {filteredExperience?.map((exp) => (
              <div key={exp.id} className="relative pl-8 border-l-2 border-gray-200">
                <div className="absolute w-4 h-4 bg-gray-900 rounded-full -left-[9px] top-1"></div>
                
                <div className="mb-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                    <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <p className="text-lg text-gray-700 font-medium">{exp.company}</p>
                  {exp.website && (
                    <a href={`https://${exp.website}`} target="_blank" rel="noopener noreferrer"
                       className="text-sm text-gray-500 hover:text-gray-700">
                      {exp.website}
                    </a>
                  )}
                </div>

                <ul className="space-y-2 mb-4">
                  {exp.description.map((desc, idx) => (
                    <li key={idx} className="text-sm text-gray-700 leading-relaxed flex">
                      <span className="mr-2 text-gray-400">•</span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 text-xs font-medium rounded ${
                        selectedTech === tech
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        {cvData.projects.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t.projects}</h2>
            <div className="space-y-8">
              {cvData.projects.map((project) => (
                <div key={project.id} className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                    <span className="text-sm text-gray-500">{project.year}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a href={project.link} target="_blank" rel="noopener noreferrer"
                     className="text-sm text-gray-900 hover:text-gray-700 underline font-medium">
                    View Project →
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two Column Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Education */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.education}</h2>
            <div className="space-y-6">
              {cvData.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="text-base font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-700">{edu.institution}</p>
                  <p className="text-sm text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Languages */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.languages}</h2>
            <div className="space-y-3">
              {cvData.languages.map((lang, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-900">{lang.language}</span>
                  <span className="text-sm text-gray-600">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Skills */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t.skills}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Programming</h3>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.programming.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Game & Creative</h3>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.gameAndCreativeTech.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Product & Leadership</h3>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.productAndManagement.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {cvData.personalInfo.name}</p>
        </div>
      </footer>
    </div>
  );
}

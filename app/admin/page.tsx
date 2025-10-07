'use client';

import { useState, useEffect } from 'react';
import { CVData, Experience, Project } from '@/types/cv';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [editingExp, setEditingExp] = useState<string | null>(null);
  const [editingProj, setEditingProj] = useState<string | null>(null);
  const [editingEdu, setEditingEdu] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'experience' | 'projects' | 'education' | 'languages' | 'skills'>('info');

  useEffect(() => {
    if (isAuthenticated) {
      fetchCV(language);
    }
  }, [isAuthenticated, language]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setMessage('');
      } else {
        setMessage('Invalid keyword');
      }
    } catch {
      setMessage('Authentication error');
    }
  };

  const fetchCV = async (lang: 'en' | 'es') => {
    try {
      const response = await fetch(`/api/cv/${lang}`);
      const data = await response.json();
      setCvData(data);
    } catch (error) {
      console.error('Error fetching CV:', error);
    }
  };

  const handleSave = async () => {
    if (!cvData) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/cv/${language}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, data: cvData }),
      });

      if (response.ok) {
        setMessage('✓ Changes saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error saving changes');
      }
    } catch {
      setMessage('Error saving changes');
    } finally {
      setSaving(false);
    }
  };

  // Experience functions
  const addNewJob = () => {
    if (!cvData) return;
    const newJob: Experience = {
      id: `exp${Date.now()}`,
      title: 'New Position',
      company: 'Company Name',
      location: 'Location',
      startDate: 'Jan 2024',
      endDate: 'Present',
      website: '',
      technologies: [],
      tools: [],
      description: ['Add description here'],
    };
    setCvData({ ...cvData, experience: [newJob, ...cvData.experience] });
    setEditingExp(newJob.id);
  };

  const deleteJob = (expId: string) => {
    if (!cvData || !confirm('Are you sure you want to delete this job?')) return;
    setCvData({
      ...cvData,
      experience: cvData.experience.filter((exp) => exp.id !== expId),
    });
  };

  const addTechnology = (expId: string, tech: string) => {
    if (!cvData) return;
    const updatedExp = cvData.experience.map((exp) => {
      if (exp.id === expId && !exp.technologies.includes(tech.trim())) {
        return { ...exp, technologies: [...exp.technologies, tech.trim()] };
      }
      return exp;
    });
    setCvData({ ...cvData, experience: updatedExp });
  };

  const removeTechnology = (expId: string, tech: string) => {
    if (!cvData) return;
    const updatedExp = cvData.experience.map((exp) => {
      if (exp.id === expId) {
        return {
          ...exp,
          technologies: exp.technologies.filter((t) => t !== tech),
        };
      }
      return exp;
    });
    setCvData({ ...cvData, experience: updatedExp });
  };

  const updateExperience = (expId: string, field: keyof Experience, value: string | string[]) => {
    if (!cvData) return;
    const updatedExp = cvData.experience.map((exp) => {
      if (exp.id === expId) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    setCvData({ ...cvData, experience: updatedExp });
  };

  // Project functions
  const addNewProject = () => {
    if (!cvData) return;
    const newProject: Project = {
      id: `proj${Date.now()}`,
      name: 'New Project',
      year: '2024',
      description: 'Project description',
      technologies: [],
      link: 'https://example.com',
      type: 'Web Development',
    };
    setCvData({ ...cvData, projects: [newProject, ...cvData.projects] });
    setEditingProj(newProject.id);
  };

  const deleteProject = (projId: string) => {
    if (!cvData || !confirm('Are you sure you want to delete this project?')) return;
    setCvData({
      ...cvData,
      projects: cvData.projects.filter((proj) => proj.id !== projId),
    });
  };

  const updateProject = (projId: string, field: keyof Project, value: string | string[]) => {
    if (!cvData) return;
    const updatedProjects = cvData.projects.map((proj) => {
      if (proj.id === projId) {
        return { ...proj, [field]: value };
      }
      return proj;
    });
    setCvData({ ...cvData, projects: updatedProjects });
  };

  const addProjectTech = (projId: string, tech: string) => {
    if (!cvData) return;
    const updatedProjects = cvData.projects.map((proj) => {
      if (proj.id === projId && !proj.technologies.includes(tech.trim())) {
        return { ...proj, technologies: [...proj.technologies, tech.trim()] };
      }
      return proj;
    });
    setCvData({ ...cvData, projects: updatedProjects });
  };

  const removeProjectTech = (projId: string, tech: string) => {
    if (!cvData) return;
    const updatedProjects = cvData.projects.map((proj) => {
      if (proj.id === projId) {
        return {
          ...proj,
          technologies: proj.technologies.filter((t) => t !== tech),
        };
      }
      return proj;
    });
    setCvData({ ...cvData, projects: updatedProjects });
  };

  // Education functions
  const addNewEducation = () => {
    if (!cvData) return;
    const newEdu = {
      id: `edu${Date.now()}`,
      degree: 'New Degree',
      institution: 'Institution Name',
      year: '2024',
      location: 'Location',
    };
    setCvData({ ...cvData, education: [newEdu, ...cvData.education] });
    setEditingEdu(newEdu.id);
  };

  const deleteEducation = (eduId: string) => {
    if (!cvData || !confirm('Are you sure you want to delete this education entry?')) return;
    setCvData({
      ...cvData,
      education: cvData.education.filter((edu) => edu.id !== eduId),
    });
  };

  const updateEducation = (eduId: string, field: string, value: string) => {
    if (!cvData) return;
    const updatedEdu = cvData.education.map((edu) => {
      if (edu.id === eduId) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    setCvData({ ...cvData, education: updatedEdu });
  };

  // Language functions
  const addNewLanguage = () => {
    if (!cvData) return;
    const newLang = {
      language: 'New Language',
      proficiency: 'Level',
    };
    setCvData({ ...cvData, languages: [...cvData.languages, newLang] });
  };

  const deleteLanguage = (index: number) => {
    if (!cvData || !confirm('Are you sure you want to delete this language?')) return;
    setCvData({
      ...cvData,
      languages: cvData.languages.filter((_, i) => i !== index),
    });
  };

  const updateLanguage = (index: number, field: 'language' | 'proficiency', value: string) => {
    if (!cvData) return;
    const updatedLangs = cvData.languages.map((lang, i) => {
      if (i === index) {
        return { ...lang, [field]: value };
      }
      return lang;
    });
    setCvData({ ...cvData, languages: updatedLangs });
  };

  // Skills functions
  const addSkill = (category: 'programming' | 'gameAndCreativeTech' | 'productAndManagement', skill: string) => {
    if (!cvData || !skill.trim()) return;
    const updatedSkills = {
      ...cvData.skills,
      [category]: [...cvData.skills[category], skill.trim()],
    };
    setCvData({ ...cvData, skills: updatedSkills });
  };

  const removeSkill = (category: 'programming' | 'gameAndCreativeTech' | 'productAndManagement', skill: string) => {
    if (!cvData) return;
    const updatedSkills = {
      ...cvData.skills,
      [category]: cvData.skills[category].filter((s) => s !== skill),
    };
    setCvData({ ...cvData, skills: updatedSkills });
  };

  const updatePersonalInfo = (field: string, value: string) => {
    if (!cvData) return;
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCvData({
        ...cvData,
        personalInfo: {
          ...cvData.personalInfo,
          [parent]: {
            ...(cvData.personalInfo[parent as keyof typeof cvData.personalInfo] as Record<string, string>),
            [child]: value,
          },
        },
      });
    } else {
      setCvData({
        ...cvData,
        personalInfo: {
          ...cvData.personalInfo,
          [field]: value,
        },
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Access</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Keyword
              </label>
              <input
                type="password"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin keyword"
              />
            </div>
            {message && (
              <p className="text-red-600 text-sm mb-4">{message}</p>
            )}
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition font-medium"
            >
              Access
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/" className="text-blue-600 hover:underline text-sm">
              ← Back to CV
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">CV Admin Panel</h1>
            <div className="flex gap-4 items-center">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                ← Back to CV
              </Link>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded text-sm font-medium ${
                    language === 'en'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('es')}
                  className={`px-3 py-1.5 rounded text-sm font-medium ${
                    language === 'es'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ES
                </button>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:bg-gray-400 text-sm font-medium"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
          {message && (
            <div className="mt-2 text-center text-sm font-semibold text-green-600">
              {message}
            </div>
          )}
        </div>
      </nav>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition ${
                activeTab === 'info'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition ${
                activeTab === 'experience'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Experience
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition ${
                activeTab === 'projects'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition ${
                activeTab === 'education'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Education
            </button>
            <button
              onClick={() => setActiveTab('languages')}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition ${
                activeTab === 'languages'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Languages
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition ${
                activeTab === 'skills'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Skills
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Personal Info Tab */}
        {activeTab === 'info' && (
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={cvData.personalInfo.name}
                  onChange={(e) => updatePersonalInfo('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={cvData.personalInfo.title}
                  onChange={(e) => updatePersonalInfo('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={cvData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={cvData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="+506 8888-8888"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={cvData.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Summary</label>
                <textarea
                  value={cvData.personalInfo.summary}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
                <input
                  type="text"
                  value={cvData.personalInfo.social.linkedin}
                  onChange={(e) => updatePersonalInfo('social.linkedin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">GitHub</label>
                <input
                  type="text"
                  value={cvData.personalInfo.social.github}
                  onChange={(e) => updatePersonalInfo('social.github', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
                <input
                  type="text"
                  value={cvData.personalInfo.social.website}
                  onChange={(e) => updatePersonalInfo('social.website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Portfolio</label>
                <input
                  type="text"
                  value={cvData.personalInfo.social.portfolio}
                  onChange={(e) => updatePersonalInfo('social.portfolio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Professional Experience</h2>
              <button
                onClick={addNewJob}
                className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm font-medium"
              >
                + Add New Job
              </button>
            </div>
            <div className="space-y-4">
              {cvData.experience.map((exp) => (
                <div key={exp.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {exp.company} - {exp.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingExp(editingExp === exp.id ? null : exp.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {editingExp === exp.id ? 'Collapse' : 'Edit'}
                      </button>
                      <button
                        onClick={() => deleteJob(exp.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {editingExp === exp.id && (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Job Title
                          </label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Website
                          </label>
                          <input
                            type="text"
                            value={exp.website}
                            onChange={(e) => updateExperience(exp.id, 'website', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Technologies
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
                            >
                              {tech}
                              <button
                                onClick={() => removeTechnology(exp.id, tech)}
                                className="text-red-600 hover:text-red-800 font-bold"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add technology..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value) {
                                addTechnology(exp.id, e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              if (input.value) {
                                addTechnology(exp.id, input.value);
                                input.value = '';
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Description (one per line)
                        </label>
                        <textarea
                          value={exp.description.join('\n')}
                          onChange={(e) =>
                            updateExperience(exp.id, 'description', e.target.value.split('\n'))
                          }
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {editingExp !== exp.id && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Projects</h2>
              <button
                onClick={addNewProject}
                className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm font-medium"
              >
                + Add New Project
              </button>
            </div>
            <div className="space-y-4">
              {cvData.projects.map((proj) => (
                <div key={proj.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{proj.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProj(editingProj === proj.id ? null : proj.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {editingProj === proj.id ? 'Collapse' : 'Edit'}
                      </button>
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {editingProj === proj.id && (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Project Name
                          </label>
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Year
                          </label>
                          <input
                            type="text"
                            value={proj.year}
                            onChange={(e) => updateProject(proj.id, 'year', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Link
                          </label>
                          <input
                            type="text"
                            value={proj.link}
                            onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={proj.description}
                            onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Technologies
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {proj.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
                            >
                              {tech}
                              <button
                                onClick={() => removeProjectTech(proj.id, tech)}
                                className="text-red-600 hover:text-red-800 font-bold"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add technology..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value) {
                                addProjectTech(proj.id, e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              if (input.value) {
                                addProjectTech(proj.id, input.value);
                                input.value = '';
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {editingProj !== proj.id && (
                    <div>
                      <p className="text-sm text-gray-700 mb-2">{proj.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {proj.technologies.map((tech) => (
                          <span key={tech} className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Education</h2>
              <button
                onClick={addNewEducation}
                className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm font-medium"
              >
                + Add Education
              </button>
            </div>
            <div className="space-y-4">
              {cvData.education.map((edu) => (
                <div key={edu.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingEdu(editingEdu === edu.id ? null : edu.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {editingEdu === edu.id ? 'Collapse' : 'Edit'}
                      </button>
                      <button
                        onClick={() => deleteEducation(edu.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {editingEdu === edu.id && (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Degree
                          </label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Institution
                          </label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Year
                          </label>
                          <input
                            type="text"
                            value={edu.year}
                            onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            value={edu.location}
                            onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {editingEdu !== edu.id && (
                    <div>
                      <p className="text-sm text-gray-700">{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages Tab */}
        {activeTab === 'languages' && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Languages</h2>
              <button
                onClick={addNewLanguage}
                className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm font-medium"
              >
                + Add Language
              </button>
            </div>
            <div className="space-y-4">
              {cvData.languages.map((lang, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Language
                      </label>
                      <input
                        type="text"
                        value={lang.language}
                        onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Proficiency
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={lang.proficiency}
                          onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => deleteLanguage(index)}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Skills</h2>
            <div className="space-y-6">
              {/* Programming */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Programming</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cvData.skills.programming.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill('programming', skill)}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add skill..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        addSkill('programming', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (input.value) {
                        addSkill('programming', input.value);
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Game & Creative Tech */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Game & Creative Tech</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cvData.skills.gameAndCreativeTech.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill('gameAndCreativeTech', skill)}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add skill..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        addSkill('gameAndCreativeTech', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (input.value) {
                        addSkill('gameAndCreativeTech', input.value);
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Product & Leadership */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product & Leadership</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cvData.skills.productAndManagement.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill('productAndManagement', skill)}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add skill..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        addSkill('productAndManagement', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (input.value) {
                        addSkill('productAndManagement', input.value);
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

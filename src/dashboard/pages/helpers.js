export function hasExperience(formData) {
  const exp = formData?.experience;
  return Boolean(
    exp?.jobTitle?.trim() &&
      exp?.companyName?.trim() &&
      exp?.location?.trim() &&
      exp?.startDate &&
      exp?.description?.trim()
  );
}

export function hasProject(formData) {
  const project = formData?.projects;
  return Boolean(
    project?.title?.trim() &&
      project?.role?.trim() &&
      project?.startDate &&
      project?.endDate &&
      project?.thumbnail
  );
}

export function hasLanguage(formData) {
  const language = formData?.languages;
  return Boolean(language?.language?.trim() && language?.yearStarted);
}

export function getLanguagePercent(proficiency) {
  if (proficiency === 'Native Speaker') return 100;
  if (proficiency === 'Professional Working') return 85;
  if (proficiency === 'Fluent') return 75;
  if (proficiency === 'Advanced') return 65;
  if (proficiency === 'Intermediate') return 45;
  return 25;
}

export function formatDate(date) {
  if (!date) return '-';

  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getChecks(formData) {
  const exp = formData?.experience;

  return {
    personalInfo: false,
    experience: hasExperience(formData),
    education: false,
    skills: Boolean(exp?.skillsUsed?.length),
    projects: hasProject(formData),
    certifications: false,
    languages: hasLanguage(formData),
  };
}

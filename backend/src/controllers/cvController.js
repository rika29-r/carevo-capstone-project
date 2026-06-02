const PDFDocument = require('pdfkit');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
  BorderStyle,
} = require('docx');
const { success } = require('../utils/response');
const { getCvDataByUserId, buildChecklist, buildPreviewData, normalizeSections } = require('../services/cvService');

const safe = (value, fallback = '') => String(value ?? fallback).trim();
const hasText = (value) => safe(value).length > 0;

const dateText = (date) => {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return String(date);
  return parsed.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
};

const rangeText = (start, end, current) => {
  const a = dateText(start);
  const b = current ? 'Sekarang' : dateText(end);
  if (a && b) return `${a} - ${b}`;
  return a || b || '';
};

const filename = (name, ext) => {
  const base = safe(name, `CAREVO_CV.${ext}`).replace(/[\\/:*?"<>|]/g, '_');
  return base.toLowerCase().endsWith(`.${ext}`) ? base : `${base}.${ext}`;
};

const dataUriToBuffer = (dataUri = '') => {
  if (!dataUri || typeof dataUri !== 'string') return null;
  const match = dataUri.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/i);
  if (!match) return null;
  try {
    return Buffer.from(match[2], 'base64');
  } catch {
    return null;
  }
};

const getDefaultAvatarSvg = (name = 'CV') => {
  const initials = safe(name, 'CV')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'CV';

  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <rect width="600" height="600" fill="#e5e7eb"/>
      <circle cx="300" cy="230" r="95" fill="#94a3b8"/>
      <path d="M120 540c28-115 98-175 180-175s152 60 180 175" fill="#94a3b8"/>
      <text x="300" y="570" text-anchor="middle" font-family="Arial" font-size="70" font-weight="700" fill="#111827">${initials}</text>
    </svg>
  `);
};

const getProfileImageBuffer = (profile, fallbackName) => {
  return dataUriToBuffer(profile?.profileImage) || getDefaultAvatarSvg(fallbackName);
};

const getCvData = async (req, res) => {
  const cvData = await getCvDataByUserId(req.user.id);
  return success(res, 200, 'Data CV terbaru berhasil diambil dari database.', cvData);
};

const getChecklist = async (req, res) => {
  const cvData = await getCvDataByUserId(req.user.id);
  return success(res, 200, 'Checklist CV berhasil diambil.', buildChecklist(cvData));
};

const previewCv = async (req, res) => {
  const cvData = await getCvDataByUserId(req.user.id);
  const previewData = buildPreviewData(cvData, req.body.sections || req.body.include || {});
  return success(res, 200, 'Preview CV berhasil dibuat dari data terbaru.', { previewData });
};

const drawSectionTitle = (doc, title) => {
  doc.moveDown(1).fontSize(14).font('Helvetica-Bold').text(title.toUpperCase(), { characterSpacing: 1 });
  const y = doc.y + 4;
  doc.moveTo(42, y).lineTo(553, y).lineWidth(0.8).strokeColor('#111827').stroke();
  doc.moveDown(0.7).font('Helvetica').fontSize(10).strokeColor('#000000');
};

const generatePdf = async (req, res) => {
  const cvData = await getCvDataByUserId(req.user.id);
  const include = normalizeSections(req.body.sections || req.body.include || {});
  const profile = cvData.personalInfo || {};
  const fullName = safe(profile.fullName, req.user.name || 'CAREVO USER');
  const outName = filename(req.body.fileName || cvData.settings?.file_name, 'pdf');

  const doc = new PDFDocument({ margin: 42, size: 'A4', bufferPages: true });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${outName}"`);
  doc.pipe(res);

  if (include.personalInfo) {
    const imageBuffer = getProfileImageBuffer(profile, fullName);
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#000000').text(fullName, 42, 58, { width: 330 });
    doc.fontSize(11).font('Helvetica').text(safe(profile.professionalTitle || profile.careerInterest, 'Career Profile'), { width: 330 });
    if (hasText(profile.phone)) doc.text(safe(profile.phone));
    if (hasText(req.user.email || profile.email)) doc.text(safe(req.user.email || profile.email));
    if (hasText(profile.location)) doc.text(safe(profile.location));

    try {
      doc.image(imageBuffer, 455, 58, { width: 95, height: 95, fit: [95, 95] });
    } catch {
      doc.rect(455, 58, 95, 95).fill('#e5e7eb');
    }

    doc.moveTo(42, 185).lineTo(553, 185).lineWidth(1).strokeColor('#9ca3af').stroke();
    doc.y = 205;

    if (profile.shortBio) {
      drawSectionTitle(doc, 'Tentang Saya');
      doc.font('Helvetica').fontSize(10.5).text(profile.shortBio, { align: 'left', lineGap: 3 });
    }
  }

  if (include.experience && cvData.experiences.length) {
    drawSectionTitle(doc, 'Pengalaman');
    cvData.experiences.forEach((item) => {
      const period = rangeText(item.startDate, item.endDate, item.currentlyWork);
      doc.font('Helvetica').fontSize(10).text(period || 'Periode belum diisi');
      doc.font('Helvetica-Bold').fontSize(11).text(safe(item.jobTitle, 'Job Title'));
      doc.font('Helvetica').fontSize(10).text(safe(item.companyName, 'Company'));
      if (item.employmentType) doc.text(item.employmentType);
      if (item.location) doc.text(item.location);
      if (item.description) doc.moveDown(0.3).text(item.description, { lineGap: 2 });
      if (item.skillsUsed?.length) doc.text(`Skills: ${item.skillsUsed.map((skill) => skill.name || skill).join(', ')}`);
      doc.moveDown(0.8);
    });
  }

  if (include.education && cvData.educations.length) {
    drawSectionTitle(doc, 'Pendidikan');
    cvData.educations.forEach((item) => {
      doc.font('Helvetica').fontSize(10).text(rangeText(item.startDate, item.endDate, item.currentlyStudy));
      doc.font('Helvetica-Bold').fontSize(11).text(safe(item.institutionName, 'Institution'));
      doc.font('Helvetica').fontSize(10).text(safe(item.degreeMajor, 'Degree / Major'));
      if (item.location) doc.text(item.location);
      if (item.gpa) doc.text(`GPA / Grade: ${item.gpa}`);
      if (item.description) doc.moveDown(0.3).text(item.description, { lineGap: 2 });
      doc.moveDown(0.8);
    });
  }

  if (include.skills && cvData.skills.length) {
    drawSectionTitle(doc, 'Skills');
    cvData.skills.forEach((item) => doc.text(`• ${item.name}${item.category ? ` — ${item.category}` : ''}${item.level ? ` • ${item.level}` : ''}`));
  }

  if (include.projects && cvData.projects.length) {
    drawSectionTitle(doc, 'Projects');
    cvData.projects.forEach((item) => {
      doc.font('Helvetica-Bold').fontSize(11).text(safe(item.title, 'Project'));
      doc.font('Helvetica').fontSize(10).text([item.role, item.status, rangeText(item.startDate, item.endDate)].filter(Boolean).join(' • '));
      if (item.description) doc.text(item.description, { lineGap: 2 });
      if (item.demoUrl) doc.text(`Demo: ${item.demoUrl}`);
      if (item.githubUrl) doc.text(`GitHub: ${item.githubUrl}`);
      doc.moveDown(0.7);
    });
  }

  if (include.certifications && cvData.certifications.length) {
    drawSectionTitle(doc, 'Sertifikasi');
    cvData.certifications.forEach((item) => {
      doc.font('Helvetica-Bold').fontSize(11).text(safe(item.certificateName, 'Certification'));
      doc.font('Helvetica').fontSize(10).text([item.issuer, dateText(item.issueDate)].filter(Boolean).join(' • '));
      if (item.credentialUrl) doc.text(item.credentialUrl);
      if (item.description) doc.text(item.description, { lineGap: 2 });
      doc.moveDown(0.7);
    });
  }

  if (include.languages && cvData.languages.length) {
    drawSectionTitle(doc, 'Bahasa');
    cvData.languages.forEach((item) => doc.text(`• ${safe(item.language, 'Language')} — ${safe(item.proficiency, 'Proficiency')}${item.usageFrequency ? ` • ${item.usageFrequency}` : ''}${item.yearStarted ? ` • Since ${item.yearStarted}` : ''}`));
  }



  doc.end();
};

const line = (text, options = {}) => new Paragraph({
  alignment: options.alignment,
  spacing: { after: options.after ?? 90, before: options.before ?? 0 },
  border: options.border ? { bottom: { color: '111827', space: 3, style: BorderStyle.SINGLE, size: 8 } } : undefined,
  children: [new TextRun({
    text: safe(text),
    bold: !!options.bold,
    size: options.size || 22,
    color: options.color || '000000',
    allCaps: !!options.allCaps,
  })],
  heading: options.heading,
});

const sectionTitle = (title) => line(title, { bold: false, size: 28, allCaps: true, border: true, before: 260, after: 160 });

const generateDocx = async (req, res) => {
  const cvData = await getCvDataByUserId(req.user.id);
  const include = normalizeSections(req.body.sections || req.body.include || {});
  const profile = cvData.personalInfo || {};
  const fullName = safe(profile.fullName, req.user.name || 'CAREVO USER');
  const children = [];

  if (include.personalInfo) {
    const imageBuffer = getProfileImageBuffer(profile, fullName);
    children.push(new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new ImageRun({ data: imageBuffer, transformation: { width: 120, height: 120 } })],
      spacing: { after: 0 },
    }));
    children.push(line(fullName, { heading: HeadingLevel.TITLE, bold: false, size: 40, after: 80 }));
    children.push(line(safe(profile.professionalTitle || profile.careerInterest, 'Career Profile'), { size: 22, after: 80 }));
    if (hasText(profile.phone)) children.push(line(safe(profile.phone), { size: 20, after: 40 }));
    if (hasText(req.user.email || profile.email)) children.push(line(safe(req.user.email || profile.email), { size: 20, after: 40 }));
    if (hasText(profile.location)) children.push(line(safe(profile.location), { size: 20, after: 220, border: true }));

    if (profile.shortBio) {
      children.push(sectionTitle('Tentang Saya'));
      children.push(line(profile.shortBio, { size: 21, after: 120 }));
    }
  }

  if (include.experience && cvData.experiences.length) {
    children.push(sectionTitle('Pengalaman'));
    cvData.experiences.forEach((x) => {
      children.push(line(rangeText(x.startDate, x.endDate, x.currentlyWork), { size: 20, after: 50 }));
      children.push(line(safe(x.jobTitle, 'Job Title'), { bold: true, size: 22, after: 40 }));
      children.push(line(safe(x.companyName, 'Company'), { size: 20, after: 40 }));
      if (x.employmentType) children.push(line(x.employmentType, { size: 20, after: 40 }));
      if (x.location) children.push(line(x.location, { size: 20, after: 40 }));
      if (x.description) children.push(line(x.description, { size: 20, after: 80 }));
    });
  }

  if (include.education && cvData.educations.length) {
    children.push(sectionTitle('Pendidikan'));
    cvData.educations.forEach((x) => {
      children.push(line(rangeText(x.startDate, x.endDate, x.currentlyStudy), { size: 20, after: 50 }));
      children.push(line(safe(x.institutionName, 'Institution'), { bold: true, size: 22, after: 40 }));
      children.push(line(safe(x.degreeMajor, 'Degree / Major'), { size: 20, after: 40 }));
      if (x.location) children.push(line(x.location, { size: 20, after: 40 }));
      if (x.gpa) children.push(line(`GPA / Grade: ${x.gpa}`, { size: 20, after: 40 }));
      if (x.description) children.push(line(x.description, { size: 20, after: 80 }));
    });
  }

  if (include.skills && cvData.skills.length) {
    children.push(sectionTitle('Skills'));
    cvData.skills.forEach((x) => children.push(line(`• ${x.name}${x.category ? ` — ${x.category}` : ''}${x.level ? ` • ${x.level}` : ''}`, { size: 20, after: 50 })));
  }

  if (include.projects && cvData.projects.length) {
    children.push(sectionTitle('Projects'));
    cvData.projects.forEach((x) => {
      children.push(line(safe(x.title, 'Project'), { bold: true, size: 22, after: 40 }));
      children.push(line([x.role, x.status, rangeText(x.startDate, x.endDate)].filter(Boolean).join(' • '), { size: 20, after: 40 }));
      if (x.description) children.push(line(x.description, { size: 20, after: 80 }));
    });
  }

  if (include.certifications && cvData.certifications.length) {
    children.push(sectionTitle('Sertifikasi'));
    cvData.certifications.forEach((x) => {
      children.push(line(safe(x.certificateName, 'Certification'), { bold: true, size: 22, after: 40 }));
      children.push(line([x.issuer, dateText(x.issueDate)].filter(Boolean).join(' • '), { size: 20, after: 80 }));
    });
  }

  if (include.languages && cvData.languages.length) {
    children.push(sectionTitle('Bahasa'));
    cvData.languages.forEach((x) => children.push(line(`• ${safe(x.language, 'Language')} — ${safe(x.proficiency, 'Proficiency')}${x.usageFrequency ? ` • ${x.usageFrequency}` : ''}${x.yearStarted ? ` • Since ${x.yearStarted}` : ''}`, { size: 20, after: 50 })));
  }


  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
      children,
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outName = filename(req.body.fileName || cvData.settings?.file_name, 'docx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.setHeader('Content-Disposition', `attachment; filename="${outName}"`);
  return res.send(buffer);
};

module.exports = { getCvData, getChecklist, previewCv, generatePdf, generateDocx };

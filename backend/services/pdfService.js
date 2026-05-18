import puppeteer from 'puppeteer';

/**
 * Launch Puppeteer browser instance
 * @returns {Promise<Browser>} Puppeteer browser instance
 */
async function launchBrowser() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    console.log('✓ Puppeteer browser launched successfully');
    return browser;
  } catch (error) {
    console.error('✗ Failed to launch browser:', error);
    throw error;
  }
}

/**
 * Close Puppeteer browser instance
 * @param {Browser} browser - Puppeteer browser instance
 */
async function closeBrowser(browser) {
  try {
    if (browser) {
      await browser.close();
      console.log('✓ Browser closed successfully');
    }
  } catch (error) {
    console.error('✗ Failed to close browser:', error);
  }
}

/**
 * Format date string for display
 * @param {string} dateString - Date in format YYYY-MM
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

/**
 * Generate HTML template from resume data
 * @param {Object} resumeData - Resume object with personal, experience, education, skills, projects
 * @returns {string} HTML string ready for PDF conversion
 */
function generateResumeHTML(resumeData) {
  const { personal = {}, summary = '', experience = [], education = [], skills = {}, projects = [] } = resumeData;

  const skillsHTML = `
    ${skills.technical && skills.technical.length ? `
      <div class="skills-section">
        <strong>Technical Skills:</strong> ${skills.technical.join(', ')}
      </div>
    ` : ''}
    ${skills.soft && skills.soft.length ? `
      <div class="skills-section">
        <strong>Soft Skills:</strong> ${skills.soft.join(', ')}
      </div>
    ` : ''}
    ${skills.tools && skills.tools.length ? `
      <div class="skills-section">
        <strong>Tools:</strong> ${skills.tools.join(', ')}
      </div>
    ` : ''}
    ${skills.languages && skills.languages.length ? `
      <div class="skills-section">
        <strong>Languages:</strong> ${skills.languages.join(', ')}
      </div>
    ` : ''}
  `;

  const experienceHTML = experience
    .map(
      (exp) => `
    <div class="experience-item">
      <div class="item-header">
        <strong>${exp.position || 'Position'}</strong>
        <span class="date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</span>
      </div>
      <div class="company">${exp.company || 'Company'}</div>
      ${exp.location ? `<div class="location">${exp.location}</div>` : ''}
      ${
        exp.achievements && exp.achievements.length
          ? `
        <ul class="achievements">
          ${exp.achievements.map((achievement) => `<li>${achievement}</li>`).join('')}
        </ul>
      `
          : ''
      }
    </div>
  `
    )
    .join('');

  const educationHTML = education
    .map(
      (edu) => `
    <div class="education-item">
      <div class="item-header">
        <strong>${edu.degree || 'Degree'}</strong>
        <span class="date">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</span>
      </div>
      <div class="institution">${edu.institution || 'Institution'}</div>
      <div class="field">${edu.field || ''}</div>
      ${edu.gpa ? `<div class="gpa">GPA: ${edu.gpa}</div>` : ''}
    </div>
  `
    )
    .join('');

  const projectsHTML = projects
    .map(
      (project) => `
    <div class="project-item">
      <div class="item-header">
        <strong>${project.name || 'Project Name'}</strong>
        ${project.link ? `<a href="${project.link}" class="link">${project.link}</a>` : ''}
      </div>
      ${project.description ? `<div class="description">${project.description}</div>` : ''}
      ${
        project.technologies && project.technologies.length
          ? `<div class="technologies"><strong>Tech:</strong> ${project.technologies.join(', ')}</div>`
          : ''
      }
    </div>
  `
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personal.firstName || 'Resume'} ${personal.lastName || ''}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
        }
        
        .container {
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        /* Header */
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #2c3e50;
            padding-bottom: 15px;
        }
        
        .name {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 5px;
        }
        
        .title {
            font-size: 14px;
            color: #7f8c8d;
            margin-bottom: 8px;
        }
        
        .contact-info {
            font-size: 12px;
            color: #555;
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
        }
        
        .contact-info span {
            display: inline-block;
        }
        
        /* Summary */
        .summary {
            margin-bottom: 20px;
            font-size: 13px;
            line-height: 1.8;
            color: #555;
        }
        
        /* Sections */
        .section {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #2c3e50;
            text-transform: uppercase;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #bdc3c7;
        }
        
        /* Items */
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 3px;
        }
        
        .item-header strong {
            font-size: 13px;
            color: #2c3e50;
        }
        
        .date {
            font-size: 11px;
            color: #7f8c8d;
            white-space: nowrap;
            margin-left: 10px;
        }
        
        .company, .institution {
            font-size: 12px;
            color: #555;
            font-style: italic;
            margin-bottom: 3px;
        }
        
        .location, .field {
            font-size: 11px;
            color: #7f8c8d;
            margin-bottom: 5px;
        }
        
        .gpa {
            font-size: 11px;
            color: #555;
            margin-bottom: 5px;
        }
        
        .description {
            font-size: 12px;
            color: #555;
            margin-bottom: 5px;
            line-height: 1.5;
        }
        
        .technologies {
            font-size: 11px;
            color: #555;
            margin-bottom: 5px;
        }
        
        .link {
            font-size: 11px;
            color: #3498db;
            text-decoration: none;
        }
        
        /* Achievements */
        .achievements {
            margin: 8px 0 0 20px;
            padding-left: 0;
            font-size: 12px;
            color: #555;
        }
        
        .achievements li {
            margin-bottom: 4px;
            line-height: 1.4;
        }
        
        /* Skills */
        .skills-section {
            font-size: 12px;
            margin-bottom: 8px;
            color: #555;
            line-height: 1.5;
        }
        
        .skills-section strong {
            color: #2c3e50;
        }
        
        /* Experience, Education, Projects items */
        .experience-item, .education-item, .project-item {
            margin-bottom: 12px;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            .container {
                padding: 10px;
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <div class="name">${personal.firstName || ''} ${personal.lastName || ''}</div>
            ${personal.title ? `<div class="title">${personal.title}</div>` : ''}
            <div class="contact-info">
                ${personal.email ? `<span>${personal.email}</span>` : ''}
                ${personal.phone ? `<span>${personal.phone}</span>` : ''}
                ${personal.location ? `<span>${personal.location}</span>` : ''}
                ${personal.linkedin ? `<span><a href="${personal.linkedin}" class="link">LinkedIn</a></span>` : ''}
                ${personal.portfolio ? `<span><a href="${personal.portfolio}" class="link">Portfolio</a></span>` : ''}
            </div>
        </div>

        <!-- Summary Section -->
        ${
          summary
            ? `
            <div class="section">
                <div class="section-title">Professional Summary</div>
                <div class="summary">${summary}</div>
            </div>
        `
            : ''
        }

        <!-- Experience Section -->
        ${
          experience.length > 0
            ? `
            <div class="section">
                <div class="section-title">Experience</div>
                ${experienceHTML}
            </div>
        `
            : ''
        }

        <!-- Education Section -->
        ${
          education.length > 0
            ? `
            <div class="section">
                <div class="section-title">Education</div>
                ${educationHTML}
            </div>
        `
            : ''
        }

        <!-- Skills Section -->
        ${
          skills.technical?.length || skills.soft?.length || skills.tools?.length || skills.languages?.length
            ? `
            <div class="section">
                <div class="section-title">Skills</div>
                ${skillsHTML}
            </div>
        `
            : ''
        }

        <!-- Projects Section -->
        ${
          projects.length > 0
            ? `
            <div class="section">
                <div class="section-title">Projects</div>
                ${projectsHTML}
            </div>
        `
            : ''
        }
    </div>
</body>
</html>
  `;

  return html;
}

/**
 * Convert HTML to PDF using Puppeteer
 * @param {string} htmlContent - HTML string to convert
 * @param {Object} options - PDF generation options (optional)
 * @returns {Promise<Buffer>} PDF buffer
 */
async function htmlToPDF(htmlContent, options = {}) {
  let browser;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();

    // Set viewport size for consistent rendering
    await page.setViewport({ width: 794, height: 1123 }); // A4 dimensions

    // Set content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate PDF with A4 format and margins
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
      printBackground: true,
      scale: 1,
    });

    console.log(`✓ PDF generated successfully (${pdfBuffer.length} bytes)`);
    return pdfBuffer;
  } catch (error) {
    console.error('✗ PDF generation failed:', error);
    throw error;
  } finally {
    await closeBrowser(browser);
  }
}

/**
 * Main function: Generate resume PDF from resume data
 * @param {Object} resumeData - Resume object
 * @param {Object} options - PDF options (optional)
 * @returns {Promise<Buffer>} PDF buffer
 */
export async function generateResumePDF(resumeData, options = {}) {
  try {
    console.log('📄 Starting resume PDF generation...');
    const htmlContent = generateResumeHTML(resumeData);
    const pdfBuffer = await htmlToPDF(htmlContent, options);
    console.log('✓ Resume PDF generation completed');
    return pdfBuffer;
  } catch (error) {
    console.error('✗ Resume PDF generation failed:', error);
    throw error;
  }
}

/**
 * Generate PDF from custom HTML content
 * @param {string} htmlContent - HTML string
 * @param {Object} options - PDF options (optional)
 * @returns {Promise<Buffer>} PDF buffer
 */
export async function generatePDFFromHTML(htmlContent, options = {}) {
  return htmlToPDF(htmlContent, options);
}

export default {
  generateResumePDF,
  generatePDFFromHTML,
  launchBrowser,
  closeBrowser,
  generateResumeHTML,
};

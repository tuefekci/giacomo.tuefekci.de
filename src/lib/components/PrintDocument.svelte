<script>
    export let resume;

    function getTechKeywords(highlights) {
        if (!highlights) return [];
        return highlights.filter(h => h.startsWith("Technology: ")).map(h => h.replace("Technology: ", ""));
    }

    function getYear(dateStr) {
        if (!dateStr) return null;
        return new Date(dateStr).getFullYear();
    }

    $: visibleProjects = resume.projects.filter(p =>
        p.visibility !== "hidden" && p.visibility !== "on-request"
    );

    $: printCategories = [...new Set(visibleProjects.map(p => p.category).filter(Boolean))];
    $: printCategoryCounts = visibleProjects.reduce((acc, p) => {
        if (p.category) acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {});
    $: printFeaturedCount = visibleProjects.filter(p => p.featured).length;

    $: grouped = visibleProjects.reduce((acc, p) => {
        const start = p.startDate ? parseInt(p.startDate) : null;
        const end = p.endDate ? parseInt(p.endDate) : start;
        if (start === null) {
            if (!acc["Unknown"]) acc["Unknown"] = [];
            acc["Unknown"].push(p);
        } else {
            for (let y = start; y <= end; y++) {
                const year = String(y);
                if (!acc[year]) acc[year] = [];
                acc[year].push(p);
            }
        }
        return acc;
    }, {});
    $: years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));
</script>

<div id="print-document" lang="en">
    <header id="print-header">
        <h1>{resume.basics.name}</h1>
        <p class="print-title">{resume.basics.label}</p>
        <p class="print-contact">
            {resume.basics.location.address}, {resume.basics.location.postalCode} {resume.basics.location.city}, {resume.basics.location.countryCode}
            &ensp;|&ensp;{resume.basics.email}
        </p>
        <p class="print-contact">
            {resume.basics.url.replace("https://", "")}
            &ensp;|&ensp;Languages: {resume.languages.map(l => `${l.language} (${l.fluency})`).join(", ")}
        </p>
    </header>

    <section class="print-section">
        <h2>About Me</h2>
        <p class="print-summary print-body-text">{resume.basics.summary}</p>
    </section>

    <section class="print-section">
        <h2>What I Do</h2>
        <div class="print-skills-grid">
            {#each resume.skills as skill}
                <div class="print-skill-card">
                    <h3>{skill.name}</h3>
                    <p class="print-body-text">{skill.summary}</p>
                </div>
            {/each}
        </div>
    </section>

    <section class="print-section">
        <h2>Experience</h2>
        {#each resume.work as work}
            <div class="print-work-item">
                <div class="print-work-header">
                    <div class="print-work-company-line">
                        <span class="print-work-company">
                            <strong>{work.name || work.position}</strong>
                            {#if work.location}
                                <span class="print-sep">&ensp;{work.location}</span>
                            {/if}
                        </span>
                        <span class="print-work-dates">
                            {getYear(work.startDate)}&ensp;–&ensp;{getYear(work.endDate) ?? "Present"}
                        </span>
                    </div>
                    {#if work.name && work.position}
                        <span class="print-work-position">{work.position}</span>
                    {/if}
                </div>
                {#if work.summary}
                    <p class="print-work-summary print-body-text">{work.summary}</p>
                {/if}
                {#if work.highlights && work.highlights.length > 0}
                    <ul class="print-highlights">
                        {#each work.highlights as h}
                            <li>{h}</li>
                        {/each}
                    </ul>
                {/if}
            </div>
        {/each}
    </section>

    <section class="print-section print-education">
        <h2>Education</h2>
        <div class="print-edu-grid">
            {#each resume.education as edu}
                <div class="print-edu-item">
                    <div class="print-edu-header">
                        <div class="print-edu-header-top">
                            <span class="print-edu-school">
                                <strong>{edu.institution}</strong>
                                {#if edu.location}
                                    <span class="print-sep">&ensp;{edu.location}</span>
                                {/if}
                            </span>
                            <span class="print-edu-dates">
                                {getYear(edu.startDate)}&ensp;–&ensp;{getYear(edu.endDate) ?? "Present"}
                            </span>
                        </div>
                        {#if edu.area}
                            <span class="print-edu-field">{edu.studyType} in {edu.area}</span>
                        {/if}
                    </div>
                    {#if edu.courses && edu.courses.length > 0}
                        <p class="print-courses">Courses: {edu.courses.join(", ")}</p>
                    {/if}
                </div>
            {/each}
        </div>
    </section>

    <section class="print-section">
        <h2>Skills & Knowledge</h2>
        <div class="print-skills-knowledge">
            {#each resume.skills as skill}
                <div class="print-sk-item">
                    <div class="print-sk-header">
                        <strong>{skill.name}</strong>
                        <span class="print-sk-level">{skill.level}</span>
                    </div>
                    {#if skill.keywords && skill.keywords.length > 0}
                        <p class="print-sk-keywords">
                            {#each skill.keywords as kw, i}
                                {i > 0 ? ", " : ""}{kw}
                            {/each}
                        </p>
                    {/if}
                </div>
            {/each}
        </div>
    </section>

    <section class="print-section">
        <h2>Interests</h2>
        <div class="print-interests">
            {#each resume.interests as interest}
                <div class="print-interest">
                    <h3>{interest.name}</h3>
                    <p class="print-body-text">{interest.summary}</p>
                    {#if interest.keywords}
                        <div class="print-tags">
                            {#each interest.keywords as kw}
                                <span class="print-tag">{kw}</span>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </section>

    <section class="print-section print-portfolio">
        <h2>Portfolio</h2>

        <div class="print-pf-filters">
            <div class="print-pf-row">
                <span class="print-pf-btn print-pf-btn-active">&#9733; Featured ({printFeaturedCount})</span>
                <span class="print-pf-btn print-pf-btn-active">All ({visibleProjects.length})</span>
            </div>
            <div class="print-pf-cats">
                {#each printCategories as cat}
                    <span class="print-pf-cat">{cat} ({printCategoryCounts[cat] || 0})</span>
                {/each}
            </div>
        </div>

        <p class="print-pf-disclaimer">
            Projects shown under employer or client names are based on publicly available information. Not all professional work is listed due to NDAs. All trademarks belong to their respective owners.
        </p>
        {#each years as year}
            <div class="print-year-group">
                <h3 class="print-year-heading">{year}</h3>
                {#each grouped[year] as project}
                    <div class="print-project">
                        <h4>{project.name}</h4>
                        {#if project.entity}
                            <p class="print-project-meta">
                                {project.entity}
                                {#if project.customer}
                                    <span>&ensp;for {project.customer}</span>
                                {/if}
                            </p>
                        {/if}
                        {#if project.description}
                            <p class="print-project-desc print-body-text">{project.description}</p>
                        {/if}
                        {#if project.highlights}
                            {#if getTechKeywords(project.highlights).length > 0}
                                <div class="print-tags">
                                    {#each getTechKeywords(project.highlights) as tech}
                                        <span class="print-tag">{tech}</span>
                                    {/each}
                                </div>
                            {/if}
                        {/if}
                    </div>
                {/each}
            </div>
        {/each}
    </section>
</div>

<style>
    #print-document {
        font-family: Georgia, "Times New Roman", Times, serif;
        color: #000;
        line-height: 1.6;
        max-width: 100%;
        padding: 0;
        margin: 0;
        orphans: 3;
        widows: 3;
    }

    #print-header {
        text-align: center;
        margin-bottom: 22pt;
        padding-bottom: 12pt;
        border-bottom: 2.5pt solid #000;
    }

    #print-header h1 {
        font-family: Georgia, "Times New Roman", Times, serif;
        font-size: 28pt;
        font-weight: 700;
        margin: 0 0 6pt 0;
        letter-spacing: 1pt;
        text-transform: uppercase;
    }

    .print-title {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12pt;
        color: #444;
        margin: 0 0 6pt 0;
    }

    .print-contact {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10pt;
        color: #555;
        margin: 0;
    }

    .print-section {
        margin-bottom: 20pt;
    }

    .print-section h2 {
        font-family: Georgia, "Times New Roman", Times, serif;
        font-size: 16pt;
        font-weight: 700;
        margin: 0 0 8pt 0;
        padding-bottom: 3pt;
        border-bottom: 1.5pt solid #ccc;
        text-transform: uppercase;
        letter-spacing: 0.5pt;
        page-break-after: avoid;
    }

    .print-section h3 {
        font-family: Georgia, "Times New Roman", Times, serif;
        font-size: 13pt;
        font-weight: 700;
        margin: 0 0 4pt 0;
        page-break-after: avoid;
    }

    .print-section h4 {
        font-family: Georgia, "Times New Roman", Times, serif;
        font-size: 11pt;
        font-weight: 600;
        margin: 0 0 3pt 0;
        page-break-after: avoid;
    }

    .print-section p {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10.5pt;
        margin: 0 0 5pt 0;
        color: #222;
    }

    .print-summary {
        line-height: 1.45;
    }

    .print-body-text {
        text-align: justify;
        hyphens: auto;
    }

    .print-skills-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10pt;
    }

    .print-skill-card {
        break-inside: avoid;
    }

    .print-skill-card h3 {
        font-size: 11pt;
        margin-bottom: 2pt;
    }

    .print-skill-card p {
        font-size: 10pt;
        color: #333;
    }

    .print-interests {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10pt;
    }

    .print-interest {
        break-inside: avoid;
    }

    .print-interest h3 {
        font-size: 12pt;
    }

    .print-interest p {
        font-size: 10.5pt;
        color: #333;
    }

    .print-work-item {
        margin-bottom: 16pt;
        padding-left: 16pt;
        border-left: 1.5pt solid #ddd;
        break-inside: avoid;
        page-break-inside: avoid;
    }

    .print-work-item .print-work-summary,
    .print-work-item .print-highlights {
        break-inside: avoid;
        page-break-inside: avoid;
    }

    .print-work-header {
        font-family: Arial, Helvetica, sans-serif;
        margin-bottom: 4pt;
    }

    .print-work-company-line {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: baseline;
        font-size: 11.5pt;
    }

    .print-work-dates {
        font-size: 10pt;
        color: #555;
        white-space: nowrap;
    }

    .print-work-position {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10.5pt;
        color: #444;
        display: block;
        margin-top: 1pt;
        margin-bottom: 2pt;
    }

    .print-work-summary {
        font-size: 10.5pt !important;
        color: #444 !important;
        margin-bottom: 5pt !important;
    }

    .print-highlights {
        margin: 3pt 0 0 0;
        padding-left: 0;
        list-style: none;
    }

    .print-highlights li {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 9.5pt;
        color: #444;
        margin-bottom: 1.5pt;
    }

    .print-education {
        margin-bottom: 14pt;
    }

    .print-edu-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6pt;
    }

    .print-edu-item {
        padding-left: 8pt;
        border-left: 1.5pt solid #ddd;
        break-inside: avoid;
    }

    .print-edu-header {
        font-family: Arial, Helvetica, sans-serif;
        margin-bottom: 0;
    }

    .print-edu-header-top {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: baseline;
        font-size: 9pt;
    }

    .print-edu-dates {
        font-size: 8pt;
        color: #555;
        white-space: nowrap;
    }

    .print-edu-field {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 8.5pt;
        color: #444;
        display: block;
        margin-top: 0.5pt;
    }

    .print-courses {
        font-size: 8pt !important;
        color: #555 !important;
        margin-top: 0.5pt !important;
    }

    .print-sep {
        color: #666;
    }

    .print-skills-knowledge {
        display: grid;
        grid-template-columns: 1fr;
        gap: 14pt;
    }

    .print-sk-item {
        break-inside: avoid;
        padding-left: 10pt;
        border-left: 1.5pt solid #ddd;
    }

    .print-sk-header {
        display: flex;
        align-items: baseline;
        gap: 6pt;
    }

    .print-sk-header strong {
        font-family: Georgia, "Times New Roman", Times, serif;
        font-size: 11.5pt;
    }

    .print-sk-level {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 8pt;
        font-weight: 700;
        letter-spacing: 0.5pt;
        text-transform: uppercase;
        color: #555;
        border: 0.75pt solid #bbb;
        padding: 1pt 5pt;
    }

    .print-sk-keywords {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 7.5pt;
        color: #666;
        margin-top: 2pt !important;
        margin-bottom: 0 !important;
        line-height: 1.35;
    }

    .print-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 4pt;
        margin-top: 4pt;
    }

    .print-tag {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 9pt;
        background: #eee;
        color: #333;
        padding: 2pt 6pt;
        border-radius: 2pt;
    }

    .print-portfolio {
        page-break-before: always;
    }

    .print-pf-filters {
        display: none;
    }

    .print-pf-row {
        display: flex;
        gap: 4pt;
        margin-bottom: 3pt;
    }

    .print-pf-btn {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 9pt;
        font-weight: 600;
        padding: 3pt 10pt;
        border-radius: 4pt;
        background: #eee;
        color: #555;
    }

    .print-pf-btn-active {
        background: #222;
        color: #fff;
    }

    .print-pf-cats {
        display: flex;
        flex-wrap: wrap;
        gap: 2pt;
    }

    .print-pf-cat {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 7.5pt;
        padding: 1.5pt 6pt;
        border: 0.75pt solid #ccc;
        border-radius: 3pt;
        color: #555;
    }

    .print-pf-disclaimer {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 7pt !important;
        color: #888 !important;
        margin: 6pt 0 0 0 !important;
        line-height: 1.35;
    }

    .print-year-group {
        margin-bottom: 22pt;
    }

    .print-year-heading {
        font-size: 15pt !important;
        border-bottom: 1pt solid #ddd;
        padding-bottom: 4pt;
        margin-bottom: 12pt !important;
        page-break-after: avoid;
    }

    .print-project {
        margin-bottom: 16pt;
        padding-left: 16pt;
        border-left: 1.5pt solid #ddd;
        break-inside: avoid;
    }

    .print-project-meta {
        font-size: 10.5pt !important;
        color: #555 !important;
        font-style: italic;
    }

    .print-project-desc {
        font-size: 10.5pt !important;
        color: #333 !important;
        margin-top: 4pt !important;
        line-height: 1.5;
    }
</style>

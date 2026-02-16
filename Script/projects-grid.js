// Projects data
const projects = [
    {
        title: 'bE-More - Company Energy Efficientation System',
        description: 'IoT System - React - Arduino - Fullstack implementation for energy monitoring...',
        image: './Pages/Works/bE-More/static/media/logo.f891aae4577c48b75ca4.jpg',
        links: [
            { text: 'Details (it)', url: './Pages/Works/bE-More/index.html', class: 'btn btn-primary' },
            { text: 'Code', url: 'https://github.com/GiZano/project-day', class: 'btn btn-success' }
        ]
    },
    {
        title: 'CuriousTrip',
        description: 'Asynchronous Python CLI - aiohttp - Orchestrating 9 public APIs for instant travel profiles...',
        image: './Media/curious-traveler/hero.webp',
        links: [
            { text: 'Details', url: './Pages/Works/curious-traveler.html', class: 'btn btn-primary' },
            { text: 'Code', url: 'https://github.com/GiZano/traveler-api', class: 'btn btn-success' }
        ]
    },
    {
        title: 'Telegram Secretary Bot',
        description: 'Telegram Bot - Google Calendar API - Automating appointments management...',
        image: './Media/telegram-bot/bot.webp',
        links: [
            { text: 'Details', url: './Pages/Works/telegram-bot.html', class: 'btn btn-primary' },
            { text: 'Code', url: 'https://github.com/GiZano/telegram-to-calendar', class: 'btn btn-success' }
        ]
    },
    {
        title: 'Private TCP Chat',
        description: 'Multithreaded Local Chat - Python - Docker - Zero dependency secure communication...',
        image: './Media/private-chat/main.webp',
        links: [
            { text: 'Details', url: './Pages/Works/private-chat.html', class: 'btn btn-primary' },
            { text: 'Code', url: 'https://github.com/gizano/multithreaded-python-chat', class: 'btn btn-success' }
        ]
    },
    {
        title: "Burrows Wheeler's Algorithm Calculator",
        description: 'Python - FastAPI - Server - Educational tool for data compression algorithms...',
        image: './Media/burrows/burrow_main.webp',
        links: [
            { text: 'Details', url: './Works/Pages/burrows.html', class: 'btn btn-primary' },
            { text: 'Code', url: 'https://github.com/GiZano/burrows-wheeler-calculator', class: 'btn btn-success' }
        ]
    },
    {
        title: 'Web Presentations',
        description: 'React/Vite - HTML/CSS/JS - Web Design - Interactive slide decks...',
        image: './Media/presentations/react-logo.svg',
        links: [
            { text: 'View Projects', url: './Pages/Works/web-presentations.html', class: 'btn btn-primary' }
        ]
    },
    {
        title: 'The Bench of Kindness',
        description: 'Project Management - Real Life Implementation - Social initiative project...',
        image: './Media/bench/bench_main.webp',
        links: [
            { text: 'Details', url: './Pages/Works/bench.html', class: 'btn btn-primary' }
        ]
    },
    {
        title: 'School Dungeon - Command Line Based Game',
        description: 'Java - Game Development - RPG mechanics in console...',
        image: './Media/school-dungeon/school-dungeon_project.webp',
        links: [
            { text: 'Code', url: 'https://github.com/GiZano/school-dungeon', class: 'btn btn-success' }
        ]
    }
];

// Grid initialization
document.addEventListener('DOMContentLoaded', function() {
    const projectsGrid = document.getElementById('projectsGrid');
    const projectTemplate = document.getElementById('projectTemplate');

    if (!projectsGrid || !projectTemplate) {
        console.error('Grid elements or template not found');
        return;
    }

    projectsGrid.innerHTML = '';

    // Add each project to the grid
    projects.forEach((project, index) => {
        const template = projectTemplate.content.cloneNode(true);
        const cardCol = template.querySelector('.project-card'); // Select the column div (col-12...)
        
        // VIEW MORE LOGIC:
        // If the index is 3 or greater (from the 4th element onwards), we hide it
        if (index >= 3) {
            cardCol.classList.add('d-none'); // Bootstrap class to hide
            cardCol.classList.add('hidden-project'); // Marker to find them later
        }

        // Set project data
        const img = template.querySelector('.project-image');
        img.src = project.image;
        img.alt = project.title;
        
        template.querySelector('.project-title').textContent = project.title;
        template.querySelector('.project-description').textContent = project.description;
        
        // Links and Icons management
        const linksContainer = template.querySelector('.project-links');
        
        project.links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.className = 'btn btn-sm me-2';
            
            let iconHtml = '';
            const textLower = link.text.toLowerCase();

            if (textLower.includes('details') || textLower.includes('view')) {
                linkElement.classList.add('btn-primary');
                iconHtml = '<i class="fas fa-info-circle me-1"></i> ';
            } else if (textLower.includes('code')) {
                linkElement.classList.add('btn-success');
                iconHtml = '<i class="fab fa-github me-1"></i> ';
            } else {
                linkElement.classList.add('btn-primary');
            }
            
            if (link.class) {
                const customClasses = link.class.split(' ');
                customClasses.forEach(c => {
                    if(!linkElement.classList.contains(c)) {
                        linkElement.classList.add(c);
                    }
                });
            }
            
            linkElement.innerHTML = iconHtml + link.text;
            
            if (link.url.startsWith('http') || link.url.startsWith('https')) {
                linkElement.target = '_blank';
                linkElement.rel = 'noopener noreferrer';
            }
            
            linksContainer.appendChild(linkElement);
        });
        
        projectsGrid.appendChild(template);
    });

    // BUTTON LOGIC: If there are more than 3 projects, add the button
    if (projects.length > 3) {
        const btnContainer = document.createElement('div');
        btnContainer.className = 'text-center mt-5 w-100'; // Centered with top margin
        btnContainer.innerHTML = `
            <button id="viewMoreBtn" class="btn btn-outline-primary px-4 py-2 rounded-pill fw-bold transition-all">
                View More <i class="fas fa-chevron-down ms-2"></i>
            </button>
        `;
        
        // Insert the button RIGHT AFTER the grid (projectsGrid)
        projectsGrid.parentNode.insertBefore(btnContainer, projectsGrid.nextSibling);

        // Click Event Listener
        document.getElementById('viewMoreBtn').addEventListener('click', function() {
            const hiddenProjects = document.querySelectorAll('.hidden-project');
            
            hiddenProjects.forEach(el => {
                el.classList.remove('d-none'); // Show the element
                el.classList.add('fade-in-up'); // Add animation (see CSS below)
            });
            
            // Remove the button after showing everything
            this.parentElement.remove();
        });
    }
});
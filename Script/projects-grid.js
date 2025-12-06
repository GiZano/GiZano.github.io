// Dati dei progetti
const projects = [
    {
        title: 'bE-More - Company Energy Efficientation System',
        description: 'IoT System - React - Arduino - ...',
        image: './Pages/Works/bE-More/static/media/logo.f891aae4577c48b75ca4.jpg',
        links: [
            { text: 'Details (it)', url: './Pages/Works/bE-More/index.html', class: 'btn btn-primary', target: '_blank'},
            { text: 'Code', url: 'https://github.com/GiZano/project-day', class: 'btn btn-success' }
        ]
    },
    {
        title: "Burrows Wheeler's Algorithm Calculator",
        description: 'Python - FastAPI - Server - ...',
        image: './Media/burrow_main.png',
        links: [
            { text: 'Details', url: './Pages/Works/burrows-wheeler.html', class: 'btn btn-primary' },
            { text: 'Code', url: 'https://github.com/GiZano/burrow-wheeler-calculator', class: 'btn btn-success' }
        ]
    },
    {
        title: 'The Bench of Kindness',
        description: 'Project Management - Real Life Implementation - ...',
        image: './Media/bench_main.png',
        links: [
            { text: 'Details', url: './Pages/Works/bench.html', class: 'btn btn-primary' }
        ]
    },
    {
        title: 'School Dungeon - Command Line Based Game',
        description: 'Java - Game Development - ...',
        image: './Media/school-dungeon_project.png',
        links: [
            { text: 'Code', url: 'https://github.com/GiZano/school-dungeon', class: 'btn btn-success' }
        ]
    }
];

// Inizializzazione della griglia
document.addEventListener('DOMContentLoaded', function() {
    const projectsGrid = document.getElementById('projectsGrid');
    const projectTemplate = document.getElementById('projectTemplate');

    if (!projectsGrid || !projectTemplate) {
        console.error('Elementi della griglia o template non trovati');
        return;
    }

    // Aggiungi ogni progetto alla griglia
    projects.forEach(project => {
        const template = projectTemplate.content.cloneNode(true);
        const card = template.querySelector('.project-card');
        
        // Imposta i dati del progetto
        const img = card.querySelector('.project-image');
        img.src = project.image;
        img.alt = project.title;
        card.querySelector('.project-title').textContent = project.title;
        card.querySelector('.project-description').textContent = project.description;
        
        // Aggiungi i link
        const linksContainer = card.querySelector('.project-links');
        project.links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.className = 'btn btn-sm me-2';
            
            // Aggiungi la classe in base al testo del pulsante
            if (link.text.toLowerCase().includes('details')) {
                linkElement.classList.add('btn-primary');
            } else if (link.text.toLowerCase().includes('code')) {
                linkElement.classList.add('btn-success');
            } else {
                linkElement.classList.add('btn-primary');
            }
            
            // Aggiungi classi aggiuntive se presenti
            if (link.class) {
                linkElement.classList.add(...link.class.split(' '));
            }
            
            linkElement.textContent = link.text;
            
            // Apri i link esterni in una nuova scheda
            if (link.url.startsWith('http') || link.url.startsWith('https')) {
                linkElement.target = '_blank';
                linkElement.rel = 'noopener noreferrer';
            }
            
            linksContainer.appendChild(linkElement);
        });
        
        projectsGrid.appendChild(template);
    });
});
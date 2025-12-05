// Carousel functionality for Projects section
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('#portfolioCarousel');
    if (!carousel) return;
    
    // Rimuovi i pulsanti di navigazione su mobile
    if (window.innerWidth <= 767.98) {
        const prevButton = document.getElementById('portfolioCarouselPrev');
        const nextButton = document.getElementById('portfolioCarouselNext');
        if (prevButton) prevButton.remove();
        if (nextButton) nextButton.remove();
    }

    // Project data
    const projects = [
        {
            title: 'bE-More - Company Energy Efficientation System',
            description: 'IoT System - React - Arduino - ...',
            image: './Pages/Works/bE-More/static/media/logo.f891aae4577c48b75ca4.jpg',
            links: [
                { text: 'Details (it)', url: './Pages/Works/bE-More/index.html', class: 'btn btn-primary' },
                { text: 'Code', url: 'https://github.com/GiZano/project-day', class: 'btn btn-success' }
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
        },
        {
            title: 'CRC Calculator',
            description: 'JavaScript - Bit Transmission - ...',
            image: './Media/CRC_Calculator.png',
            links: [
                { text: 'Code', url: '#', class: 'btn btn-success' }
            ]
        }
    ];

    // DOM elements
    const carouselInner = carousel.querySelector('.carousel-inner .row');
    const projectTemplate = document.getElementById('projectTemplate');
    const prevButton = document.getElementById('portfolioCarouselPrev');
    const nextButton = document.getElementById('portfolioCarouselNext');
    
    // State
    let currentIndex = 0;
    let visibleCards = getVisibleCardsCount();
    let isAnimating = false;

    // Initialize the carousel
    function initCarousel() {
        // Clear existing content
        carouselInner.innerHTML = '';
        
        // Add all project cards
        projects.forEach((project, index) => {
            const template = projectTemplate.content.cloneNode(true);
            const card = template.querySelector('.project-card');
            
            // Set project data
            card.querySelector('.project-image').src = project.image;
            card.querySelector('.project-image').alt = project.title;
            card.querySelector('.project-title').textContent = project.title;
            card.querySelector('.project-description').textContent = project.description;
            
            // Add links
            const linksContainer = card.querySelector('.project-links');
            project.links.forEach(link => {
                const linkElement = document.createElement('a');
                linkElement.href = link.url;
                // Imposta le classi base
                linkElement.className = 'btn btn-sm me-2';
                
                // Aggiungi la classe in base al testo del pulsante
                if (link.text.toLowerCase().includes('details')) {
                    linkElement.classList.add('btn-primary');
                } else if (link.text.toLowerCase().includes('code')) {
                    linkElement.classList.add('btn-success');
                } else {
                    // Default a btn-primary se non è né Details né Code
                    linkElement.classList.add('btn-primary');
                }
                
                // Aggiungi eventuali classi aggiuntive
                if (link.className) {
                    linkElement.classList.add(link.className);
                }
                linkElement.textContent = link.text;
                if (link.url.startsWith('http') || link.url.startsWith('https')) {
                    linkElement.target = '_blank';
                    linkElement.rel = 'noopener noreferrer';
                }
                linksContainer.appendChild(linkElement);
            });
            
            carouselInner.appendChild(template);
        });
        
        updateCarousel();
    }

    // Get number of visible cards based on screen size
    function getVisibleCardsCount() {
        if (window.innerWidth >= 992) return 3;  // Desktop
        if (window.innerWidth >= 768) return 2;  // Tablet
        return 1;  // Mobile
    }

    // Update carousel display
    function updateCarousel() {
        const cards = carouselInner.querySelectorAll('.project-card');
        
        // Hide all cards
        cards.forEach((card, index) => {
            card.style.display = 'none';
            card.classList.remove('active');
        });
        
        // Show visible cards
        const endIndex = Math.min(currentIndex + visibleCards, cards.length);
        for (let i = currentIndex; i < endIndex; i++) {
            if (cards[i]) {
                cards[i].style.display = 'block';
                cards[i].classList.add('active');
            }
        }
        
        // Update button states
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= cards.length - visibleCards;
    }

    // Go to specific slide
    function goToSlide(index) {
        if (isAnimating) return;
        
        const cards = carouselInner.querySelectorAll('.project-card');
        index = Math.max(0, Math.min(index, cards.length - visibleCards));
        
        if (index !== currentIndex) {
            isAnimating = true;
            currentIndex = index;
            updateCarousel();
            
            // Reset animation state after transition
            setTimeout(() => {
                isAnimating = false;
            }, 300);
        }
    }

    // Event listeners
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    });

    nextButton.addEventListener('click', () => {
        const cards = carouselInner.querySelectorAll('.project-card');
        if (currentIndex < cards.length - visibleCards) {
            goToSlide(currentIndex + 1);
        }
    });

    // Handle window resize
    function handleResize() {
        const newVisibleCards = getVisibleCardsCount();
        if (newVisibleCards !== visibleCards) {
            visibleCards = newVisibleCards;
            updateCarousel();
        }
    }

    // Enhanced touch support with momentum and better handling
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartTime = 0;
    let touchEndTime = 0;
    let isScrolling = false;
    let touchStartY = 0;
    
    carousel.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
        touchStartY = e.touches[0].clientY;
        isScrolling = false;
    }, { passive: true });

    carousel.addEventListener('touchmove', e => {
        if (!touchStartX) return;
        
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        
        // Check if the user is scrolling vertically
        if (Math.abs(touchY - touchStartY) > 10) {
            isScrolling = true;
            return;
        }
        
        // Prevent page scroll when swiping horizontally
        if (Math.abs(touchX - touchStartX) > 10) {
            e.preventDefault();
        }
    }, { passive: false });

    carousel.addEventListener('touchend', e => {
        if (isScrolling) return;
        
        touchEndX = e.changedTouches[0].clientX;
        touchEndTime = Date.now();
        
        handleSwipe();
        touchStartX = 0;
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 30; // Reduced threshold for better responsiveness
        const swipeTimeThreshold = 300; // ms
        const swipeDistance = touchEndX - touchStartX;
        const swipeTime = touchEndTime - touchStartTime;
        
        // Calculate velocity (pixels per second)
        const velocity = Math.abs(swipeDistance) / (swipeTime / 1000);
        
        // Check if it's a valid swipe (fast enough or long enough)
        const isFastSwipe = velocity > 300 && swipeTime < swipeTimeThreshold;
        const isLongSwipe = Math.abs(swipeDistance) > 100;
        
        if (isFastSwipe || isLongSwipe) {
            if (swipeDistance < -swipeThreshold && currentIndex < projects.length - 1) {
                // Swipe left - go to next
                goToSlide(currentIndex + 1);
            } else if (swipeDistance > swipeThreshold && currentIndex > 0) {
                // Swipe right - go to previous
                goToSlide(currentIndex - 1);
            }
        }
    }
    
    // Prevent vertical scroll when swiping horizontally
    carousel.style.touchAction = 'pan-y';

    // Initialize
    window.addEventListener('resize', handleResize);
    initCarousel();
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                if (currentIndex > 0) {
                    goToSlide(currentIndex - 1);
                    e.preventDefault();
                }
                break;
            case 'ArrowRight':
                const cards = carouselInner.querySelectorAll('.project-card');
                if (currentIndex < cards.length - visibleCards) {
                    goToSlide(currentIndex + 1);
                    e.preventDefault();
                }
                break;
        }
    });
});

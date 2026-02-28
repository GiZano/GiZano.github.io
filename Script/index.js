class TypeWriter {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.speed = options.speed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.delay = options.delay || 2000;
        this.loop = options.loop !== false;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        
        this.type();
    }
            
    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.delay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex++;
            
            if (this.textIndex >= this.texts.length) {
                if (this.loop) {
                    this.textIndex = 0;
                } else {
                    return;
                }
            }
            
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

async function fetchLatestMediumArticle() {
    const mediumUsername = '@gizano'; 
    const rssUrl = `https://medium.com/feed/${mediumUsername}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    const linkElement = document.getElementById('medium-link');

    if (!linkElement) return;

    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('Feed retrieval failed');
        }
        
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            const lastArticle = data.items[0]; 
            
            linkElement.href = lastArticle.link;
            linkElement.textContent = lastArticle.title;
        } else {
            linkElement.textContent = "Visit my Medium blog";
        }
        
    } catch (error) {
        console.error('Error fetching Medium article:', error);
        linkElement.textContent = "Visit my Medium blog";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const texts = [
        "IoT Solutions",
        "Software Development", 
        "Web Design",
        "Problem Solving",
        "Project Management"
    ];
    
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        new TypeWriter(typewriterElement, texts, {
            speed: 100,
            deleteSpeed: 50,
            delay: 2000,
            loop: true
        });
    }

    fetchLatestMediumArticle();
});

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
            // Cancella carattere
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            // Scrivi carattere
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;
        
        // Se la scrittura è completata
        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.delay;
            this.isDeleting = true;
        } 
        // Se la cancellazione è completata
        else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex++;
            
            // Loop attraverso i testi
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

// Inizializzazione
document.addEventListener('DOMContentLoaded', function() {
    const texts = [
        "IoT Solutions",
        "Software Development", 
        "Web Design",
        "Problem Solving",
        "Project Management"
    ];
    
    const typewriterElement = document.getElementById('typewriter');
    new TypeWriter(typewriterElement, texts, {
        speed: 100,
        deleteSpeed: 50,
        delay: 2000,
        loop: true
    });
});


window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar-glass');
    navbar.classList.toggle('scrolled', window.scrollY < 50);
})
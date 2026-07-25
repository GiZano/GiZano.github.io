document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('viewMoreBtn');
    const container = document.getElementById('viewMoreContainer');
    
    if (btn) {
        btn.addEventListener('click', function() {
            const hiddenProjects = document.querySelectorAll('.hidden-project');
            
            hiddenProjects.forEach(el => {
                el.classList.remove('d-none');
                el.classList.add('fade-in-up');
            });
            
            // Remove the button container after showing everything
            if(container) {
                container.remove();
            }
        });
    }
});
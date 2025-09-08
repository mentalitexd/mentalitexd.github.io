document.addEventListener('DOMContentLoaded', function() {
    const manifestGeneratorBtn = document.getElementById('manifestGeneratorBtn');
    
    manifestGeneratorBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            window.location.href = 'https://violand.dev.tc/manifest.html';
        }, 500);
    });
    
    manifestGeneratorBtn.addEventListener('mouseenter', function() {
        this.querySelector('.btn-shine').style.animationDuration = '1.5s';
    });
    
    manifestGeneratorBtn.addEventListener('mouseleave', function() {
        this.querySelector('.btn-shine').style.animationDuration = '3s';
    });
});

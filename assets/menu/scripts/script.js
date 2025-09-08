document.addEventListener('DOMContentLoaded', function() {
    const manifestGeneratorBtn = document.getElementById('manifestGeneratorBtn');
    const dataLookupBtn = document.getElementById('dataLookupBtn');
    
    manifestGeneratorBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            window.location.href = 'https://violand.dev.tc/manifest.html';
        }, 500);
    });
    
    dataLookupBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';

        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            window.location.href = 'https://violand.dev.tc/lookup.html';
        }, 500);
    });
    
    const buttons = document.querySelectorAll('.main-btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.querySelector('.btn-shine').style.animationDuration = '1.5s';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.querySelector('.btn-shine').style.animationDuration = '3s';
        });
    });
});

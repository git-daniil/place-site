const progressBar = document.querySelector('.progress-bar');
const pageWrapper = document.querySelector('.page-wrapper');
const progressContainer = document.querySelector('.progress-bar-container');
const preloaderCenterText = document.querySelector('.preloader-center-text');
const preloaderLogo = document.querySelector('.preloader-logo');
const preloaderAuthor = document.querySelector('.preloader-author');
const scrollHint = document.querySelector('.scroll-hint');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
        }
    });
}, { threshold: 0.3 });

function runPreloader(showText = true, callback = null) {
    progressContainer.style.display = 'flex';
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    
    setTimeout(() => {
        if (showText) {
            progressContainer.classList.remove('lang-switch-mode');
            progressContainer.style.opacity = '1';
            pageWrapper.classList.remove('loaded');
            preloaderCenterText.style.display = 'block';
            preloaderLogo.classList.remove('show');
            preloaderAuthor.classList.remove('show');
            setTimeout(() => preloaderLogo.classList.add('show'), 300);
            setTimeout(() => preloaderAuthor.classList.add('show'), 900);
        } else {
            progressContainer.classList.add('lang-switch-mode');
            progressContainer.style.opacity = '1';
            preloaderCenterText.style.display = 'none';
        }

        setTimeout(() => {
            progressBar.style.transition = 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
            progressBar.style.width = '100%';
        }, 50);

        setTimeout(() => {
            if (callback) callback();
            progressContainer.style.opacity = '0';
            
            if (showText) pageWrapper.classList.add('loaded');
            
            setTimeout(() => {
                progressContainer.style.display = 'none';
                progressContainer.classList.remove('lang-switch-mode');
                document.querySelectorAll('.anim-text').forEach(text => observer.observe(text));
            }, 400);
        }, 1300);
    }, 50);
}

window.addEventListener('DOMContentLoaded', () => {
    runPreloader(true);
});

const langSelector = document.querySelector('.lang-selector-capsule');
const langOptions = document.querySelectorAll('.lang-option');

langOptions.forEach(option => {
    option.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = langSelector.classList.contains('open');
        const isActive = this.classList.contains('active');

        if (!isOpen) {
            langSelector.classList.add('open');
            return;
        }
        if (isActive) {
            langSelector.classList.remove('open');
            return;
        }
        
        const lang = this.getAttribute('data-value');
        langOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        langSelector.classList.remove('open');
        
        runPreloader(false, () => changeLanguage(lang));
    });
});

document.addEventListener('click', () => {
    if (langSelector) langSelector.classList.remove('open');
});

function changeLanguage(lang) {
    document.querySelectorAll('[data-lang]').forEach(elem => {
        const key = elem.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
            elem.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll('.scroll-section[data-slide]').forEach(slide => {
        const slideIndex = parseInt(slide.getAttribute('data-slide'));
        const slideData = translations[lang]?.slides?.[slideIndex];
        
        if (slideData) {
            const h1 = slide.querySelector('[data-field="h1"]');
            const p = slide.querySelector('[data-field="p"]');
            if (h1) h1.textContent = slideData.h1;
            if (p) p.textContent = slideData.p || '';
        }
    });
}

let currentSection = 0;
const sections = document.querySelectorAll('.scroll-section');
let isScrolling = false;

function updateScrollHint() {
    if (!scrollHint) return;
    if (currentSection === 0) {
        scrollHint.classList.remove('hide');
        scrollHint.classList.remove('show');
        void scrollHint.offsetWidth;
        scrollHint.classList.add('show');
    } else {
        scrollHint.classList.add('hide');
        scrollHint.classList.remove('show');
    }
}

window.addEventListener('wheel', function(e) {
    if (!document.body.classList.contains('paris-page')) return;
    if (!pageWrapper.classList.contains('loaded')) {
        e.preventDefault();
        return;
    }

    e.preventDefault();
    if (isScrolling || Math.abs(e.deltaY) < 60) return;

    isScrolling = true;

    if (e.deltaY > 0) {
        if (currentSection < sections.length - 1) currentSection++;
    } else {
        if (currentSection > 0) currentSection--;
    }

    sections[currentSection].scrollIntoView({ behavior: 'smooth' });
    updateScrollHint();

    setTimeout(() => isScrolling = false, 1000);
}, { passive: false });
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Infinite Logo Scroll Setup ---
    const scroller = document.querySelector('.logo-scroll');
    
    if (scroller) {
        // Clone the logo list for seamless looping
        const scrollerContent = Array.from(scroller.children);
        
        scrollerContent.forEach(item => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute('aria-hidden', true);
            scroller.appendChild(duplicatedItem);
        });
    }

    // --- 2. Scroll Reveal Animation ---
    const observerOptions = {
        root: null,
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    // Target the feature boxes and hero text/image
    const animatedElements = document.querySelectorAll('.feature-box, .hero-text, .hero-image, .partners');
    animatedElements.forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });

    // --- 3. Smooth Scrolling for Header Links ---
    const partnersLink = document.querySelector('a[href="#partners"]');
    const featuresLink = document.querySelector('a[href="#features"]');

    if (partnersLink) {
        partnersLink.addEventListener('click', (e) => {
            e.preventDefault();
            const partnersSection = document.querySelector('.partners');
            if (partnersSection) {
                partnersSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (featuresLink) {
        featuresLink.addEventListener('click', (e) => {
            e.preventDefault();
            const featuresSection = document.querySelector('.features');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- 4. Language Dropdown Logic ---
    const langSelector = document.querySelector('.lang-selector');
    if (langSelector) {
        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.className = 'lang-dropdown-menu';
        dropdown.innerHTML = `
            <div data-lang="EN">EN</div>
            <div data-lang="FR">FR</div>
            <div data-lang="AR">AR</div>
        `;
        document.body.appendChild(dropdown);

        langSelector.addEventListener('click', (e) => {
            e.stopPropagation();
            const rect = langSelector.getBoundingClientRect();
            dropdown.style.top = `${rect.bottom + 5}px`;
            dropdown.style.left = `${rect.left}px`;
            dropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropdown.classList.remove('show');
        });

        // Handle language selection
        dropdown.querySelectorAll('div').forEach(item => {
            item.addEventListener('click', () => {
                const selectedLang = item.getAttribute('data-lang');
                langSelector.querySelector('span').innerText = selectedLang;
                // Here you would add logic to actually change the site language
                console.log(`Language changed to: ${selectedLang}`);
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Infinite Marquee/Logo Scroll Setup ---
    // Matches the class in your HTML: .marquee-track
    const scroller = document.querySelector('.marquee-track');

    if (scroller) {
        // We clone the content to ensure there is no empty space on wide screens
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
                // Optional: Stop observing once visible to save performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Added '.features-intro' to the list so the new section animates too
    const animatedElements = document.querySelectorAll('.feature-box, .hero-text, .hero-image, .partners, .features-intro, .download-section');
    animatedElements.forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });

    // --- 3. Smooth Scrolling for Header Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 4. Language Dropdown Logic ---
    // We use the IDs we added to the HTML in the previous step
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const currentLangSpan = document.getElementById('currentLang');

    if (langBtn && langDropdown) {
        // Toggle dropdown on click
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.remove('show');
            }
        });

        // Handle language selection
        const langOptions = langDropdown.querySelectorAll('div');
        langOptions.forEach(option => {
            option.addEventListener('click', () => {
                const selectedLang = option.getAttribute('data-lang');

                // Update the text in the button
                if(currentLangSpan) {
                    currentLangSpan.textContent = selectedLang;
                }

                // Close the menu
                langDropdown.classList.remove('show');

                // Logic to actually change language would go here
                console.log(`Language changed to: ${selectedLang}`);
            });
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {

    // --- 0. Preloader Logic ---
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hide');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500); // Match the transition duration
        }
    });

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

    // --- 4. Language Dropdown Logic & Translations ---
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const currentLangSpan = document.getElementById('currentLang');

    // Translation Dictionary
    const translations = {
        en: {
            page_title: "Kwala - Breathe",
            loading_text: "Loading Kwala...",
            nav_features: "Why Kwala ?",
            nav_partners: "Partners",
            nav_order: "Order Now",
            hero_subtitle: "Let's take care of that",
            hero_title: "Snack <br> Attack ?",
            hero_desc: "Your all new delivery app for the best food in Khemisset, has just landed. In the palm of your hand.",
            partners_subtitle: "Our Partners",
            partners_title: "Simply, The Best You Can Wish For",
            features_intro_subtitle: "Clarity",
            features_intro_title: "See What You're Taking, <br> Don't Imagine It",
            features_intro_desc: "Say Goodbye to the old stock photos, Meet the new Item cards, with REAL photos of REAL food.",
            feature1_subtitle: "Transparent Pricing",
            feature1_title: "Place Fees + Service Fees",
            feature1_desc: "We don’t do crazy fees. It’s the same amount you’ll pay in the restaurant plus the location-based service fees. You want to pick it up from the restaurant ? Awesome, we won’t charge you a penny for the service fees.",
            feature2_subtitle: "Flexibility",
            feature2_title: "Wrong Order ? Cancel It",
            feature2_desc: "Made an order by error ? Kwala offers you a 5 minutes window of free cancellation. No pressure.",
            feature3_subtitle: "Control",
            feature3_title: "Your Meal, Your Calls",
            feature3_desc: "We provide you with a store-specific set of customizations going from how you want your meal cooked to what ingredients to keep or to add. We don’t call it YOUR Meal for nothing.",
            feature4_subtitle: "Convenience",
            feature4_title: "Pay With Ease",
            feature4_desc: "With integrating cards payments as one of our priorities, We do Tap and Pay so you can use Your watch, phone, or card as your wallet. Cash ? That’s a method we’ll ALWAYS support.",
            download_subtitle: "Convinced. What are you waiting for ?",
            download_title: "Download the app & <br> Order Now !",
            get_it_on: "GET IT ON",
            download_on: "Download on the",
            floating_order: "Order Now",
            footer_slogan: "Breathe",
            footer_discover: "Discover",
            footer_about: "About Us",
            footer_terms: "Terms of Use",
            footer_privacy: "Privacy Policy",
            footer_contact: "Contact",
            footer_support: "Support",
            footer_copyright: "&copy; 2026 Kwala. All rights reserved."
        },
        ar: {
            page_title: "كوالا - تنفس",
            loading_text: "جاري تحميل كوالا...",
            nav_features: "لماذا كوالا ؟",
            nav_partners: "شركاؤنا",
            nav_order: "اطلب الآن",
            hero_subtitle: "دعنا نهتم بذلك",
            hero_title: "جوعان ؟ <br> اطلب الآن",
            hero_desc: "تطبيق التوصيل الجديد لأفضل المأكولات في الخميسات، وصل للتو. بين يديك.",
            partners_subtitle: "شركاؤنا",
            partners_title: "ببساطة، الأفضل لك",
            features_intro_subtitle: "الوضوح",
            features_intro_title: "شوف شنو طالب، <br> ما تتخيلوش",
            features_intro_desc: "وداعاً للصور القديمة، مرحباً ببطاقات الأصناف الجديدة، بصور حقيقية لأكل حقيقي.",
            feature1_subtitle: "أسعار شفافة",
            feature1_title: "رسوم المكان + رسوم الخدمة",
            feature1_desc: "ما عندناش رسوم خيالية. نفس المبلغ اللي غتخلصو فالمطعم زائد رسوم الخدمة حسب الموقع. بغيتي تمشي تجيبو من المطعم ؟ مزيان، ما غنحسبوش عليك حتى ريال فرسوم الخدمة.",
            feature2_subtitle: "المرونة",
            feature2_title: "غلطتي فالطلب ؟ الغيه",
            feature2_desc: "درتي طلب بالغلط ؟ كوالا كتعطيك مهلة 5 دقايق للإلغاء المجاني. بلا ضغط.",
            feature3_subtitle: "التحكم",
            feature3_title: "وجبتك، اختيارك",
            feature3_desc: "كنوفرو ليك مجموعة من التخصيصات الخاصة بكل مطعم، من طريقة طهي وجبتك للمكونات اللي بغيتي تخليها أو تزيدها. ما سميناهاش وجبتك من فراغ.",
            feature4_subtitle: "الراحة",
            feature4_title: "خلص بكل سهولة",
            feature4_desc: "مع دمج الدفع بالبطاقات كأحد أولوياتنا، كندعمو الدفع باللمس باش تقدر تستعمل ساعتك، تيليفونك، أو بطاقتك كمحفظة. الكاش ؟ هاديك طريقة ديما غندعموها.",
            download_subtitle: "مقتنع ؟ شنو كتسنى ؟",
            download_title: "حمل التطبيق و <br> اطلب دابا !",
            get_it_on: "حمله من",
            download_on: "حمله من",
            floating_order: "اطلب الآن",
            footer_slogan: "تنفس",
            footer_discover: "اكتشف",
            footer_about: "من نحن",
            footer_terms: "شروط الاستخدام",
            footer_privacy: "سياسة الخصوصية",
            footer_contact: "تواصل معنا",
            footer_support: "الدعم",
            footer_copyright: "&copy; 2026 كوالا. جميع الحقوق محفوظة."
        },
        fr: {
            page_title: "Kwala - Respirez",
            loading_text: "Chargement de Kwala...",
            nav_features: "Pourquoi Kwala ?",
            nav_partners: "Partenaires",
            nav_order: "Commander",
            hero_subtitle: "Laissez-nous s'en occuper",
            hero_title: "Une petite <br> faim ?",
            hero_desc: "Votre nouvelle application de livraison pour les meilleurs plats à Khemisset vient d'arriver. Au creux de votre main.",
            partners_subtitle: "Nos Partenaires",
            partners_title: "Simplement, Le Meilleur",
            features_intro_subtitle: "Clarté",
            features_intro_title: "Voyez ce que vous prenez, <br> Ne l'imaginez pas",
            features_intro_desc: "Dites adieu aux vieilles photos, découvrez les nouvelles fiches produits, avec de VRAIES photos de VRAIS plats.",
            feature1_subtitle: "Tarification Transparente",
            feature1_title: "Frais du lieu + Frais de service",
            feature1_desc: "Pas de frais cachés. C'est le même montant que vous paieriez au restaurant plus les frais de service basés sur la localisation. Vous voulez le récupérer au restaurant ? Super, nous ne vous facturerons pas un centime pour les frais de service.",
            feature2_subtitle: "Flexibilité",
            feature2_title: "Erreur de commande ? Annulez-la",
            feature2_desc: "Vous avez fait une erreur ? Kwala vous offre une fenêtre de 5 minutes d'annulation gratuite. Pas de pression.",
            feature3_subtitle: "Contrôle",
            feature3_title: "Votre Repas, Vos Choix",
            feature3_desc: "Nous vous proposons un ensemble de personnalisations spécifiques à chaque magasin, de la cuisson de votre repas aux ingrédients à garder ou à ajouter. Ce n'est pas VOTRE repas pour rien.",
            feature4_subtitle: "Commodité",
            feature4_title: "Payez Facilement",
            feature4_desc: "L'intégration des paiements par carte étant l'une de nos priorités, nous proposons le paiement sans contact pour que vous puissiez utiliser votre montre, téléphone ou carte comme portefeuille. Espèces ? C'est une méthode que nous soutiendrons TOUJOURS.",
            download_subtitle: "Convaincu ? Qu'attendez-vous ?",
            download_title: "Téléchargez l'app & <br> Commandez !",
            get_it_on: "DISPONIBLE SUR",
            download_on: "Télécharger dans",
            floating_order: "Commander",
            footer_slogan: "Respirez",
            footer_discover: "Découvrir",
            footer_about: "À Propos",
            footer_terms: "Conditions d'utilisation",
            footer_privacy: "Politique de Confidentialité",
            footer_contact: "Contact",
            footer_support: "Support",
            footer_copyright: "&copy; 2026 Kwala. Tous droits réservés."
        }
    };

    function setLanguage(lang) {
        // 1. Update Text Content
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                // Use innerHTML to allow <br> tags in translations
                el.innerHTML = translations[lang][key];
            }
        });

        // 2. Handle Direction (RTL for Arabic)
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
            // Font is handled via CSS variable override in styles.css
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', lang);
            // Font reverts to default CSS variables
        }

        // 3. Update Links for Privacy, Terms, About
        const linkElements = document.querySelectorAll('[data-link]');
        linkElements.forEach(el => {
            const baseLink = el.getAttribute('data-link'); // e.g., "about"
            // If lang is 'en', use 'about.html', else 'about-fr.html' or 'about-ar.html'
            if (lang === 'en') {
                el.setAttribute('href', `${baseLink}.html`);
            } else {
                el.setAttribute('href', `${baseLink}-${lang}.html`);
            }
        });

        // 4. Update Current Language Display
        if (currentLangSpan) {
            currentLangSpan.textContent = lang.toUpperCase();
        }
    }

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
                setLanguage(selectedLang);
                langDropdown.classList.remove('show');
            });
        });
    }
});
// ========================================
// PROFILE MANAGEMENT SYSTEM
// ========================================

// Default profiles data
const defaultProfiles = [
    {
        id: 'profile_1',
        name: 'barir ali',
        email: 'barir.ali@email.com',
        phone: '+212 6XX XXX XXX',
        avatar: 'assets/landing_kwala.png',
        isPremium: true,
        isVerified: true,
        memberSince: 'January 2024',
        dateOfBirth: 'January 15, 1990',
        gender: 'Male',
        stats: {
            totalOrders: 127,
            totalSpent: 2450,
            favorites: 23,
            addresses: 5
        },
        addresses: [
            { id: 'addr_1', type: 'home', name: 'Home', isDefault: true, address: '123 Rue Mohammed V, Apt 4B', city: 'Khemisset', country: 'Morocco' },
            { id: 'addr_2', type: 'work', name: 'Work', isDefault: false, address: '456 Avenue Hassan II, Floor 3', city: 'Khemisset', country: 'Morocco' },
            { id: 'addr_3', type: 'university', name: 'University', isDefault: false, address: '789 Campus Road, Building A', city: 'Khemisset', country: 'Morocco' }
        ],
        paymentMethods: [
            { id: 'payment_1', type: 'visa', number: '•••• •••• •••• 4589', expiry: '12/26', isDefault: true },
            { id: 'payment_2', type: 'mastercard', number: '•••• •••• •••• 8823', expiry: '08/25', isDefault: false }
        ],
        cashOnDelivery: true,
        notifications: { push: true, email: true, sms: false },
        language: 'en',
        darkMode: false,
        twoFactorAuth: true
    },
    {
        id: 'profile_2',
        name: 'yassine harmati',
        email: 'yassine.smith@email.com',
        phone: '+212 7XX XXX XXX',
        avatar: 'assets/landing_kwala.png',
        isPremium: false,
        isVerified: true,
        memberSince: 'March 2024',
        dateOfBirth: 'June 22, 1992',
        gender: 'Female',
        stats: { totalOrders: 45, totalSpent: 890, favorites: 12, addresses: 3 },
        addresses: [
            { id: 'addr_4', type: 'home', name: 'Home', isDefault: true, address: '321 Rue Al Mouawad', city: 'Khemisset', country: 'Morocco' }
        ],
        paymentMethods: [
            { id: 'payment_3', type: 'visa', number: '•••• •••• •••• 1234', expiry: '05/27', isDefault: true }
        ],
        cashOnDelivery: true,
        notifications: { push: true, email: true, sms: true },
        language: 'en',
        darkMode: false,
        twoFactorAuth: false
    },
    {
        id: 'profile_3',
        name: 'Family Account',
        email: 'family@email.com',
        phone: '+212 6XX XXX XXX',
        avatar: 'assets/landing_kwala.png',
        isPremium: true,
        isVerified: false,
        memberSince: 'December 2023',
        dateOfBirth: '',
        gender: '',
        stats: { totalOrders: 256, totalSpent: 4200, favorites: 8, addresses: 2 },
        addresses: [
            { id: 'addr_5', type: 'home', name: 'Home', isDefault: true, address: '555 Residence Familiale', city: 'Khemisset', country: 'Morocco' }
        ],
        paymentMethods: [
            { id: 'payment_4', type: 'mastercard', number: '•••• •••• •••• 9999', expiry: '11/25', isDefault: true }
        ],
        cashOnDelivery: false,
        notifications: { push: true, email: false, sms: true },
        language: 'fr',
        darkMode: true,
        twoFactorAuth: true
    }
];

// Initialize profiles in localStorage if not exists
function initializeProfiles() {
    if (!localStorage.getItem('kwala_profiles')) {
        localStorage.setItem('kwala_profiles', JSON.stringify(defaultProfiles));
    }
    if (!localStorage.getItem('kwala_current_profile')) {
        localStorage.setItem('kwala_current_profile', 'profile_1');
    }
}

// Get all profiles
function getProfiles() {
    return JSON.parse(localStorage.getItem('kwala_profiles')) || [];
}

// Get current profile
function getCurrentProfile() {
    const currentId = localStorage.getItem('kwala_current_profile');
    const profiles = getProfiles();
    return profiles.find(p => p.id === currentId) || profiles[0];
}

// Set current profile
function setCurrentProfile(profileId) {
    localStorage.setItem('kwala_current_profile', profileId);
    loadProfileData();
}

// Add new profile
function addProfile(profileData) {
    const profiles = getProfiles();
    const newProfile = {
        id: 'profile_' + Date.now(),
        ...profileData,
        stats: { totalOrders: 0, totalSpent: 0, favorites: 0, addresses: 0 },
        addresses: [],
        paymentMethods: [],
        cashOnDelivery: true,
        notifications: { push: true, email: true, sms: false },
        language: 'en',
        darkMode: false,
        twoFactorAuth: false,
        isPremium: false,
        isVerified: false,
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    profiles.push(newProfile);
    localStorage.setItem('kwala_profiles', JSON.stringify(profiles));
    return newProfile;
}

// Update profile
function updateProfile(profileId, updates) {
    const profiles = getProfiles();
    const index = profiles.findIndex(p => p.id === profileId);
    if (index !== -1) {
        profiles[index] = { ...profiles[index], ...updates };
        localStorage.setItem('kwala_profiles', JSON.stringify(profiles));
        return profiles[index];
    }
    return null;
}

// Delete profile
function deleteProfile(profileId) {
    const profiles = getProfiles();
    if (profiles.length <= 1) {
        alert('Cannot delete the last profile. At least one profile is required.');
        return false;
    }
    const filteredProfiles = profiles.filter(p => p.id !== profileId);
    localStorage.setItem('kwala_profiles', JSON.stringify(filteredProfiles));
    if (localStorage.getItem('kwala_current_profile') === profileId) {
        localStorage.setItem('kwala_current_profile', filteredProfiles[0].id);
    }
    return true;
}

// Counter animation function
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const current = start + (target - start) * easeOut;
        element.textContent = Math.floor(current).toLocaleString();
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    requestAnimationFrame(updateCounter);
}

// Load profile data into the page
function loadProfileData() {
    const profile = getCurrentProfile();
    if (!profile) return;

    // Update profile header
    const profileImage = document.getElementById('profileImage');
    if (profileImage) profileImage.src = profile.avatar;
    
    const nameEl = document.querySelector('.profile-details h1');
    if (nameEl) nameEl.textContent = profile.name;
    
    const emailEl = document.querySelector('.profile-email');
    if (emailEl) emailEl.innerHTML = `<i class="fas fa-envelope"></i> ${profile.email}`;
    
    const phoneEl = document.querySelector('.profile-phone');
    if (phoneEl) phoneEl.innerHTML = `<i class="fas fa-phone"></i> ${profile.phone}`;
    
    // Update badges
    const badgesContainer = document.querySelector('.profile-badges');
    if (badgesContainer) {
        badgesContainer.innerHTML = '';
        if (profile.isPremium) {
            badgesContainer.innerHTML += '<span class="badge premium"><i class="fas fa-crown"></i> Premium Member</span>';
        }
        if (profile.isVerified) {
            badgesContainer.innerHTML += '<span class="badge verified"><i class="fas fa-check-circle"></i> Verified</span>';
        }
    }
}

// ========================================
// DASHBOARD PAGE JavaScript - Enhanced Version
// ========================================
function initDashboard() {
    // Check if we're on dashboard page by looking for dashboard-specific elements
    if (!document.querySelector('.bento-dashboard-body') || !document.getElementById('ordersChart')) {
        return false;
    }

    // Add floating orbs to dashboard background
    addDashboardBackgroundEffects();

    // Enhanced Animated Counter for KPI Values with number rolling effect
    const counters = document.querySelectorAll('.counter');
    const decimalCounters = document.querySelectorAll('.counter-decimal');
    
    const animateCounter = (element, target, duration = 2000, isDecimal = false) => {
        const start = 0;
        const startTime = performance.now();
        
        const formatNumber = (num) => {
            return isDecimal ? num.toFixed(2) : Math.floor(num).toLocaleString();
        };
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out-expo)
            const easeOut = 1 - Math.pow(1 - progress, 4);
            const current = start + (target - start) * easeOut;
            
            element.textContent = formatNumber(current);
            
            // Add glow effect during animation
            if (progress < 1) {
                element.style.textShadow = '0 0 20px rgba(124, 58, 237, 0.5)';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = formatNumber(target);
                element.style.textShadow = 'none';
            }
        };
        
        requestAnimationFrame(updateCounter);
    };
    
    // Start counter animations with staggered delay
    setTimeout(() => {
        counters.forEach((counter, index) => {
            const target = parseFloat(counter.dataset.target);
            setTimeout(() => {
                animateCounter(counter, target, 1500);
            }, index * 150);
        });
        
        decimalCounters.forEach((counter, index) => {
            const target = parseFloat(counter.dataset.target);
            setTimeout(() => {
                animateCounter(counter, target, 1500, true);
            }, index * 150);
        });
    }, 500);
    
    // Add 3D tilt effect to KPI cards
    addTiltEffectToCards();
    
    // Add staggered animation to table rows
    animateTableRows();
    
    // Chart.js Configuration with enhanced effects
    
    // 1. Orders Line Chart with animated drawing
    const lineCtx = document.getElementById('ordersChart').getContext('2d');
    const lineGradient = lineCtx.createLinearGradient(0, 0, 0, 300);
    lineGradient.addColorStop(0, 'rgba(220, 208, 240, 0.8)');
    lineGradient.addColorStop(1, 'rgba(220, 208, 240, 0)');

    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Orders',
                data: [12, 19, 8, 17, 22, 30, 25],
                backgroundColor: lineGradient,
                borderColor: '#463C6E',
                borderWidth: 3,
                pointBackgroundColor: '#463C6E',
                pointRadius: 6,
                pointHoverRadius: 10,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { 
                y: { 
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(70, 60, 110, 0.08)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: { legend: { display: false } },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
        }
    });

    // 2. Yearly Sales Bar Chart with animated bars
    const barCtx = document.getElementById('yearlySalesChart').getContext('2d');
    
    // Create gradient for bars
    const barGradient = barCtx.createLinearGradient(0, 0, 0, 300);
    barGradient.addColorStop(0, '#7C3AED');
    barGradient.addColorStop(1, '#DCD0F0');
    
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Monthly Sales',
                data: [12000, 19000, 15000, 21000, 18000, 22000, 25000, 23000, 20000, 24000, 27000, 30000],
                backgroundColor: barGradient,
                borderColor: '#463C6E',
                borderWidth: 1,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { 
                y: { 
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(70, 60, 110, 0.08)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: { 
                legend: { display: false }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            },
            hover: {
                backgroundColor: 'rgba(124, 58, 237, 0.2)',
            }
        }
    });

    // Add smooth scroll reveal for dashboard elements
    addScrollRevealToDashboard();

    return true;
}

// Add floating orbs and particle effects to dashboard background
function addDashboardBackgroundEffects() {
    const body = document.querySelector('.bento-dashboard-body');
    if (!body) return;

    // Create floating orbs
    for (let i = 0; i < 5; i++) {
        const orb = document.createElement('div');
        orb.className = 'dashboard-orb';
        orb.style.cssText = `
            position: fixed;
            width: ${Math.random() * 300 + 200}px;
            height: ${Math.random() * 300 + 200}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
            animation: orbFloat ${15 + Math.random() * 10}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        body.appendChild(orb);
    }

    // Add custom animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes orbFloat {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(30px, -30px) scale(1.1); }
            50% { transform: translate(-20px, 20px) scale(0.95); }
            75% { transform: translate(20px, 30px) scale(1.05); }
        }
        
        .dashboard-orb:nth-child(odd) {
            background: radial-gradient(circle, rgba(244, 113, 182, 0.1) 0%, transparent 70%);
        }
    `;
    document.head.appendChild(style);
}

// Add 3D tilt effect to dashboard cards
function addTiltEffectToCards() {
    const cards = document.querySelectorAll('.kpi-card, .bento-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            card.style.zIndex = '1';
        });
    });
}

// Animate table rows with staggered effect
function animateTableRows() {
    const rows = document.querySelectorAll('.activity-feed tbody tr');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.1 });
    
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-30px)';
        row.style.transition = `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;
        observer.observe(row);
    });
}

// Add scroll reveal animations to dashboard elements
function addScrollRevealToDashboard() {
    const elements = document.querySelectorAll('.kpi-card, .bento-card, .yearly-sales-container');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('dashboard-reveal');
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px) scale(0.95)';
        el.style.transition = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s`;
        observer.observe(el);
    });
    
    // Add CSS for reveal
    const style = document.createElement('style');
    style.textContent = `
        .dashboard-reveal {
            opacity: 1 !important;
            transform: translateY(0) scale(1) !important;
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// ANALYTICS PAGE JavaScript
// ========================================
function initAnalytics() {
    // Check if we're on analytics page
    if (!document.querySelector('.analytics-kpi-grid')) {
        return false;
    }

    // Animated Counter Function
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseFloat(counter.dataset.count);
            const isDecimal = counter.dataset.decimal === 'true';
            const prefix = counter.dataset.prefix || '';
            const suffix = counter.dataset.suffix || '';
            const duration = 2000;
            const startTime = performance.now();
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (ease-out-expo)
                const easeProgress = 1 - Math.pow(2, -10 * progress);
                
                const currentValue = target * easeProgress;
                
                if (isDecimal) {
                    counter.textContent = prefix + currentValue.toFixed(2) + suffix;
                } else {
                    counter.textContent = prefix + Math.floor(currentValue).toLocaleString() + suffix;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }
            
            requestAnimationFrame(updateCounter);
        });
    }

    // 3D Tilt Effect
    function initTiltEffect() {
        const cards = document.querySelectorAll('[data-tilt]');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }

    // Staggered Entrance Animation
    function staggerEntrance() {
        const cards = document.querySelectorAll('.analytics-kpi-card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) scale(0.9)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        });
    }

    // Initialize
    staggerEntrance();
    
    setTimeout(() => {
        animateCounters();
        initTiltEffect();
    }, 800);

    // Re-animate on scroll (for secondary stats)
    let secondaryAnimated = false;
    const secondaryStats = document.querySelector('.secondary-stats');
    
    if (secondaryStats) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !secondaryAnimated) {
                    secondaryAnimated = true;
                    const miniCounters = entry.target.querySelectorAll('[data-count]');
                    miniCounters.forEach(counter => {
                        const target = parseFloat(counter.dataset.count);
                        const isDecimal = counter.dataset.decimal === 'true';
                        const suffix = counter.dataset.suffix || '';
                        const duration = 1500;
                        const startTime = performance.now();
                        
                        function updateCounter(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const easeProgress = 1 - Math.pow(2, -10 * progress);
                            const currentValue = target * easeProgress;
                            
                            counter.textContent = isDecimal ? currentValue.toFixed(1) : Math.floor(currentValue) + suffix;
                            
                            if (progress < 1) {
                                requestAnimationFrame(updateCounter);
                            }
                        }
                        
                        requestAnimationFrame(updateCounter);
                    });
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(secondaryStats);
    }

    return true;
}

// ========================================
// PROFILE PAGE JavaScript
// ========================================
function initProfile() {
    // Check if we're on profile page
    if (!document.querySelector('.profile-main-content')) {
        return false;
    }

    // Animated Counter for Stats
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out-expo)
            const easeOut = 1 - Math.pow(1 - progress, 4);
            const current = start + (target - start) * easeOut;
            
            element.textContent = Math.floor(current).toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(updateCounter);
    };
    
    // Start counter animations with staggered delay
    setTimeout(() => {
        counters.forEach((counter, index) => {
            const target = parseFloat(counter.dataset.target);
            setTimeout(() => {
                animateCounter(counter, target, 1500);
            }, index * 150);
        });
    }, 500);

    // Avatar Upload Preview
    const avatarUpload = document.getElementById('avatarUpload');
    const profileImage = document.getElementById('profileImage');
    
    if (avatarUpload && profileImage) {
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileImage.src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Address Item Click Handler
    const addressItems = document.querySelectorAll('.address-item');
    addressItems.forEach(item => {
        item.addEventListener('click', function() {
            addressItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Language Selector
    const languageSelect = document.querySelector('.language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const lang = this.value;
            // In a real app, this would trigger language change
            console.log('Language changed to:', lang);
        });
    }

    // Reorder Button Handler
    const reorderButtons = document.querySelectorAll('.btn-reorder');
    reorderButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.textContent = 'Added!';
            this.classList.add('success');
            setTimeout(() => {
                this.textContent = 'Reorder';
                this.classList.remove('success');
            }, 2000);
        });
    });

    // Logout Handler
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if(confirm('Are you sure you want to log out?')) {
                // In a real app, this would handle logout
                console.log('Logging out...');
            }
        });
    }

    return true;
}

// ========================================
// INDEX PAGE JavaScript (Common functions)
// ========================================
function initIndex() {
    // Check if we're on index page by looking for index-specific elements
    if (!document.getElementById('preloader') || !document.querySelector('.hero')) {
        return false;
    }

    // --- 1. Preloader ---
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hide');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });

    // --- 2. Scroll Progress Bar ---
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });

    // --- 3. Header Scroll Effect ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 4. Add Enhanced Particles with colors ---
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    
    const particleColors = ['particle-1', 'particle-2', 'particle-3', 'particle-4', 'particle-5', 'particle-6'];
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle ' + particleColors[i % particleColors.length];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.width = (Math.random() * 6 + 4) + 'px';
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
    }
    document.body.appendChild(particlesContainer);

    // --- 5. Add Glow Orbs Background ---
    const glowOrbsContainer = document.createElement('div');
    glowOrbsContainer.className = 'glow-orbs';
    glowOrbsContainer.innerHTML = `
        <div class="glow-orb glow-orb-1"></div>
        <div class="glow-orb glow-orb-2"></div>
        <div class="glow-orb glow-orb-3"></div>
    `;
    document.body.insertBefore(glowOrbsContainer, document.body.firstChild);

    // --- 6. Parallax Effect for Hero Image ---
    const heroImage = document.querySelector('.hero-image img');
    
    if (heroImage) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 50;
            const y = (window.innerHeight / 2 - e.clientY) / 50;
            
            heroImage.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // --- 7. Infinite Marquee/Logo Scroll Setup ---
    const scroller = document.querySelector('.marquee-track');
    if (scroller) {
        const scrollerContent = Array.from(scroller.children);
        scrollerContent.forEach(item => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute('aria-hidden', true);
            scroller.appendChild(duplicatedItem);
        });
    }

    // --- 8. Scroll Reveal Animation with Staggering ---
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.feature-box, .hero-text, .hero-image, .partners, .features-intro, .download-section');
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in-section');
        el.style.transitionDelay = (index * 0.1) + 's';
        observer.observe(el);
    });

    // --- 9. 3D Tilt Effect for Feature Cards ---
    const featureBoxes = document.querySelectorAll('.feature-box.feature-text');
    
    featureBoxes.forEach(box => {
        box.addEventListener('mousemove', (e) => {
            const rect = box.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            box.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        box.addEventListener('mouseleave', () => {
            box.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // --- 10. Smooth Scrolling for Header Links ---
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

    // --- 11. Floating Button Magnetic Effect ---
    const floatingBtn = document.getElementById('floating-order-btn');
    
    if (floatingBtn) {
        document.addEventListener('mousemove', (e) => {
            const rect = floatingBtn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distX = e.clientX - centerX;
            const distY = e.clientY - centerY;
            const distance = Math.sqrt(distX * distX + distY * distY);
            
            if (distance < 150) {
                const moveX = distX * 0.3;
                const moveY = distY * 0.3;
                floatingBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                floatingBtn.style.transform = 'translate(0, 0)';
            }
        });
    }

    // --- 12. Counter Animation for Stats ---
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current) + '+';
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + '+';
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    // --- 13. Language Dropdown Logic & Translations ---
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const currentLangSpan = document.getElementById('currentLang');

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
            feature1_desc: "We don't do crazy fees. It's the same amount you'll pay in the restaurant plus the location-based service fees. You want to pick it up from the restaurant ? Awesome, we won't charge you a penny for the service fees.",
            feature2_subtitle: "Flexibility",
            feature2_title: "Wrong Order ? Cancel It",
            feature2_desc: "Made an order by error ? Kwala offers you a 5 minutes window of free cancellation. No pressure.",
            feature3_subtitle: "Control",
            feature3_title: "Your Meal, Your Calls",
            feature3_desc: "We provide you with a store-specific set of customizations going from how you want your meal cooked to what ingredients to keep or to add. We don't call it YOUR Meal for nothing.",
            feature4_subtitle: "Convenience",
            feature4_title: "Pay With Ease",
            feature4_desc: "With integrating cards payments as one of our priorities, We do Tap and Pay so you can use Your watch, phone, or card as your wallet. Cash ? That's a method we'll ALWAYS support.",
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
            feature4_desc: "L'intégration des paiements par carte étant l'une de nos priorités, nous proposons le paiement sans contact pour que vous puissiez utiliser votre montre, téléphone ou carte comme portefeuille C'est une méthode que nous soutiendrons TOUJOURS.",
            download_subtitle: "Convaincu ? Qu'attendez-vous ?",
            download_title: "Téléchargez l'app & <br> Commandez. Espèces ? !",
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
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', lang);
        }

        const linkElements = document.querySelectorAll('[data-link]');
        linkElements.forEach(el => {
            const baseLink = el.getAttribute('data-link');
            if (lang === 'en') {
                el.setAttribute('href', baseLink + '.html');
            } else {
                el.setAttribute('href', baseLink + '-' + lang + '.html');
            }
        });

        if (currentLangSpan) {
            currentLangSpan.textContent = lang.toUpperCase();
        }
    }

    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.remove('show');
            }
        });

        const langOptions = langDropdown.querySelectorAll('div');
        langOptions.forEach(option => {
            option.addEventListener('click', () => {
                const selectedLang = option.getAttribute('data-lang');
                setLanguage(selectedLang);
                langDropdown.classList.remove('show');
            });
        });
    }

    // --- 14. Add entrance animations to elements on load ---
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // --- 15. Add scroll-based parallax to sections ---
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.classList.contains('hero') || section.classList.contains('partners')) return;
        
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        sectionObserver.observe(section);
    });

    // --- 16. Add ripple effect to buttons ---
    const buttons = document.querySelectorAll('.store-btn, .btn-edit-profile, .btn-secondary');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'rippleEffect 0.6s ease-out';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation style
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleEffect {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // --- 17. Enhanced cursor tracking for hero ---
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const heroImage = heroSection.querySelector('.hero-image img');
            if (heroImage) {
                const moveX = (x - 0.5) * 30;
                const moveY = (y - 0.5) * 30;
                heroImage.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
            }
        });
        
        heroSection.addEventListener('mouseleave', () => {
            const heroImage = heroSection.querySelector('.hero-image img');
            if (heroImage) {
                heroImage.style.transform = 'translate(0, 0) scale(1)';
            }
        });
    }

    // --- 18. Animated gradient text on hover ---
    const heroTitle = document.querySelector('.hero h1 span');
    if (heroTitle) {
        heroTitle.addEventListener('mouseenter', () => {
            heroTitle.style.animation = 'gradientShift 1s ease infinite';
        });
        heroTitle.addEventListener('mouseleave', () => {
            heroTitle.style.animation = 'gradientShift 5s ease infinite';
        });
    }

    // --- 19. Smooth scroll with momentum ---
    let isScrolling = false;
    document.addEventListener('wheel', () => {
        if (!isScrolling) {
            isScrolling = true;
            setTimeout(() => isScrolling = false, 50);
        }
    }, { passive: true });

    return true;
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function () {
    // Initialize profiles for profile management system
    initializeProfiles();
    
    // Load profile data if on profile page
    loadProfileData();
    
    // Initialize page-specific functionality
    initIndex();
    initDashboard();
    initAnalytics();
    initProfile();
});

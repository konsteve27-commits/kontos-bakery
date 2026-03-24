document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Δυναμικό Έτος στο Footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Intersection Observer για Animations (Reveal elements)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Εκτελείται μόνο μία φορά
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => {
        observer.observe(el);
    });

    // 3. Hamburger Menu & Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');
    const header = document.querySelector('.site-header');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : ''; // Κλείδωμα scroll
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // 4. Αλλαγή Header κατά το Scroll (Glassmorphism effect adjustment)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0';
        } else {
            header.style.padding = '0'; // Διατηρείται σταθερό στο νέο design, αλλά μπορεί να προσαρμοστεί
        }
    });

    // 5. Tabs & Slider Logic για τα Προϊόντα
    const tabBtns = document.querySelectorAll('.tab-btn');
    const sliders = document.querySelectorAll('.slider-container');

    // Αλλαγή Tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Αφαίρεση active class από όλα
            tabBtns.forEach(b => b.classList.remove('active'));
            sliders.forEach(s => s.classList.remove('active'));

            // Προσθήκη active στο επιλεγμένο
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Πλοήγηση Slider (Βέλη)
    sliders.forEach(slider => {
        const track = slider.querySelector('.slider-track');
        const prevBtn = slider.querySelector('.prev');
        const nextBtn = slider.querySelector('.next');

        const scrollAmount = () => {
            const slideWidth = track.querySelector('.product-slide').offsetWidth;
            const gap = parseFloat(getComputedStyle(track).gap) || 0;
            return slideWidth + gap;
        };

        if (prevBtn && nextBtn) {
            nextBtn.addEventListener('click', () => {
                track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
            });

            prevBtn.addEventListener('click', () => {
                track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
            });
        }
    });

    // 6. Δυναμικός Έλεγχος Ωραρίου Delivery
    const statusBadge = document.getElementById('store-status');
    if (statusBadge) {
        const now = new Date();
        const day = now.getDay(); // 0 = Κυριακή, 1 = Δευτέρα, ..., 6 = Σάββατο
        const hour = now.getHours();

        // Ωράριο: Δευτέρα (1) έως Σάββατο (6), 06:00 - 12:00
        const isOpen = day >= 1 && day <= 6 && hour >= 6 && hour < 14;

        if (isOpen) {
            statusBadge.textContent = 'Ανοιχτά τώρα';
            statusBadge.classList.add('open');
            statusBadge.classList.remove('closed');
        } else {
            statusBadge.textContent = 'Κλειστά';
            statusBadge.classList.add('closed');
            statusBadge.classList.remove('open');
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');

    // 1. Υπολογισμός του κεντρικού στοιχείου
    function updateActiveSlide() {
        if (!track || slides.length === 0) return;

        const trackRect = track.getBoundingClientRect();
        const trackCenter = trackRect.left + (trackRect.width / 2);
        
        let closestSlide = null;
        let closestDistance = Infinity;

        slides.forEach(slide => {
            const slideRect = slide.getBoundingClientRect();
            const slideCenter = slideRect.left + (slideRect.width / 2);
            const distance = Math.abs(trackCenter - slideCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestSlide = slide;
            }
        });

        // Εφαρμογή κλάσης active
        slides.forEach(slide => slide.classList.remove('active'));
        if (closestSlide) {
            closestSlide.classList.add('active');
        }
    }

    // 2. Πλοήγηση με βέλη
    if (prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            const slideWidth = slides[0].clientWidth;
            track.scrollBy({ left: slideWidth, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            const slideWidth = slides[0].clientWidth;
            track.scrollBy({ left: -slideWidth, behavior: 'smooth' });
        });
    }

    // 3. Ενημέρωση κατά το scroll και το resize
    track.addEventListener('scroll', () => {
        // Χρήση requestAnimationFrame για ομαλότητα
        window.requestAnimationFrame(updateActiveSlide);
    });
    
    window.addEventListener('resize', updateActiveSlide);

    // Αρχική κλήση για να μεγεθυνθεί το πρώτο στοιχείο
    setTimeout(updateActiveSlide, 100);
});
document.addEventListener('DOMContentLoaded', () => {

    // 1. Δυναμικό Έτος Footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // 2. Intersection Observer για Reveal Animations
    const revealOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 3. Hamburger Menu & Scroll Lock
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        const toggleMenu = (isActive) => {
            hamburger.setAttribute('aria-expanded', isActive);
            hamburger.classList.toggle('active', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        };

        hamburger.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            toggleMenu(isActive);
        });

        document.querySelectorAll('.nav-links li a').forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                toggleMenu(false);
            });
        });
    }

    // 4. Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }, { passive: true });

    // 5. Ωράριο Delivery Status
    const statusBadge = document.getElementById('store-status');
    if (statusBadge) {
        const checkStatus = () => {
            const now = new Date();
            const day = now.getDay(); // 0 = Κυριακή, 1 = Δευτέρα
            const hour = now.getHours();
            // Ανοιχτά Δευτέρα (1) έως Σάββατο (6), 06:00 έως 14:00 (13:59)
            const isOpen = day >= 1 && day <= 6 && hour >= 6 && hour < 14;

            statusBadge.textContent = isOpen ? 'Ανοιχτά τώρα' : 'Κλειστά';
            statusBadge.className = `status-badge ${isOpen ? 'open' : 'closed'}`;
        };
        checkStatus();
        setInterval(checkStatus, 60000); // Ανανέωση ανά λεπτό
    }

    // 6. Carousel Logic (Βελτιστοποιημένο)
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');

    if (track && slides.length > 0) {

        // Ασφαλής επιβολή εστίασης στο πρώτο στοιχείο
        setTimeout(() => {
            slides[0].scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' });
        }, 100);

        const getScrollAmount = () => {
            const gap = parseFloat(getComputedStyle(track).gap) || 32;
            return slides[0].offsetWidth + gap;
        };

        if (prevBtn && nextBtn) {
            nextBtn.addEventListener('click', () => {
                track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            });

            prevBtn.addEventListener('click', () => {
                track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
            });
        }

        // Αυστηρός περιορισμός του observer στο ακριβές κέντρο (45% περιθώριο αριστερά/δεξιά)
        const carouselOptions = {
            root: track,
            rootMargin: '0px -45% 0px -45%',
            threshold: 0
        };

        const carouselObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    slides.forEach(slide => slide.classList.remove('active'));
                    entry.target.classList.add('active');
                }
            });
        }, carouselOptions);

        slides.forEach(slide => carouselObserver.observe(slide));
    }
});
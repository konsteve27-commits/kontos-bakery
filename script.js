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
            const day = now.getDay();
            const hour = now.getHours();
            const isOpen = day >= 1 && day <= 6 && hour >= 6 && hour < 14;

            statusBadge.textContent = isOpen ? 'Ανοιχτά τώρα' : 'Κλειστά';
            statusBadge.className = `status-badge ${isOpen ? 'open' : 'closed'}`;
        };
        checkStatus();
        setInterval(checkStatus, 60000);
    }

    // 6. & 7. Ενοποιημένη Λογική Carousel και Φιλτραρίσματος
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (track && slides.length > 0) {

        // Λογική Πλοήγησης (Βέλη)
        if (prevBtn && nextBtn) {
            const getScrollAmount = () => {
                const visibleSlide = Array.from(slides).find(s => !s.classList.contains('hidden'));
                const slideWidth = visibleSlide ? visibleSlide.offsetWidth : 320;
                const gap = parseFloat(getComputedStyle(track).gap) || 32;
                return slideWidth + gap;
            };

            nextBtn.addEventListener('click', () => {
                track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            });

            prevBtn.addEventListener('click', () => {
                track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
            });
        }

        // Μαθηματικός υπολογισμός κεντρικού στοιχείου
        const updateActiveSlide = () => {
            const trackRect = track.getBoundingClientRect();
            const trackCenter = trackRect.left + trackRect.width / 2;
            let closestSlide = null;
            let minDistance = Infinity;

            slides.forEach(slide => {
                if (slide.classList.contains('hidden')) return;

                const slideRect = slide.getBoundingClientRect();
                const slideCenter = slideRect.left + slideRect.width / 2;
                const distance = Math.abs(trackCenter - slideCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestSlide = slide;
                }
            });

            // Εφαρμογή κλάσης active αποκλειστικά στο κεντρικό στοιχείο
            slides.forEach(slide => {
                if (slide === closestSlide) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
        };

        // Έλεγχος κεντραρίσματος κατά την κύλιση (scroll)
        track.addEventListener('scroll', () => {
            requestAnimationFrame(updateActiveSlide);
        }, { passive: true });

        // Λογική Φιλτραρίσματος
        if (filterBtns.length > 0) {
            const defaultCategory = 'bread';

            const centerFirstVisibleSlide = () => {
                // Εξαναγκασμός reflow για να αναγνωριστούν τα νέα πλάτη των στοιχείων
                void track.offsetWidth;

                // Ακαριαία μεταφορά στην αρχή. Λόγω των ::before (CSS) το 1ο στοιχείο πάει στο κέντρο
                track.scrollTo({ left: 0, behavior: 'auto' });

                // Άμεση ενημέρωση της μεγέθυνσης
                requestAnimationFrame(updateActiveSlide);
            };

            // Αρχική κατάσταση κατά τη φόρτωση
            slides.forEach(slide => {
                // Αφαίρεση οποιουδήποτε inline style που προκαλεί σύγκρουση
                slide.style.opacity = '';
                slide.style.transform = '';

                if (slide.dataset.category !== defaultCategory) {
                    slide.classList.add('hidden');
                }
            });

            // Κεντράρισμα πρώτου στοιχείου μόλις φορτώσει το DOM
            setTimeout(centerFirstVisibleSlide, 50);

            // Διαχείριση κλικ στα κουμπιά κατηγοριών
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (btn.classList.contains('active')) return;

                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const selectedCategory = btn.dataset.filter;

                    slides.forEach(slide => {
                        // Καθαρισμός inline styles σε κάθε αλλαγή
                        slide.style.opacity = '';
                        slide.style.transform = '';

                        if (slide.dataset.category === selectedCategory) {
                            slide.classList.remove('hidden');
                        } else {
                            slide.classList.add('hidden');
                            slide.classList.remove('active');
                        }
                    });

                    centerFirstVisibleSlide();
                });
            });
        }
    }
});
// 8. Λογική εμφάνισης/απόκρυψης χαρτών καταστημάτων
const mapButtons = document.querySelectorAll('.map-pin-btn');

mapButtons.forEach(btn => {
    btn.addEventListener('click', function () {
        // Έλεγχος κατάστασης
        const isActive = this.classList.contains('active');

        // Κλείσιμο όλων των ανοιχτών χαρτών (προαιρετικό - αν επιθυμείται να ανοίγει μόνο ένας)

        document.querySelectorAll('.map-pin-btn.active').forEach(activeBtn => {
            if (activeBtn !== this) {
                activeBtn.classList.remove('active');
                activeBtn.setAttribute('aria-expanded', 'false');
                activeBtn.closest('li').querySelector('.store-map-container').classList.remove('active');
            }
        });


        // Εναλλαγή κατάστασης στο τρέχον στοιχείο
        this.classList.toggle('active');
        this.setAttribute('aria-expanded', !isActive);

        const mapContainer = this.closest('li').querySelector('.store-map-container');
        if (mapContainer) {
            mapContainer.classList.toggle('active');
        }
    });
});
// 9. Scroll Progress Bar & Hero Parallax Effect
const scrollProgress = document.getElementById('scroll-progress');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;

    // Υπολογισμός και εφαρμογή πλάτους Progress Bar
    if (scrollProgress) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = `${scrollPercent}%`;
    }

    // Εφαρμογή Parallax στο Hero Content (μετατόπιση προς τα κάτω με διαφορετική ταχύτητα)
    if (heroContent && scrollTop <= window.innerHeight) {
        // Ο πολλαπλασιαστής 0.4 καθορίζει την ταχύτητα του parallax
        heroContent.style.transform = `translateY(${scrollTop * 0.4}px)`;
        heroContent.style.opacity = 1 - (scrollTop / window.innerHeight) * 1.5;
    }
}, { passive: true });

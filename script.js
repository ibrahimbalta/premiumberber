// ============================================
//  PREMIUM BARBER — script.js
//  Dynamic content, Before/After slider,
//  Live Status Badge, Scroll reveals
// ============================================

// ---------- Default Data ----------
const defaultData = {
    settings: {
        whatsapp: '905551234567',
        address: 'Merkez Mahallesi, Atatürk Caddesi No: 42, İstanbul',
        businessHours: '09:00 - 21:00'
    },
    workingHours: {
        open: '09:00',
        close: '21:00',
        days: 'Pazartesi - Pazar'
    },
    services: [
        { name: 'Modern Saç Kesimi', desc: 'Kafa yapınıza ve tarzınıza en uygun modern fade, taper ve klasik kesim teknikleri.', price: '250₺', icon: 'fa-scissors' },
        { name: 'Sakal Tasarımı', desc: 'Ustura ile hassas düzeltmeler ve yüz tipinize uygun sakal formları.', price: '150₺', icon: 'fa-mustache' },
        { name: 'Damat Tıraşı', desc: 'En özel gününüzde kusursuz görünmeniz için detaylı VIP hazırlık süreci.', price: '800₺', icon: 'fa-user-tie' },
        { name: 'Cilt Bakımı', desc: 'Siyah nokta temizliği, buhar terapisi ve canlandırıcı maske uygulamaları.', price: '200₺', icon: 'fa-spa' },
        { name: 'Saç Kamuflaj', desc: 'Beyaz saçlar için doğal görünümlü, pratik renklendirme çözümleri.', price: '300₺', icon: 'fa-eye-dropper' },
        { name: 'Çocuk Kesimi', desc: 'Minik misafirlerimiz için sabırlı ve eğlenceli tıraş deneyimi.', price: '150₺', icon: 'fa-child' }
    ],
    about: {
        title: 'Premium Barber Deneyimi',
        text: 'Modern tekniklerle donatılmış profesyonel bir hizmet anlayışıyla, erkek müşterilerimize saç, sakal ve cilt bakımı alanlarında kapsamlı çözümler sunuyoruz. Salonumuzun maskülen ve rahatlatıcı atmosferinde, kendinizi yenilenmiş hissedeceksiniz.',
        image: 'assets/images/service-beard.png'
    },
    team: [
        {
            name: 'Ahmet Usta',
            role: 'Baş Berber',
            desc: '15 yıllık deneyimiyle modern fade ve klasik kesim tekniklerinde uzman.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
            instagram: '#'
        },
        {
            name: 'Mehmet Kaya',
            role: 'Sakal Uzmanı',
            desc: 'Sakal tasarımı ve ustura tıraşında ödüllü berber.',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
            instagram: '#'
        },
        {
            name: 'Can Demir',
            role: 'Stil Danışmanı',
            desc: 'Yüz analizi ve kişiye özel stil önerileri konusunda uzman.',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
            instagram: '#'
        }
    ],
    gallery: [
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1599351473299-d83950af757a?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1621605815841-aa88c82b0ad2?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1593702295094-ada74bc1939a?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?auto=format&fit=crop&q=80&w=600'
    ],
    testimonials: [
        { name: 'Ahmet Yılmaz', text: 'Gittiğim en iyi kuaför. İşinin gerçek ustası. Hem sakal hem saç kesimi mükemmel.', service: 'Düzenli Müşteri', rating: 5 },
        { name: 'Mehmet Kara', text: 'Damat tıraşım için geldim, harika bir deneyimdi. Çok özenli ve profesyonel bir hizmet aldım.', service: 'Damat Tıraşı', rating: 5 },
        { name: 'Can Demir', text: 'Oğlumu her zaman buraya getiriyorum. Çocuklara karşı çok sabırlı ve ilgili. Tavsiye ederim.', service: 'Çocuk Kesimi', rating: 5 }
    ],
    contact: {
        phone: '0555 123 45 67',
        map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.0!2d28.97!3d41.01!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAyJzAwLjAiTiAyOMKwNTgnMDAuMCJF!5e0!3m2!1str!2str!4v1684150000000!5m2!1str!2str',
        instagram: '#',
        facebook: '#',
        whatsapp: 'https://wa.me/905551234567'
    }
};

// Merge with any saved data
let savedData = {};
try {
    savedData = JSON.parse(localStorage.getItem('kuaforDB')) || {};
} catch (e) {
    savedData = {};
}

let db = {
    settings: { ...defaultData.settings, ...savedData.settings },
    workingHours: { ...defaultData.workingHours, ...savedData.workingHours },
    services: savedData.services || defaultData.services,
    about: { ...defaultData.about, ...savedData.about },
    team: savedData.team || defaultData.team,
    gallery: savedData.gallery || defaultData.gallery,
    testimonials: savedData.testimonials || defaultData.testimonials,
    contact: { ...defaultData.contact, ...savedData.contact }
};


// ============================================
//  DYNAMIC CONTENT RENDERER
// ============================================
function applyDynamicContent() {

    // --- General Settings ---
    const addressEl = document.getElementById('dyn-address');
    if (addressEl) addressEl.textContent = db.settings.address;

    const hoursEl = document.getElementById('dyn-hours');
    if (hoursEl) {
        const days = db.workingHours?.days || 'Hafta İçi & Hafta Sonu';
        const open = db.workingHours?.open || '09:00';
        const close = db.workingHours?.close || '21:00';
        hoursEl.textContent = `${days}: ${open} - ${close}`;
    }

    const phoneEl = document.getElementById('dyn-phone');
    if (phoneEl && db.contact?.phone) phoneEl.textContent = db.contact.phone;

    const mapIframe = document.getElementById('dyn-map');
    if (mapIframe && db.contact?.map) {
        if (mapIframe.src !== db.contact.map) {
            mapIframe.src = db.contact.map;
        }
    }

    // --- Social Links ---
    if (db.contact) {
        document.querySelectorAll('a[href*="instagram"]').forEach(link => {
            if (db.contact.instagram) link.href = db.contact.instagram;
        });
        document.querySelectorAll('a[href*="facebook"]').forEach(link => {
            if (db.contact.facebook) link.href = db.contact.facebook;
        });
        document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
            if (db.contact.whatsapp) link.href = db.contact.whatsapp;
        });
    }

    // --- Services ---
    const servicesGrid = document.getElementById('servicesGrid') || document.querySelector('.services-grid');
    if (servicesGrid && db.services) {
        servicesGrid.innerHTML = '';
        const iconMap = {
            'fa-scissors': 'fa-scissors',
            'fa-mustache': 'fa-face-grin-beam',
            'fa-user-tie': 'fa-user-tie',
            'fa-spa': 'fa-spa',
            'fa-eye-dropper': 'fa-eye-dropper',
            'fa-child': 'fa-child',
            'fa-cut': 'fa-scissors'
        };
        db.services.forEach((s, i) => {
            const iconClass = iconMap[s.icon] || 'fa-scissors';
            const delay = i * 80;
            servicesGrid.innerHTML += `
                <div class="service-card reveal" style="transition-delay: ${delay}ms;">
                    <i class="fas ${iconClass} service-icon"></i>
                    <h3>${s.name}</h3>
                    <p>${s.desc}</p>
                    ${s.price ? `<div class="service-price">${s.price}</div>` : ''}
                </div>`;
        });
        initRevealAnimations();
    }

    // --- About ---
    const aboutTitle = document.getElementById('dyn-about-title');
    const aboutText = document.getElementById('dyn-about-text');
    const aboutImg = document.querySelector('.about-image');
    if (aboutTitle && db.about) aboutTitle.textContent = db.about.title;
    if (aboutText && db.about) aboutText.textContent = db.about.text;
    if (aboutImg && db.about?.image) {
        aboutImg.style.backgroundImage = `url("${db.about.image}")`;
    }

    // --- Gallery ---
    const galleryGrid = document.getElementById('galleryGrid') || document.querySelector('.gallery-grid');
    if (galleryGrid && db.gallery) {
        galleryGrid.innerHTML = '';
        db.gallery.forEach((url, i) => {
            const delay = i * 60;
            galleryGrid.innerHTML += `
                <div class="gallery-item reveal" style="transition-delay: ${delay}ms;">
                    <img src="${url}" alt="Galeri ${i + 1}" loading="lazy">
                    <div class="gallery-overlay"><i class="fas fa-expand"></i></div>
                </div>`;
        });
        initRevealAnimations();
    }

    // --- Testimonials ---
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    if (testimonialsGrid && db.testimonials) {
        testimonialsGrid.innerHTML = '';
        db.testimonials.forEach((t, i) => {
            let stars = '';
            for (let s = 0; s < 5; s++) {
                stars += `<i class="fa${s < (t.rating || 5) ? 's' : 'r'} fa-star"></i>`;
            }
            const delay = i * 100;
            testimonialsGrid.innerHTML += `
                <div class="testimonial-card reveal" style="transition-delay: ${delay}ms;">
                    <div class="testimonial-stars">${stars}</div>
                    <p class="testimonial-text">"${t.text}"</p>
                    <div class="testimonial-author">
                        <div class="author-avatar"><i class="fas fa-user"></i></div>
                        <div>
                            <h4>${t.name}</h4>
                            <span>${t.service}</span>
                        </div>
                    </div>
                </div>`;
        });
        initRevealAnimations();
    }

    // --- Team ---
    const teamGrid = document.getElementById('teamGrid');
    if (teamGrid && db.team) {
        teamGrid.innerHTML = '';
        db.team.forEach((m, i) => {
            const delay = i * 120;
            teamGrid.innerHTML += `
                <div class="team-card reveal" style="transition-delay: ${delay}ms;">
                    <img class="team-card-img" src="${m.image}" alt="${m.name}" loading="lazy">
                    <div class="team-card-body">
                        <h3>${m.name}</h3>
                        <div class="team-role">${m.role}</div>
                        <p>${m.desc}</p>
                        <div class="team-social">
                            ${m.instagram ? `<a href="${m.instagram}" aria-label="Instagram"><i class="fab fa-instagram"></i></a>` : ''}
                        </div>
                    </div>
                </div>`;
        });
        initRevealAnimations();
    }

    // Update Live Status
    updateLiveStatus();
}


// ============================================
//  LIVE STATUS BADGE
// ============================================
function updateLiveStatus() {
    const badge = document.getElementById('liveStatusBadge');
    const statusText = document.getElementById('statusText');
    if (!badge || !statusText) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const openStr = db.workingHours?.open || '09:00';
    const closeStr = db.workingHours?.close || '21:00';

    const [openH, openM] = openStr.split(':').map(Number);
    const [closeH, closeM] = closeStr.split(':').map(Number);

    const openTime = openH * 60 + (openM || 0);
    const closeTime = closeH * 60 + (closeM || 0);

    if (currentTime >= openTime && currentTime < closeTime) {
        badge.classList.remove('closed');
        badge.classList.add('open');
        statusText.textContent = 'Şu Anda Açığız';
    } else {
        badge.classList.remove('open');
        badge.classList.add('closed');
        statusText.textContent = 'Şu Anda Kapalıyız';
    }
}


// ============================================
//  BEFORE / AFTER SLIDER
// ============================================
function initBeforeAfterSlider() {
    const container = document.getElementById('baSlider');
    const handle = document.getElementById('baHandle');
    if (!container || !handle) return;

    let isDragging = false;

    function getPosition(e) {
        const rect = container.getBoundingClientRect();
        let x;
        if (e.touches) {
            x = e.touches[0].clientX - rect.left;
        } else {
            x = e.clientX - rect.left;
        }
        return Math.max(0, Math.min(x, rect.width));
    }

    function updateSlider(x) {
        const rect = container.getBoundingClientRect();
        const percent = (x / rect.width) * 100;

        handle.style.left = percent + '%';

        const afterImg = container.querySelector('.ba-after');
        if (afterImg) {
            afterImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        }
    }

    function onStart(e) {
        isDragging = true;
        e.preventDefault();
        updateSlider(getPosition(e));
    }

    function onMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        updateSlider(getPosition(e));
    }

    function onEnd() {
        isDragging = false;
    }

    container.addEventListener('mousedown', onStart);
    container.addEventListener('touchstart', onStart, { passive: false });

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });

    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
}


// ============================================
//  NAVBAR SCROLL EFFECT
// ============================================
window.addEventListener('scroll', function () {
    const nav = document.getElementById('navbar');
    if (nav) {
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
});


// ============================================
//  SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});


// ============================================
//  SCROLL REVEAL ANIMATIONS
// ============================================
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal:not(.observed)');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => {
        el.classList.add('observed');
        revealObserver.observe(el);
    });
}

// Also observe static elements (about, booking)
function initStaticReveals() {
    const staticRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.about-content, .about-image, .booking-container, .info-section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.9s ease-out, transform 0.9s ease-out';
        staticRevealObserver.observe(el);
    });
}


// ============================================
//  BOOKING FORM
// ============================================
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;

        const message = `*🌟 [PREMIUM BARBER] 🌟*%0A%0A` +
            `*YENİ RANDEVU TALEBİ*%0A%0A` +
            `- *Müşteri:* ${name}%0A` +
            `- *Telefon:* ${phone}%0A` +
            `- *Hizmet:* ${service}%0A` +
            `- *Tarih:* ${date}%0A%0A` +
            `_Onayınızı bekliyorum. Teşekkürler._`;

        const waNumber = db.settings.whatsapp || '905551234567';
        const waUrl = `https://wa.me/${waNumber}?text=${message}`;
        window.open(waUrl, '_blank');
        bookingForm.reset();
    });
}


// ============================================
//  HAMBURGER MENU
// ============================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}


// ============================================
//  WHATSAPP FLOATING BUTTON SYNC
// ============================================
const whatsappFloat = document.getElementById('whatsappFloat');
if (whatsappFloat) {
    if (db.contact?.whatsapp) {
        whatsappFloat.href = db.contact.whatsapp;
    } else if (db.settings?.whatsapp) {
        whatsappFloat.href = `https://wa.me/${db.settings.whatsapp}`;
    }
}


// ============================================
//  INITIALIZATION
// ============================================
applyDynamicContent();
initBeforeAfterSlider();
initStaticReveals();

// Poll for admin changes (lightweight)
setInterval(() => {
    try {
        const fresh = JSON.parse(localStorage.getItem('kuaforDB'));
        if (fresh) {
            db = {
                settings: { ...defaultData.settings, ...fresh.settings },
                workingHours: { ...defaultData.workingHours, ...fresh.workingHours },
                services: fresh.services || defaultData.services,
                about: { ...defaultData.about, ...fresh.about },
                team: fresh.team || defaultData.team,
                gallery: fresh.gallery || defaultData.gallery,
                testimonials: fresh.testimonials || defaultData.testimonials,
                contact: { ...defaultData.contact, ...fresh.contact }
            };
            applyDynamicContent();
        }
    } catch (e) { /* silent */ }
}, 3000);

// Update live status every minute
setInterval(updateLiveStatus, 60000);

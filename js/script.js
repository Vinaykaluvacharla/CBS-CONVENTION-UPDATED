// Mobile Navigation Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        navbar.classList.add('scrolled'); // Ensure background is dark when menu open
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        if (window.scrollY <= 50) {
            navbar.classList.remove('scrolled');
        }
    }
});

// Sticky Navbar Background on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        // Only remove if mobile menu is not active
        if (!navLinks.classList.contains('active')) {
            navbar.classList.remove('scrolled');
        }
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Smooth scrolling for anchor links (fallback for Safari/older browsers not supporting CSS smooth scroll)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Adjust for fixed header height
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// ============================================================
// Gallery: Filter Tabs
// ============================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// ============================================================
// Lightbox
// ============================================================
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentIndex = 0;
let visibleItems = [];

function getVisibleItems() {
    return Array.from(galleryItems).filter(el => !el.classList.contains('hidden'));
}

function openLightbox(index) {
    visibleItems = getVisibleItems();
    currentIndex = index;
    renderLightbox();
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
    const video = lightboxContent.querySelector('video');
    if (video) video.pause();
    lightboxContent.innerHTML = '';
    lightboxCaption.textContent = '';
}

function renderLightbox() {
    const item = visibleItems[currentIndex];
    const thumb = item.querySelector('.gallery-thumb');
    const caption = item.querySelector('.gallery-overlay span')?.textContent || '';
    const type = item.dataset.type || 'image';
    const bgStyle = thumb.style.backgroundImage;

    const prevVideo = lightboxContent.querySelector('video');
    if (prevVideo) prevVideo.pause();
    lightboxContent.innerHTML = '';

    if (type === 'video') {
        const videoSrc = item.dataset.videoSrc;
        if (videoSrc) {
            const video = document.createElement('video');
            video.src = videoSrc;
            video.controls = true;
            video.autoplay = true;
            video.muted = true; // Best practice for autoplaying
            video.loop = true;
            lightboxContent.appendChild(video);
        }
    } else {
        const urlMatch = bgStyle.match(/url\(['"]?(.+?)['"]?\)/);
        if (urlMatch) {
            const img = document.createElement('img');
            img.src = urlMatch[1];
            img.alt = caption;
            lightboxContent.appendChild(img);
        }
    }

    lightboxCaption.textContent = caption;
    lightboxPrev.style.display = visibleItems.length > 1 ? 'flex' : 'none';
    lightboxNext.style.display = visibleItems.length > 1 ? 'flex' : 'none';
}

// Attach click to gallery items
galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
        visibleItems = getVisibleItems();
        const idx = visibleItems.indexOf(item);
        openLightbox(idx >= 0 ? idx : 0);
    });
});

lightboxClose.addEventListener('click', closeLightbox);

lightboxPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    renderLightbox();
});

lightboxNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    renderLightbox();
});

// Close on backdrop click
lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightboxOverlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; renderLightbox(); }
    if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % visibleItems.length; renderLightbox(); }
});

// Mobile Menu Toggle
if (document.querySelector('.mobile-menu-toggle')) {
    document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
        if (document.querySelector('.main-nav')) {
            document.querySelector('.main-nav').classList.toggle('active');
        }
    });
}

// Mobile Footer Accordion
document.querySelectorAll('.footer-toggle').forEach(function(toggle) {
    toggle.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            this.parentElement.classList.toggle('active');
        }
    });
});

// Professional Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const animatedElements = document.querySelectorAll('.service-card, .stat-box, .reason, .post-card, .testimonial-card, .hero-copy, .hero-media, .section-intro, .grow-card, .content-card, .feature-item');
animatedElements.forEach(el => observer.observe(el));

// Running Counter Animation
function animateCounter(el) {
    const text = el.innerText;
    const match = text.match(/([^\d]*)([\d\.,]+)([^\d]*)/);
    if (!match) return;
    
    const prefix = match[1];
    const targetStr = match[2].replace(/,/g, '');
    const suffix = match[3];
    const isFloat = targetStr.includes('.');
    const target = parseFloat(targetStr);
    const duration = 2000; // 2 seconds
    let startTimestamp = null;
    
    const formatNumber = (num) => {
        if (isFloat) return num.toFixed(1);
        return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const current = target * easeProgress;
        
        el.innerText = prefix + formatNumber(current) + suffix;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            el.innerText = text;
        }
    };
    window.requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.stat-box strong, .hero-stat b, .metric b').forEach(el => {
    counterObserver.observe(el);
});


// Testimonial slider functionality
window.slideTestimonials = function(direction) {
    const wrap = document.querySelector('.testimonial-wrap');
    if (!wrap) return;
    const card = wrap.querySelector('.testimonial-card');
    if (!card) return;
    
    const scrollAmount = card.offsetWidth + 14; 
    
    if (direction === 'left') {
        wrap.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        wrap.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    
    setTimeout(() => {
        const dots = document.querySelectorAll('.dots span');
        if(!dots.length) return;
        const scrollPercentage = wrap.scrollLeft / (wrap.scrollWidth - wrap.clientWidth || 1);
        const activeIndex = Math.round(scrollPercentage * (dots.length - 1));
        
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.style.background = '#004887'; // primary blue
            } else {
                dot.style.background = '#dce5ee';
            }
        });
    }, 400); 
};

// Initialize dots based on number of scrolls
setTimeout(() => {
    const dotsContainer = document.querySelector('.dots');
    const wrap = document.querySelector('.testimonial-wrap');
    if (dotsContainer && wrap) {
        // Default we show 2 at a time, there are 6, so 3 positions (0, 2, 4)
        dotsContainer.innerHTML = '<span></span><span></span><span></span>';
        const spans = dotsContainer.querySelectorAll('span');
        if(spans.length > 0) spans[0].style.background = '#004887';
    }
}, 100);

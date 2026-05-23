/**
 * PRIM & Associates - Professional Design System
 * GSAP & ScrollTrigger Animations
 */

// Register GSAP plugins
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initMobileNavRedirect();
});

function initPreloader() {
    const preloader = document.getElementById('prim-preloader');
    const logo = document.querySelector('.preloader-logo');
    const bar = document.querySelector('.preloader-bar');

    if (!preloader || !logo || !bar) return;

    // Safety fallback: ensure preloader is removed AFTER 5 seconds no matter what
    const safetyTimeout = setTimeout(() => {
        dismissPreloader();
    }, 5000);

    function dismissPreloader() {
        clearTimeout(safetyTimeout);
        if (window.gsap) {
            const outroTl = gsap.timeline();
            outroTl.to(logo, { scale: 1.1, opacity: 0, duration: 0.6 })
                .to(preloader, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.2")
                .set(preloader, { display: 'none' })
                .call(initScrollAnimations);
        } else {
            preloader.style.transition = "opacity 0.8s ease, transform 0.8s ease";
            preloader.style.opacity = "0";
            preloader.style.transform = "translateY(-100%)";
            setTimeout(() => {
                preloader.style.display = 'none';
                initScrollAnimations();
            }, 800);
        }
    }

    // Intro Animation
    if (window.gsap) {
        const tl = gsap.timeline();
        tl.to(logo, { opacity: 1, scale: 1, duration: 1, ease: "power2.out" })
            .to(bar, { width: "70%", duration: 2, ease: "power1.inOut" });
    } else {
        logo.style.opacity = "1";
        bar.style.width = "70%";
    }

    // Handle Finish Loading
    window.addEventListener('load', () => {
        if (window.gsap) {
            gsap.to(bar, {
                width: "100%",
                duration: 0.5,
                ease: "power1.out",
                onComplete: dismissPreloader
            });
        } else {
            bar.style.width = "100%";
            setTimeout(dismissPreloader, 500);
        }
    });
}

function initScrollAnimations() {
    // 1. Custom Number Counter (Using ScrollTrigger)
    const counters = document.querySelectorAll('.number[data-number]');
    counters.forEach(counter => {
        const targetAttr = counter.getAttribute('data-number');
        const target = parseFloat(targetAttr.replace(',', '.'));
        if (isNaN(target)) return;

        counter.innerText = "0";

        const startValue = { val: 0 };
        if (window.gsap) {
            gsap.to(startValue, {
                val: target,
                duration: 2.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: counter,
                    start: "top 95%",
                    once: true
                },
                onUpdate: function () {
                    if (target % 1 !== 0) {
                        counter.innerText = startValue.val.toFixed(1);
                    } else {
                        counter.innerText = Math.floor(startValue.val);
                    }
                }
            });
        } else {
            counter.innerText = target;
        }
    });

    // Ensure ScrollTrigger accurately maps the layout
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
}

/**
 * Mobile navigation redirection fix for parent menu items containing dropdowns.
 * Direct click on the parent link text will trigger page redirection, while
 * click on the toggle icon (chevron) will expand/collapse the dropdown menu.
 */
function initMobileNavRedirect() {
    document.addEventListener('click', function (e) {
        const parentLink = e.target.closest('li.menu-item-has-children > a');
        if (parentLink) {
            // Ignore click if it's explicitly on the toggle chevron icon
            if (e.target.tagName === 'I' || e.target.classList.contains('fa-chevron-down') || e.target.closest('i')) {
                return;
            }

            // On mobile/tablet, force navigation to the page
            if (window.innerWidth <= 1024) {
                const href = parentLink.getAttribute('href');
                if (href && href !== '#' && !href.startsWith('javascript:')) {
                    e.preventDefault();
                    window.location.href = href;
                }
            }
        }
    }, true);
}

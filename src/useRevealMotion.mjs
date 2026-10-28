import { useEffect } from 'react';

// Progressive enhancement: content stays visible without observer support or motion.
export function useRevealMotion(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.IntersectionObserver) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const selector = '.bridge-audiences h2, .bridge-audience-grid > a, .cashless-heading > div, .cashless-grid > article, .services .section-top, .service-list > article, .bridge-request-intro, .bridge-request-wrap > form, .business-deal-heading > div, .business-deal-steps > article, .company > div, .capital-register > div, .legal-documents-toggle, .legal-document-list > a, .faq > div, .faq-tabs, .office > div, .document-flow > div, .document-pack > div, .trust-intro, .trust-grid > article, .useful-for-heading, .office-contacts > *';
    let observer;
    let mutations;
    const clear = () => {
      observer?.disconnect();
      mutations?.disconnect();
      root.querySelectorAll('[data-reveal]').forEach(el => {
        el.removeAttribute('data-reveal');
        el.style.removeProperty('--reveal-delay');
      });
    };
    const start = () => {
      clear();
      if (preference.matches) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          target.dataset.reveal = 'visible';
          observer.unobserve(target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
      const register = () => {
        root.querySelectorAll(selector).forEach((el, index) => {
          if (el.hasAttribute('data-reveal')) return;
          const rect = el.getBoundingClientRect();
          // Already visible or navigated-to content never flashes out of view.
          if (rect.top < window.innerHeight - 24) {
            el.dataset.reveal = 'visible';
            return;
          }
          el.style.setProperty('--reveal-delay', `${(index % 3) * 65}ms`);
          el.dataset.reveal = 'pending';
          observer.observe(el);
        });
      };
      register();
      mutations = new MutationObserver(register);
      mutations.observe(root, { childList: true, subtree: true });
    };
    start();
    preference.addEventListener('change', start);
    return () => { clear(); preference.removeEventListener('change', start); };
  }, [rootRef]);
}

import { useEffect, useRef } from 'react';

// A restrained trail of dust released from the hero image by page movement.
export function GoldDust() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let particles = [];
    let frame = 0;
    let previousTime = 0;
    let activityTime = 0;
    let lastScroll = window.scrollY;
    let strength = 0;
    let seed = 8721;

    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const sourcePosition = particle => {
      const mobile = width < 700;
      particle.x = width * ((mobile ? .28 : .48) + random() * (mobile ? .72 : .52));
      particle.y = height * (.05 + random() * (mobile ? .5 : .58));
    };

    const paintParticle = (particle, opacity, moving = false) => {
      const twinkle = .88 + Math.sin(particle.phase + particle.y * .014) * .12;
      ctx.fillStyle = '#e3b95f';
      ctx.globalAlpha = opacity * particle.brightness * twinkle;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();

      if (particle.radius > 1.2) {
        ctx.globalAlpha *= .2;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (moving && particle.radius > 1.45) {
        ctx.globalAlpha = opacity * .16;
        ctx.strokeStyle = '#efca7e';
        ctx.lineWidth = .55;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y - particle.radius * 4.5);
        ctx.lineTo(particle.x, particle.y - particle.radius * 1.8);
        ctx.stroke();
      }
    };

    const paintHeroDust = () => {
      ctx.clearRect(0, 0, width, height);
      if (reduced.matches || window.scrollY > 80) {
        canvas.dataset.active = 'false';
        return;
      }
      particles.forEach((particle, index) => {
        if (index % 2 === 0) paintParticle(particle, .28);
      });
      ctx.globalAlpha = 1;
      canvas.dataset.active = 'hero';
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      strength = 0;
      paintHeroDust();
    };

    const resize = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = width < 700 ? 42 : 76;
      particles = Array.from({ length: count }, () => {
        const particle = {
          x: 0,
          y: 0,
          radius: .7 + random() * 1.25,
          speed: .65 + random() * 1.15,
          phase: random() * Math.PI * 2,
          drift: .25 + random() * .7,
          brightness: .68 + random() * .32,
        };
        sourcePosition(particle);
        return particle;
      });
      paintHeroDust();
    };

    const draw = time => {
      frame = 0;
      if (reduced.matches || document.hidden) {
        stop();
        return;
      }

      const elapsed = time - activityTime;
      const delta = previousTime ? Math.min(time - previousTime, 34) : 16;
      previousTime = time;
      const fade = Math.max(0, 1 - elapsed / 2200);
      if (!fade || strength < .02) {
        stop();
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const opacity = (.34 + strength * .36) * fade;
      particles.forEach(particle => {
        particle.y += particle.speed * delta * (.035 + strength * .035);
        particle.x += Math.sin(time * .00075 + particle.phase) * particle.drift * delta * .018;
        if (particle.y > height + 12) {
          sourcePosition(particle);
          particle.y = -10 - random() * height * .14;
        }
        paintParticle(particle, opacity, true);
      });
      ctx.globalAlpha = 1;
      strength *= Math.pow(.997, delta / 16);
      frame = requestAnimationFrame(draw);
    };

    const scroll = () => {
      const change = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      if (Math.abs(change) < .5 || reduced.matches || document.hidden) return;

      strength = Math.min(1, Math.max(strength, .52) + Math.min(Math.abs(change), 110) * .004);
      activityTime = performance.now();
      canvas.dataset.active = 'true';
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const preferenceChanged = () => {
      lastScroll = window.scrollY;
      if (reduced.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        ctx.clearRect(0, 0, width, height);
        canvas.dataset.active = 'false';
      } else {
        paintHeroDust();
      }
    };
    const visibilityChanged = () => {
      if (document.hidden) stop();
      lastScroll = window.scrollY;
    };

    resize();
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', visibilityChanged);
    reduced.addEventListener('change', preferenceChanged);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibilityChanged);
      reduced.removeEventListener('change', preferenceChanged);
    };
  }, []);

  return <canvas ref={canvasRef} className="gold-dust" aria-hidden="true" />;
}

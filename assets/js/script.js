// =============================================
//  ONG Arcada Aliança — JavaScript
// =============================================

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Animated counters
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('pt-BR');
  };
  requestAnimationFrame(step);
}

// Intersection Observer for counters and reveal animations
const observerOptions = { threshold: 0.2 };

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    animateCounter(el, target);
    counterObserver.unobserve(el);
  });
}, observerOptions);

document.querySelectorAll('.impact-number').forEach(el => {
  counterObserver.observe(el);
});

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Add reveal class dynamically to key elements
const revealSelectors = [
  '.sobre-card',
  '.project-card',
  '.help-card',
  '.testimonial-card',
  '.contact-item',
  '.impact-item',
  '.valor-item',
];

revealSelectors.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
    revealObserver.observe(el);
  });
});

// Testimonials slider (mobile)
const track = document.getElementById('testimonialsTrack');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
const cards = document.querySelectorAll('.testimonial-card');

function goToSlide(index) {
  currentSlide = index;
  dots.forEach((d, i) => d.classList.toggle('active', i === index));

  if (window.innerWidth <= 900) {
    cards.forEach((c, i) => {
      c.style.display = i === index ? 'block' : 'none';
    });
  } else {
    cards.forEach(c => (c.style.display = ''));
  }
}

dots.forEach(dot => {
  dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index, 10)));
});

// Auto-advance testimonials
let testimonialInterval = setInterval(() => {
  goToSlide((currentSlide + 1) % cards.length);
}, 5000);

track.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
track.addEventListener('mouseleave', () => {
  testimonialInterval = setInterval(() => {
    goToSlide((currentSlide + 1) % cards.length);
  }, 5000);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    cards.forEach(c => (c.style.display = ''));
  } else {
    goToSlide(currentSlide);
  }
});

// Copy PIX key
function copyPix() {
  const key = 'ong.arcadaalianca@gmail.com';
  navigator.clipboard.writeText(key).then(() => {
    const note = document.getElementById('pixNote');
    const btn = document.querySelector('.copy-btn');
    btn.textContent = 'Copiado!';
    note.textContent = '✅ Chave copiada! Cole no seu banco para fazer a doação.';
    note.style.color = '#6EE7B7';
    setTimeout(() => {
      btn.textContent = 'Copiar';
      note.textContent = 'Clique em copiar para usar no seu banco';
      note.style.color = '';
    }, 3000);
  });
}

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  // Simulate form submission
  setTimeout(() => {
    btn.textContent = 'Enviar Mensagem';
    btn.disabled = false;
    this.reset();
    const success = document.getElementById('formSuccess');
    success.style.display = 'block';
    setTimeout(() => (success.style.display = 'none'), 5000);
  }, 1500);
});

// Smooth active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${id}`) {
          a.style.color = 'var(--primary)';
        }
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => sectionObserver.observe(s));

// Expose copyPix globally (called from HTML onclick)
window.copyPix = copyPix;

// Gallery lightbox
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    lightboxImg.src       = item.dataset.src;
    lightboxImg.alt       = item.querySelector('img').alt;
    lightboxCaption.textContent = item.dataset.caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ===== PARTICLES =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
const particles = Array.from({ length: 60 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.5 + 0.5,
  dx: (Math.random() - 0.5) * 0.3,
  dy: (Math.random() - 0.5) * 0.3,
  alpha: Math.random() * 0.5 + 0.1,
}));
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,245,255,${p.alpha})`;
    ctx.fill();
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ===== COUNTDOWN =====
const eventDate = new Date('2026-04-06T09:00:00');
function updateCountdown() {
  const now = new Date();
  const diff = eventDate - now;
  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent = '00';
    document.getElementById('cd-secs').textContent = '00';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-days').textContent = String(d).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
  document.getElementById('cd-mins').textContent = String(m).padStart(2,'0');
  document.getElementById('cd-secs').textContent = String(s).padStart(2,'0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// ===== MOBILE MENU =====
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.about-card, .prize-card, .t-event, .guest-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ===== FORM SUBMISSION =====
document.getElementById('regForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const loader = document.getElementById('btnLoader');
  const err = document.getElementById('formError');

  btn.disabled = true;
  btn.querySelector('span').textContent = 'Registering...';
  err.classList.add('hidden');

  const data = {
    name: this.name.value,
    email: this.email.value,
    phone: this.phone.value,
    college: this.college.value,
    year: this.year.value,
    type: this.type.value,
    teamName: this.teamName.value,
    source: this.source.value,
  };

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.ok) {
      document.getElementById('regForm').classList.add('hidden');
      document.getElementById('form-success').classList.remove('hidden');
    } else {
      err.textContent = result.message || 'Registration failed. Please try again.';
      err.classList.remove('hidden');
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Register Now';
    }
  } catch (error) {
    err.textContent = 'Network error. Please try again.';
    err.classList.remove('hidden');
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Register Now';
  }
});

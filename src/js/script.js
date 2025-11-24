const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const particleCount = 100;
const maxDistance = 100;
const loginForm = document.getElementById('login-form-id');
const registerForm = document.getElementById('register-form-id');
const notification = document.getElementById('success-notification');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary').trim();
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary').trim();
    const colorMatch = primaryColor.match(/#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i);
    const colorRgb = colorMatch ? colorMatch.slice(1).map(hex => parseInt(hex, 16)) : [0, 234, 255]; 
    
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                const opacityValue = 1 - (distance / maxDistance);
                ctx.strokeStyle = `rgba(${colorRgb[0]}, ${colorRgb[1]}, ${colorRgb[2]}, ${opacityValue})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    connectParticles();
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
}

function showLogin() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
    document.querySelector('#form-switch-area .switch-btn.active').classList.remove('active');
    document.querySelector('#form-switch-area button:nth-child(1)').classList.add('active');
}

function showRegister() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
    document.querySelector('#form-switch-area .switch-btn.active').classList.remove('active');
    document.querySelector('#form-switch-area button:nth-child(2)').classList.add('active');
}

function showNotification(message, isError = false) {
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary').trim();
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary').trim();
    
    notification.textContent = message;
    notification.classList.remove('error');

    if (isError) {
        notification.classList.add('error');
        notification.style.background = '#ff0000';
        notification.style.boxShadow = '0 0 20px #ff0000';
        notification.style.borderColor = '#ff8888';
    } else {
        notification.style.background = secondaryColor;
        notification.style.boxShadow = `0 0 20px ${secondaryColor}`;
        notification.style.borderColor = primaryColor;
    }

    notification.classList.add('show-notification');

    setTimeout(() => {
        notification.classList.remove('show-notification');
    }, 3000);
}

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (email && password) {
        showNotification("Você fez login. Acesso concedido!");
    } else {
        showNotification("Preencha todos os campos de login.", true);
    }
});

registerForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    if (password !== confirmPassword) {
        showNotification("Erro: As chaves criptográficas não coincidem.", true);
    } else if (password.length < 6) {
        showNotification("Erro: Chave fraca. Mínimo 6 caracteres.", true);
    } else {
        showNotification("Você criou uma chave de acesso com sucesso!");
        setTimeout(showLogin, 1500);
    }
});

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('chrono-theme', isDark ? 'dark' : 'light');
});

window.onload = () => {
    const savedTheme = localStorage.getItem('chrono-theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    }
    initParticles();
    animateParticles();
};
// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
	// Inicializar AOS (Animate On Scroll)
	if (typeof AOS !== 'undefined') {
		AOS.init({
			duration: 800,
			easing: 'ease-in-out',
			once: true,
			offset: 100
		});
	}

	// Ano corrente no footer
	const yearEl = document.getElementById('year');
	if (yearEl) {
		yearEl.textContent = new Date().getFullYear();
	}

	// Header scroll effect removido - mantém cor fixa
	const header = document.querySelector('.site-header');
	const navigation = document.querySelector('.main-navigation');
	if (header && navigation) {
		// Mantém sempre o mesmo estilo
		header.style.background = 'rgba(255, 255, 255, 0.95)';
		header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
		navigation.style.background = 'rgba(255, 255, 255, 0.95)';
		navigation.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
	}

	// Toggle menu mobile com animação
	const toggle = document.querySelector('.menu-toggle');
	const nav = document.querySelector('.site-nav');
	
	if (toggle && nav) {
		toggle.addEventListener('click', function() {
			const expanded = toggle.getAttribute('aria-expanded') === 'true';
			toggle.setAttribute('aria-expanded', String(!expanded));
			nav.classList.toggle('open');
			
			// Animar ícone do hamburger
			const spans = toggle.querySelectorAll('span');
			spans.forEach((span, index) => {
				if (!expanded) {
					if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
					if (index === 1) span.style.opacity = '0';
					if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
				} else {
					span.style.transform = 'none';
					span.style.opacity = '1';
				}
			});
		});
	}

	// Scroll suave para links internos
	const internalLinks = document.querySelectorAll('a[href^="#"]');
	internalLinks.forEach(link => {
		link.addEventListener('click', function(e) {
			e.preventDefault();
			const targetId = this.getAttribute('href');
			const targetElement = document.querySelector(targetId);
			
			if (targetElement) {
				const headerHeight = document.querySelector('.site-header').offsetHeight;
				const targetPosition = targetElement.offsetTop - headerHeight - 20;
				
				window.scrollTo({
					top: targetPosition,
					behavior: 'smooth'
				});
				
				// Fechar menu mobile se estiver aberto
				if (nav && nav.classList.contains('open')) {
					nav.classList.remove('open');
					toggle.setAttribute('aria-expanded', 'false');
					// Resetar ícone hamburger
					const spans = toggle.querySelectorAll('span');
					spans.forEach(span => {
						span.style.transform = 'none';
						span.style.opacity = '1';
					});
				}
			}
		});
	});

	// Envio por WhatsApp melhorado
	const form = document.getElementById('contato-form');
	if (form) {
		form.addEventListener('submit', function(e) {
			e.preventDefault();
			
			const nome = document.getElementById('nome').value.trim();
			const tel = document.getElementById('telefone').value.trim();
			const msg = document.getElementById('mensagem').value.trim();

			// Validação básica
			if (!nome) {
				alert('Por favor, informe seu nome.');
				document.getElementById('nome').focus();
				return;
			}

			// Construir mensagem
			const linhas = [
				'🔧 *Solicitação de Orçamento - CSE*',
				'',
				`👤 *Nome:* ${nome}`,
				tel ? `📱 *Telefone:* ${tel}` : null,
				msg ? `📝 *Mensagem:* ${msg}` : null,
				'',
				'Aguardo retorno! 😊'
			].filter(Boolean);

			// Substitua pelo número oficial (com DDI e DDD)
			const numeroWhatsApp = '5599999999999';
			const texto = encodeURIComponent(linhas.join('\n'));
			const url = `https://wa.me/${numeroWhatsApp}?text=${texto}`;
			
			// Feedback visual
			const button = form.querySelector('button[type="submit"]');
			const originalText = button.innerHTML;
			button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
			button.disabled = true;
			
			setTimeout(() => {
				window.open(url, '_blank', 'noopener,noreferrer');
				button.innerHTML = originalText;
				button.disabled = false;
				
				// Limpar formulário
				form.reset();
				
				// Mostrar mensagem de sucesso
				showNotification('Redirecionando para o WhatsApp...', 'success');
			}, 500);
		});
	}

	// Adicionar efeito parallax sutil ao hero
	const heroBg = document.querySelector('.hero-bg');
	if (heroBg) {
		window.addEventListener('scroll', function() {
			const scrolled = window.pageYOffset;
			const speed = scrolled * 0.5;
			heroBg.style.transform = `translateY(${speed}px)`;
		});
	}

	// Contador animado para estatísticas melhorado
	const stats = document.querySelectorAll('.stat-number');
	const statsObserver = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const target = entry.target;
				const text = target.textContent.trim();
				
				// Detectar diferentes tipos de números
				if (text.includes('+')) {
					const num = parseInt(text.replace(/\D/g, ''));
					animateCounter(target, 0, num, '+', 2500);
				} else if (text.includes('%')) {
					const num = parseInt(text.replace(/\D/g, ''));
					animateCounter(target, 0, num, '%', 2000);
				} else if (text.includes('h')) {
					const num = parseInt(text.replace(/\D/g, ''));
					animateCounter(target, 0, num, 'h', 1500);
				} else {
					const num = parseInt(text.replace(/\D/g, ''));
					if (num) {
						animateCounter(target, 0, num, '', 2000);
					}
				}
				
				statsObserver.unobserve(target);
			}
		});
	}, { threshold: 0.3 });

	stats.forEach(stat => {
		statsObserver.observe(stat);
	});

	// Efeito parallax para portfolio items
	const portfolioItems = document.querySelectorAll('.portfolio-item');
	if (portfolioItems.length > 0 && window.innerWidth > 768) {
		window.addEventListener('scroll', () => {
			const scrolled = window.pageYOffset;
			portfolioItems.forEach((item, index) => {
				const speed = 0.5 + (index * 0.1);
				const yPos = -(scrolled * speed);
				item.style.transform = `translateY(${yPos}px)`;
			});
		});
	}

	// Efeito de hover nos testimonials
	const testimonialCards = document.querySelectorAll('.testimonial-card');
	testimonialCards.forEach(card => {
		card.addEventListener('mouseenter', function() {
			this.style.transform = 'translateY(-8px) scale(1.02)';
		});
		
		card.addEventListener('mouseleave', function() {
			this.style.transform = 'translateY(0) scale(1)';
		});
	});

	// Animação das credenciais badges
	const credentialBadges = document.querySelectorAll('.credential-badge');
	const credentialsObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry, index) => {
			if (entry.isIntersecting) {
				setTimeout(() => {
					entry.target.style.transform = 'translateY(0)';
					entry.target.style.opacity = '1';
				}, index * 200);
			}
		});
	}, { threshold: 0.2 });

	credentialBadges.forEach(badge => {
		badge.style.transform = 'translateY(30px)';
		badge.style.opacity = '0';
		badge.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
		credentialsObserver.observe(badge);
	});

	// Efeito de typing no hero title (opcional)
	const heroTitle = document.querySelector('.hero h1');
	if (heroTitle) {
		const text = heroTitle.innerHTML;
		heroTitle.innerHTML = '';
		heroTitle.style.opacity = '1';
		
		setTimeout(() => {
			typeWriter(heroTitle, text, 50);
		}, 500);
	}
});

// Função para animação de contador melhorada
function animateCounter(element, start, end, suffix, duration) {
	const startTime = performance.now();
	
	function update(currentTime) {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);
		
		const current = Math.floor(start + (end - start) * easeOutCubic(progress));
		
		// Formatação especial para números grandes
		let displayValue = current;
		if (end >= 1000) {
			displayValue = current.toLocaleString('pt-BR');
		}
		
		element.textContent = displayValue + suffix;
		
		if (progress < 1) {
			requestAnimationFrame(update);
		} else {
			// Efeito final de "pulse"
			element.style.transform = 'scale(1.1)';
			setTimeout(() => {
				element.style.transform = 'scale(1)';
			}, 200);
		}
	}
	
	requestAnimationFrame(update);
}

// Função de easing
function easeOutCubic(t) {
	return 1 - Math.pow(1 - t, 3);
}

// Função de typing effect (opcional)
function typeWriter(element, text, speed) {
	let i = 0;
	element.innerHTML = '';
	
	function type() {
		if (i < text.length) {
			element.innerHTML += text.charAt(i);
			i++;
			setTimeout(type, speed);
		}
	}
	
	type();
}

// Sistema de notificações
function showNotification(message, type = 'info') {
	const notification = document.createElement('div');
	notification.className = `notification notification-${type}`;
	notification.innerHTML = `
		<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
		<span>${message}</span>
	`;
	
	// Estilos da notificação
	notification.style.cssText = `
		position: fixed;
		top: 90px;
		right: 20px;
		background: ${type === 'success' ? '#10b981' : '#0ea5e9'};
		color: white;
		padding: 16px 20px;
		border-radius: 12px;
		box-shadow: 0 8px 25px rgba(0,0,0,0.2);
		z-index: 10000;
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: 500;
		transform: translateX(100%);
		transition: transform 0.3s ease;
	`;
	
	document.body.appendChild(notification);
	
	// Animar entrada
	setTimeout(() => {
		notification.style.transform = 'translateX(0)';
	}, 100);
	
	// Remover após 3 segundos
	setTimeout(() => {
		notification.style.transform = 'translateX(100%)';
		setTimeout(() => {
			document.body.removeChild(notification);
		}, 300);
	}, 3000);
}

// Adicionar partículas flutuantes (opcional - para performance)
function createFloatingParticles() {
	const hero = document.querySelector('.hero');
	if (!hero || window.innerWidth < 768) return; // Só em desktop
	
	for (let i = 0; i < 5; i++) {
		const particle = document.createElement('div');
		particle.className = 'floating-particle';
		particle.style.cssText = `
			position: absolute;
			width: 4px;
			height: 4px;
			background: rgba(14, 165, 233, 0.6);
			border-radius: 50%;
			pointer-events: none;
			animation: floatParticle ${5 + Math.random() * 5}s infinite ease-in-out;
			left: ${Math.random() * 100}%;
			top: ${Math.random() * 100}%;
			animation-delay: ${Math.random() * 5}s;
		`;
		
		hero.appendChild(particle);
	}
}

// CSS para partículas (adicionado dinamicamente)
const particleStyles = document.createElement('style');
particleStyles.textContent = `
	@keyframes floatParticle {
		0%, 100% {
			transform: translateY(0px) rotate(0deg);
			opacity: 0;
		}
		10%, 90% {
			opacity: 1;
		}
		50% {
			transform: translateY(-50px) rotate(180deg);
			opacity: 0.8;
		}
	}
`;
document.head.appendChild(particleStyles);

// Criar sistema de partículas avançado
function createAdvancedParticleSystem() {
	if (window.innerWidth < 768) return; // Só em desktop
	
	const particleContainer = document.createElement('div');
	particleContainer.id = 'particle-system';
	particleContainer.style.cssText = `
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: -1;
		overflow: hidden;
	`;
	document.body.appendChild(particleContainer);
	
	// Criar partículas interativas
	for (let i = 0; i < 15; i++) {
		createInteractiveParticle(particleContainer, i);
	}
	
	// Partículas que seguem o cursor
	let mouseX = 0, mouseY = 0;
	document.addEventListener('mousemove', (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
		createCursorTrail(mouseX, mouseY);
	});
}

function createInteractiveParticle(container, index) {
	const particle = document.createElement('div');
	const size = Math.random() * 6 + 2;
	const colors = ['#FF6B35', '#2E5984', '#FF8A5C', '#4A7BA7'];
	const color = colors[Math.floor(Math.random() * colors.length)];
	
	particle.style.cssText = `
		position: absolute;
		width: ${size}px;
		height: ${size}px;
		background: ${color};
		border-radius: 50%;
		opacity: 0.6;
		box-shadow: 0 0 ${size * 2}px ${color}50;
		animation: floatAdvanced ${5 + Math.random() * 10}s ease-in-out infinite;
		animation-delay: ${index * 0.2}s;
		left: ${Math.random() * 100}%;
		top: ${Math.random() * 100}%;
	`;
	
	container.appendChild(particle);
}

function createCursorTrail(x, y) {
	const trail = document.createElement('div');
	trail.style.cssText = `
		position: fixed;
		left: ${x}px;
		top: ${y}px;
		width: 4px;
		height: 4px;
		background: radial-gradient(circle, #FF6B35, transparent);
		border-radius: 50%;
		pointer-events: none;
		z-index: 9999;
		animation: cursorTrailFade 0.8s ease-out forwards;
	`;
	document.body.appendChild(trail);
	
	setTimeout(() => {
		if (trail.parentNode) {
			trail.parentNode.removeChild(trail);
		}
	}, 800);
}

// Efeito de ondas no background
function createWaveEffect() {
	const waveContainer = document.createElement('div');
	waveContainer.id = 'wave-effect';
	waveContainer.style.cssText = `
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: -2;
		background: 
			radial-gradient(circle at 20% 80%, rgba(255, 107, 53, 0.05) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(46, 89, 132, 0.05) 0%, transparent 50%);
		animation: waveMotion 20s ease-in-out infinite;
	`;
	document.body.appendChild(waveContainer);
}

// Adicionar aos estilos das animações
const advancedStyles = document.createElement('style');
advancedStyles.textContent = `
	@keyframes floatAdvanced {
		0%, 100% {
			transform: translateY(0px) translateX(0px) rotate(0deg);
			opacity: 0.6;
		}
		25% {
			transform: translateY(-20px) translateX(10px) rotate(90deg);
			opacity: 0.8;
		}
		50% {
			transform: translateY(-40px) translateX(-10px) rotate(180deg);
			opacity: 1;
		}
		75% {
			transform: translateY(-20px) translateX(10px) rotate(270deg);
			opacity: 0.8;
		}
	}
	
	@keyframes cursorTrailFade {
		0% {
			opacity: 1;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(0.2);
		}
	}
	
	@keyframes waveMotion {
		0%, 100% {
			background-position: 0% 0%, 100% 100%;
		}
		50% {
			background-position: 100% 100%, 0% 0%;
		}
	}
	

	
	/* Efeito de entrada dramático */
	.dramatic-entrance {
		animation: dramaticEntry 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
	}
	
	@keyframes dramaticEntry {
		0% {
			opacity: 0;
			transform: translateY(100px) scale(0.8) rotateX(45deg);
			filter: blur(10px);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1) rotateX(0deg);
			filter: blur(0px);
		}
	}
`;
document.head.appendChild(advancedStyles);



// Entrada dramática para elementos
function addDramaticEntrance() {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('dramatic-entrance');
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.1 });
	
	document.querySelectorAll('.card, .stat-card, .credential-badge, .testimonial-card').forEach(el => {
		observer.observe(el);
	});
}

// Inicializar todos os efeitos avançados
window.addEventListener('load', () => {
	createAdvancedParticleSystem();
	createWaveEffect();
	addDramaticEntrance();
	createFloatingParticles();
});
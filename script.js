// Version simplifiée et robuste du menu burger
(function() {
    'use strict';
    
    // Attendre que le DOM soit complètement chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMenu);
    } else {
        initMenu();
    }
    
    function initMenu() {
        console.log('🚀 Initialisation du menu mobile...');
        
        // Sélection des éléments avec plusieurs méthodes de fallback
        const mobileMenu = document.getElementById('mobileMenu') || document.querySelector('.mobile-menu');
        const navMenu = document.getElementById('navMenu') || document.querySelector('.nav-menu');
        
        console.log('📱 Mobile menu button:', mobileMenu);
        console.log('📋 Nav menu:', navMenu);
        
        if (!mobileMenu) {
            console.error('❌ Bouton menu mobile non trouvé');
            return;
        }
        
        if (!navMenu) {
            console.error('❌ Menu de navigation non trouvé');
            return;
        }
        
        // Fonction de toggle du menu
        function toggleMenu(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            console.log('🔄 Toggle menu appelé');
            
            const isActive = navMenu.classList.contains('active');
            console.log('📊 État actuel du menu:', isActive ? 'ouvert' : 'fermé');
            
            if (isActive) {
                // Fermer le menu
                navMenu.classList.remove('active');
                mobileMenu.innerHTML = '☰';
                mobileMenu.setAttribute('aria-expanded', 'false');
                console.log('❌ Menu fermé');
            } else {
                // Ouvrir le menu
                navMenu.classList.add('active');
                mobileMenu.innerHTML = '✕';
                mobileMenu.setAttribute('aria-expanded', 'true');
                console.log('✅ Menu ouvert');
            }
        }
        
        // Attacher l'événement click avec plusieurs méthodes
        mobileMenu.addEventListener('click', toggleMenu);
        mobileMenu.addEventListener('touchstart', function(e) {
            e.preventDefault();
            toggleMenu(e);
        });
        
        // Test de clic au chargement
        console.log('🎯 Event listeners attachés au bouton burger');
        
        // Fermer le menu en cliquant sur les liens
        const navLinks = document.querySelectorAll('.nav-link');
        console.log('🔗 Liens de navigation trouvés:', navLinks.length);
        
        navLinks.forEach(function(link, index) {
            link.addEventListener('click', function() {
                console.log('🔗 Lien cliqué:', index);
                navMenu.classList.remove('active');
                mobileMenu.innerHTML = '☰';
                mobileMenu.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Fermer le menu en cliquant en dehors
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && 
                !navMenu.contains(e.target) && 
                navMenu.classList.contains('active')) {
                console.log('🌐 Clic en dehors - fermeture du menu');
                navMenu.classList.remove('active');
                mobileMenu.innerHTML = '☰';
                mobileMenu.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Test initial
        setTimeout(function() {
            console.log('🔍 Test du bouton burger...');
            if (mobileMenu.click) {
                console.log('✅ Méthode click disponible');
            }
            if (mobileMenu.style) {
                console.log('✅ Styles accessibles');
            }
        }, 1000);
        
        // Initialiser les autres fonctionnalités après le menu
        setTimeout(initOtherFeatures, 500);
    }
    
    function initOtherFeatures() {
        console.log('🔧 Initialisation des autres fonctionnalités...');
        
        const header = document.querySelector('.header');
        const contactForm = document.getElementById('contactForm');

        // ============ SCROLL FLUIDE ============
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                
                // Fermer le menu mobile si ouvert
                const navMenu = document.getElementById('navMenu');
                const mobileMenu = document.getElementById('mobileMenu');
                if (navMenu && mobileMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenu.innerHTML = '☰';
                    mobileMenu.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // ============ EFFETS DE SCROLL ============
        function throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(function() { 
                        inThrottle = false; 
                    }, limit);
                }
            };
        }

        const throttledScrollHandler = throttle(function() {
            const scrollY = window.scrollY;
            
            if (header) {
                if (scrollY > 100) {
                    header.style.background = 'rgba(26, 54, 93, 0.95)';
                    header.style.backdropFilter = 'blur(10px)';
                    header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
                } else {
                    header.style.background = 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)';
                    header.style.backdropFilter = 'none';
                    header.style.boxShadow = 'none';
                }
            }
            
            // Parallax pour le hero
            const hero = document.querySelector('.hero');
            if (hero && scrollY < hero.offsetHeight) {
                hero.style.transform = 'translateY(' + (scrollY * 0.5) + 'px)';
            }
        }, 16);

        window.addEventListener('scroll', throttledScrollHandler);

        // ============ ANIMATIONS AU SCROLL ============
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    entry.target.classList.add('fade-in');
                    
                    if (entry.target.classList.contains('service-card')) {
                        const cards = entry.target.parentElement.children;
                        Array.from(cards).forEach(function(card, index) {
                            setTimeout(function() {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, index * 200);
                        });
                    }
                    
                    if (entry.target.classList.contains('stat-item')) {
                        animateNumber(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observer toutes les sections
        document.querySelectorAll('.section').forEach(function(section) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });

        // Observer les cartes individuellement - ne pas les masquer initialement
        document.querySelectorAll('.service-card, .stat-item, .equipment-item, .equipment-detail-card, .partner-item').forEach(function(item) {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });

        // Portfolio items - les laisser visibles par défaut
        document.querySelectorAll('.portfolio-item').forEach(function(item) {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            // Pas d'observer pour les éléments portfolio pour éviter les conflits
        });

        // ============ FONCTIONNALITÉS PORTFOLIO ============
        const filterButtons = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        // Initialiser l'affichage - tous les éléments visibles par défaut
        portfolioItems.forEach(function(item) {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
            item.classList.remove('hidden');
        });

        filterButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Mise à jour des boutons actifs
                filterButtons.forEach(function(btn) {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                // Filtrage des éléments
                portfolioItems.forEach(function(item) {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        item.classList.remove('hidden');
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(function() {
                            item.classList.add('hidden');
                        }, 300);
                    }
                });
            });
        });

        // Gestion des erreurs d'images dans le portfolio
        document.querySelectorAll('.portfolio-image img').forEach(function(img) {
            img.addEventListener('error', function() {
                // Créer une image placeholder
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.style.cssText = 'width: 100%; height: 100%; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem; position: absolute; top: 0; left: 0;';
                placeholder.innerHTML = '🏗️';
                this.parentElement.insertBefore(placeholder, this);
            });
            
            // Lazy loading amélioré
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        });

        // Animation séquentielle des éléments du portfolio - simplifiée
        const observePortfolio = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const portfolioItems = entry.target.querySelectorAll('.portfolio-item');
                    portfolioItems.forEach(function(item, index) {
                        // Seulement animer si l'élément n'est pas déjà visible
                        if (item.style.opacity !== '1') {
                            setTimeout(function() {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, index * 150);
                        }
                    });
                }
            });
        }, { threshold: 0.2 });

        const portfolioSection = document.querySelector('.portfolio-grid');
        if (portfolioSection) {
            // Ne pas observer si les éléments sont déjà visibles
            const firstItem = portfolioSection.querySelector('.portfolio-item');
            if (firstItem && firstItem.style.opacity !== '1') {
                observePortfolio.observe(portfolioSection);
            }
        }

        // ============ ANIMATIONS SUPPLÉMENTAIRES ÉQUIPEMENTS ============
        const observeEquipment = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const categories = entry.target.querySelectorAll('.equipment-category');
                    categories.forEach(function(category, index) {
                        setTimeout(function() {
                            category.style.opacity = '1';
                            category.style.transform = 'translateY(0)';
                            
                            // Animer les cartes détaillées dans chaque catégorie
                            const detailCards = category.querySelectorAll('.equipment-detail-card');
                            detailCards.forEach(function(card, cardIndex) {
                                setTimeout(function() {
                                    card.style.opacity = '1';
                                    card.style.transform = 'translateY(0)';
                                }, cardIndex * 100);
                            });
                        }, index * 300);
                    });
                }
            });
        }, { threshold: 0.1 });

        const equipmentSection = document.querySelector('.equipment .container');
        if (equipmentSection) {
            // Préparer les catégories pour l'animation
            const categories = equipmentSection.querySelectorAll('.equipment-category');
            categories.forEach(function(category) {
                category.style.opacity = '0';
                category.style.transform = 'translateY(30px)';
                category.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });
            
            observeEquipment.observe(equipmentSection);
        }

        // Effet de typing pour les compétences de soudage
        function typeWriterEffect(element, text, speed) {
            speed = speed || 50;
            element.innerHTML = '';
            let i = 0;
            const timer = setInterval(function() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, speed);
        }

        // Appliquer l'effet typing aux éléments techniques quand ils sont visibles
        const observeTyping = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
                    entry.target.classList.add('typed');
                    const originalText = entry.target.textContent;
                    typeWriterEffect(entry.target, originalText, 30);
                }
            });
        }, { threshold: 0.8 });

        // Appliquer aux descriptions techniques
        document.querySelectorAll('.equipment-detail-card strong').forEach(function(element) {
            observeTyping.observe(element);
        });

        // Effet de hover sur les cartes partenaires
        document.querySelectorAll('.partner-item').forEach(function(partner) {
            partner.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                const logo = this.querySelector('.partner-logo');
                if (logo) {
                    logo.style.filter = 'grayscale(0%) opacity(1)';
                    logo.style.transform = 'scale(1.1)';
                }
            });
            
            partner.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                const logo = this.querySelector('.partner-logo');
                if (logo) {
                    logo.style.filter = 'grayscale(100%) opacity(0.7)';
                    logo.style.transform = 'scale(1)';
                }
            });
        });

        // Gestion des erreurs de chargement des logos
        document.querySelectorAll('.partner-logo').forEach(function(logo) {
            logo.addEventListener('error', function() {
                // Fallback vers un logo générique si l'image ne se charge pas
                this.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
                this.style.color = 'white';
                this.style.display = 'flex';
                this.style.alignItems = 'center';
                this.style.justifyContent = 'center';
                this.style.fontSize = '1.2rem';
                this.style.fontWeight = 'bold';
                this.alt = this.alt || 'Logo partenaire';
                const randomColor = Math.random().toString(16).substr(2,6);
                this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80"%3E%3Crect fill="%23' + randomColor + '" width="200" height="80"/%3E%3Ctext x="100" y="45" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold"%3E' + encodeURIComponent(this.alt) + '%3C/text%3E%3C/svg%3E';
            });
        });

        // ============ ANIMATION DES CHIFFRES ============
        function animateNumber(element) {
            const numberElement = element.querySelector('.stat-number');
            if (!numberElement) return;
            
            const finalNumber = numberElement.textContent;
            const isPercentage = finalNumber.includes('%');
            const hasPlus = finalNumber.includes('+');
            const numericValue = parseInt(finalNumber.replace(/[^\d]/g, ''));
            
            let currentNumber = 0;
            const increment = Math.ceil(numericValue / 50);
            const duration = 2000;
            const stepTime = duration / 50;
            
            const timer = setInterval(function() {
                currentNumber += increment;
                if (currentNumber >= numericValue) {
                    currentNumber = numericValue;
                    clearInterval(timer);
                }
                
                let displayValue = currentNumber.toString();
                if (hasPlus) displayValue += '+';
                if (isPercentage) displayValue += '%';
                if (finalNumber.includes('h')) displayValue += 'h';
                
                numberElement.textContent = displayValue;
            }, stepTime);
        }

        // ============ GESTION DU FORMULAIRE ============
        if (contactForm) {
            console.log('📧 Formulaire configuré avec Web3Forms');
            
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault(); // Empêcher l'envoi par défaut pour valider
                
                const formData = new FormData(contactForm);
                const nom = formData.get('name');
                const email = formData.get('email');
                const message = formData.get('message');
                
                console.log('📝 Données du formulaire:', {
                    nom: nom,
                    email: email,
                    message: message
                });
                
                // Validation côté client
                if (!nom || !email || !message) {
                    showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showNotification('Veuillez entrer une adresse email valide.', 'error');
                    return;
                }
                
                // Si validation OK, envoyer le formulaire
                showLoading(true);
                console.log('🚀 Envoi vers Web3Forms...');
                
                // Envoyer les données à Web3Forms
                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                })
                .then(function(response) {
                    console.log('📡 Réponse statut:', response.status);
                    return response.json();
                })
                .then(function(data) {
                    console.log('📨 Réponse Web3Forms:', data);
                    showLoading(false);
                    if (data.success) {
                        showNotification('✅ Email envoyé avec succès ! Vérifiez votre boîte email (et le dossier spam).', 'success');
                        contactForm.reset();
                    } else {
                        console.error('❌ Erreur Web3Forms:', data);
                        showNotification('❌ Erreur: ' + (data.message || 'Problème inconnu'), 'error');
                    }
                })
                .catch(function(error) {
                    showLoading(false);
                    console.error('💥 Erreur réseau:', error);
                    showNotification('❌ Erreur réseau. Vérifiez votre connexion internet.', 'error');
                });
            });
        }

        // Effet de focus amélioré sur les champs de formulaire
        document.querySelectorAll('input, textarea').forEach(function(field) {
            field.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateY(-2px)';
            });
            
            field.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateY(0)';
            });
        });

        // ============ FONCTIONS UTILITAIRES ============
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function showNotification(message, type) {
            type = type || 'info';
            const existingNotifications = document.querySelectorAll('.notification');
            existingNotifications.forEach(function(notif) {
                notif.remove();
            });
            
            const notification = document.createElement('div');
            notification.className = 'notification notification-' + type;
            notification.innerHTML = '<div class="notification-content"><span class="notification-icon">' + getNotificationIcon(type) + '</span><span class="notification-message">' + message + '</span><button class="notification-close" onclick="this.parentElement.parentElement.remove()">✕</button></div>';
            
            const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
            notification.style.cssText = 'position: fixed; top: 100px; right: 20px; z-index: 10000; background: ' + bgColor + '; color: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); transform: translateX(100%); transition: transform 0.3s ease; max-width: 400px; min-width: 300px;';
            
            document.body.appendChild(notification);
            
            setTimeout(function() {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            setTimeout(function() {
                if (notification.parentElement) {
                    notification.style.transform = 'translateX(100%)';
                    setTimeout(function() {
                        notification.remove();
                    }, 300);
                }
            }, 5000);
        }

        function getNotificationIcon(type) {
            const icons = {
                success: '✓',
                error: '✕',
                warning: '⚠',
                info: 'ℹ'
            };
            return icons[type] || icons.info;
        }

        function showLoading(show) {
            const submitBtn = document.querySelector('.submit-btn');
            if (!submitBtn) return;
            
            if (show) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span style="display: inline-flex; align-items: center; gap: 10px;"><div class="spinner"></div>Envoi en cours...</span>';
                
                if (!document.querySelector('#spinner-styles')) {
                    const spinnerStyles = document.createElement('style');
                    spinnerStyles.id = 'spinner-styles';
                    spinnerStyles.textContent = '.spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
                    document.head.appendChild(spinnerStyles);
                }
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Envoyer la demande';
            }
        }

        // ============ GESTION DES ERREURS ============
        window.addEventListener('error', function(e) {
            console.error('Erreur JavaScript:', e.error);
        });

        // ============ ACCESSIBILITÉ ============
        document.addEventListener('keydown', function(e) {
            const navMenu = document.getElementById('navMenu');
            const mobileMenu = document.getElementById('mobileMenu');
            
            // Échapper pour fermer le menu mobile
            if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (mobileMenu) {
                    mobileMenu.innerHTML = '☰';
                }
            }
            
            // Entrée pour activer les boutons
            if (e.key === 'Enter' && e.target.classList.contains('cta-button')) {
                e.target.click();
            }
        });

        console.log('✅ Toutes les fonctionnalités initialisées');
    }
})();

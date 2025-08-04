// Navigation mobile toggle
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 70; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(212, 71, 122, 0.15)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(212, 71, 122, 0.1)';
            }
        });
    }
}

// Gallery filter functionality
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Pricing categories functionality
function initPricingCategories() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const pricingSections = document.querySelectorAll('.pricing-section');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const categoryValue = button.getAttribute('data-category');

            // Hide all sections
            pricingSections.forEach(section => {
                section.classList.remove('active');
            });

            // Show selected section
            const targetSection = document.getElementById(categoryValue);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// Booking form functionality
let currentStep = 1;
const totalSteps = 4;
let selectedService = null;
let selectedDate = null;
let selectedTime = null;

function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    // Initialize date constraints
    initDateConstraints();
    
    // Initialize service selection
    initServiceSelection();
    
    // Initialize time slots
    initTimeSlots();

    // Form submission
    form.addEventListener('submit', handleFormSubmission);
}

function initDateConstraints() {
    const dateInput = document.getElementById('data');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const formattedDate = tomorrow.toISOString().split('T')[0];
        dateInput.min = formattedDate;

        dateInput.addEventListener('change', generateTimeSlots);
    }
}

function initServiceSelection() {
    const serviceOptions = document.querySelectorAll('input[name="servizio"]');
    serviceOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            selectedService = {
                value: e.target.value,
                price: e.target.getAttribute('data-price'),
                duration: e.target.getAttribute('data-duration'),
                name: e.target.closest('.service-option').querySelector('.option-name').textContent
            };
        });
    });
}

function initTimeSlots() {
    const dateInput = document.getElementById('data');
    if (dateInput) {
        dateInput.addEventListener('change', generateTimeSlots);
    }
}

function generateTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlots');
    const dateInput = document.getElementById('data');
    
    if (!timeSlotsContainer || !dateInput.value) return;

    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    const currentHour = today.getHours();

    // Generate time slots from 9:00 to 18:00
    const timeSlots = [];
    for (let hour = 9; hour <= 18; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            if (hour === 18 && minute > 0) break; // Don't go past 18:00
            
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const isUnavailable = isToday && hour <= currentHour;
            
            timeSlots.push({
                time: timeString,
                unavailable: isUnavailable
            });
        }
    }

    // Clear existing slots
    timeSlotsContainer.innerHTML = '';

    // Create time slot elements
    timeSlots.forEach(slot => {
        const slotElement = document.createElement('div');
        slotElement.className = `time-slot ${slot.unavailable ? 'unavailable' : ''}`;
        slotElement.textContent = slot.time;
        
        if (!slot.unavailable) {
            slotElement.addEventListener('click', () => {
                // Remove selected class from all slots
                document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                // Add selected class to clicked slot
                slotElement.classList.add('selected');
                selectedTime = slot.time;
            });
        }
        
        timeSlotsContainer.appendChild(slotElement);
    });
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            // Hide current step
            document.getElementById(`step${currentStep}`).classList.remove('active');
            document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
            
            currentStep++;
            
            // Show next step
            document.getElementById(`step${currentStep}`).classList.add('active');
            document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
            
            // Update summary if on final step
            if (currentStep === 4) {
                updateBookingSummary();
            }
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        // Hide current step
        document.getElementById(`step${currentStep}`).classList.remove('active');
        document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
        
        currentStep--;
        
        // Show previous step
        document.getElementById(`step${currentStep}`).classList.add('active');
        document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
    }
}

function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            if (!selectedService) {
                showNotification('Per favore, seleziona un servizio.', 'error');
                return false;
            }
            break;
        case 2:
            const dateInput = document.getElementById('data');
            if (!dateInput.value) {
                showNotification('Per favore, seleziona una data.', 'error');
                return false;
            }
            if (!selectedTime) {
                showNotification('Per favore, seleziona un orario.', 'error');
                return false;
            }
            selectedDate = dateInput.value;
            break;
        case 3:
            const requiredFields = ['nome', 'email', 'telefono'];
            for (let field of requiredFields) {
                const input = document.getElementById(field);
                if (!input.value.trim()) {
                    showNotification(`Per favore, compila il campo ${field}.`, 'error');
                    return false;
                }
            }
            
            // Validate email
            const email = document.getElementById('email').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Per favore, inserisci un indirizzo email valido.', 'error');
                return false;
            }
            
            // Check privacy checkbox
            const privacy = document.getElementById('privacy');
            if (!privacy.checked) {
                showNotification('Devi accettare la Privacy Policy per continuare.', 'error');
                return false;
            }
            break;
    }
    return true;
}

function updateBookingSummary() {
    if (selectedService) {
        document.getElementById('summaryService').textContent = selectedService.name;
        document.getElementById('summaryPrice').textContent = `€${selectedService.price}`;
        document.getElementById('summaryDuration').textContent = `${selectedService.duration} minuti`;
    }
    
    if (selectedDate) {
        const date = new Date(selectedDate);
        document.getElementById('summaryDate').textContent = date.toLocaleDateString('it-IT');
    }
    
    if (selectedTime) {
        document.getElementById('summaryTime').textContent = selectedTime;
    }
    
    document.getElementById('summaryName').textContent = document.getElementById('nome').value;
    document.getElementById('summaryEmail').textContent = document.getElementById('email').value;
    document.getElementById('summaryPhone').textContent = document.getElementById('telefono').value;
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    // Show loading
    showLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
        showLoading(false);
        showNotification('Prenotazione inviata con successo! Ti contatteremo presto per confermare.', 'success');
        
        // Reset form
        document.getElementById('bookingForm').reset();
        currentStep = 1;
        selectedService = null;
        selectedDate = null;
        selectedTime = null;
        
        // Reset steps
        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
        document.getElementById('step1').classList.add('active');
        document.querySelector('[data-step="1"]').classList.add('active');
        
    }, 2000);
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const contactData = {
            nome: formData.get('nome'),
            email: formData.get('email'),
            telefono: formData.get('telefono'),
            argomento: formData.get('argomento'),
            messaggio: formData.get('messaggio'),
            privacy: formData.get('privacy')
        };

        // Validate required fields
        if (!contactData.nome || !contactData.email || !contactData.messaggio) {
            showNotification('Per favore, compila tutti i campi obbligatori.', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactData.email)) {
            showNotification('Per favore, inserisci un indirizzo email valido.', 'error');
            return;
        }

        // Check privacy checkbox
        if (!contactData.privacy) {
            showNotification('Devi accettare la Privacy Policy per continuare.', 'error');
            return;
        }

        // Show loading
        showLoading(true);
        
        setTimeout(() => {
            showLoading(false);
            showNotification(`Grazie ${contactData.nome}! Il tuo messaggio è stato inviato con successo. Ti risponderemo presto.`, 'success');
            form.reset();
        }, 2000);
    });
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Loading indicator
function showLoading(show) {
    const submitBtns = document.querySelectorAll('.btn-submit');
    
    submitBtns.forEach(btn => {
        if (show) {
            btn.disabled = true;
            const originalText = btn.innerHTML;
            btn.setAttribute('data-original-text', originalText);
            btn.innerHTML = '<span class="loading-spinner"></span> Invio in corso...';
        } else {
            btn.disabled = false;
            const originalText = btn.getAttribute('data-original-text');
            if (originalText) {
                btn.innerHTML = originalText;
            }
        }
    });
}

// Gallery item click effect
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Add a ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            item.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe sections for scroll animations
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Observe cards and items
    document.querySelectorAll('.service-card, .testimonial-card, .value-card, .pricing-card, .gallery-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        observer.observe(item);
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initNavbarScroll();
    initGalleryFilters();
    initPricingCategories();
    initBookingForm();
    initContactForm();
    initFAQ();
    initGallery();
    initScrollAnimations();
    
    console.log('Semplicemente Nails website initialized successfully!');
});

// Make functions globally available
window.nextStep = nextStep;
window.prevStep = prevStep;
window.scrollToSection = scrollToSection;
// Gazze Dijital Platformu - JavaScript Dosyası

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function() {
    // Animasyonlar için IntersectionObserver
    initScrollAnimations();
    
    // Form validasyonları
    initFormValidations();
    
    // Smooth scrolling
    initSmoothScrolling();
    
    // Loading screen (eğer varsa)
    hideLoadingScreen();
    
    // Palestinian flag colors animation
    initFlagAnimation();
});

// Scroll animasyonları
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animasyon eklenecek elementler
    const elementsToAnimate = document.querySelectorAll(
        '.feature-card, .admin-card, .stat, .about-text, .contact-form'
    );

    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Form validasyonları
function initFormValidations() {
    // Kayıt formu validasyonu
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', validateRegisterForm);
    }

    // Giriş formu validasyonu
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', validateLoginForm);
    }

    // Şifre unuttum formu
    const forgotForm = document.getElementById('forgotPasswordForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', validateForgotPasswordForm);
    }

    // Telefon numarası formatı
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', formatPhoneNumber);
    });

    // E-posta gerçek zamanlı validasyonu
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', validateEmail);
    });
}

// Kayıt formu validasyonu
function validateRegisterForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const errors = [];

    // Zorunlu alanlar kontrolü
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'address', 'idNumber', 'profession', 'experience', 'password', 'confirmPassword'];
    
    requiredFields.forEach(field => {
        if (!formData.get(field)) {
            errors.push(`${getFieldLabel(field)} alanı zorunludur.`);
        }
    });

    // Şifre kontrolü
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (password !== confirmPassword) {
        errors.push('Şifreler eşleşmiyor!');
    }

    if (password && password.length < 8) {
        errors.push('Şifre en az 8 karakter olmalıdır!');
    }

    // E-posta formatı kontrolü
    const email = formData.get('email');
    if (email && !isValidEmail(email)) {
        errors.push('Geçerli bir e-posta adresi girin!');
    }

    // Kimlik numarası kontrolü (9 haneli)
    const idNumber = formData.get('idNumber');
    if (idNumber && !/^\d{9}$/.test(idNumber)) {
        errors.push('Kimlik numarası 9 haneli olmalıdır!');
    }

    // Telefon numarası kontrolü
    const phone = formData.get('phone');
    if (phone && !phone.startsWith('+970')) {
        errors.push('Telefon numarası +970 ile başlamalıdır!');
    }

    // Checkbox kontrolü
    const terms = form.querySelector('#terms').checked;
    const verification = form.querySelector('#verification').checked;
    
    if (!terms) {
        errors.push('Kullanım şartlarını kabul etmelisiniz!');
    }
    
    if (!verification) {
        errors.push('Kimlik doğrulama sürecini kabul etmelisiniz!');
    }

    if (errors.length > 0) {
        showErrorModal(errors);
        return false;
    }

    // Form başarılı
    showSuccessMessage('Kayıt başarılı! Kimlik doğrulama için beklemede...');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Giriş formu validasyonu
function validateLoginForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;

    if (!email || !password) {
        showErrorMessage('Lütfen tüm alanları doldurun!');
        return false;
    }

    if (!isValidEmail(email)) {
        showErrorMessage('Geçerli bir e-posta adresi girin!');
        return false;
    }

    // Demo kontrol
    if (email === 'admin@gazze.com' && password === 'admin123') {
        showSuccessMessage('Admin olarak giriş yapıldı!');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
    } else if (email && password) {
        showSuccessMessage('Giriş başarılı!');
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
    }
}

// Şifre sıfırlama formu validasyonu
function validateForgotPasswordForm(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('#email').value;
    
    if (!email) {
        showErrorMessage('Lütfen e-posta adresinizi girin!');
        return false;
    }

    if (!isValidEmail(email)) {
        showErrorMessage('Geçerli bir e-posta adresi girin!');
        return false;
    }

    showSuccessMessage(`Şifre sıfırlama bağlantısı ${email} adresine gönderildi!`);
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// E-posta validasyonu
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Telefon numarası formatı
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.startsWith('970')) {
        value = '+' + value;
    } else if (value.startsWith('0')) {
        value = '+970' + value.substring(1);
    } else if (value && !value.startsWith('+970')) {
        value = '+970' + value;
    }
    
    e.target.value = value;
}

// E-posta blur validasyonu
function validateEmail(e) {
    const email = e.target.value;
    const emailField = e.target;
    
    if (email && !isValidEmail(email)) {
        emailField.style.borderColor = 'var(--palestinian-red)';
        showFieldError(emailField, 'Geçerli bir e-posta adresi girin!');
    } else {
        emailField.style.borderColor = 'var(--palestinian-green)';
        hideFieldError(emailField);
    }
}

// Smooth scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Palestinian flag animation
function initFlagAnimation() {
    const flagLogos = document.querySelectorAll('.flag-logo');
    
    flagLogos.forEach(flag => {
        flag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        flag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Loading screen gizleme
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    }
}

// Hata mesajı göster
function showErrorMessage(message) {
    const errorDiv = createMessageDiv(message, 'error');
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 4000);
}

// Başarı mesajı göster
function showSuccessMessage(message) {
    const successDiv = createMessageDiv(message, 'success');
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 4000);
}

// Hata modal göster
function showErrorModal(errors) {
    const modal = document.createElement('div');
    modal.className = 'error-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 10px;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    
    modalContent.innerHTML = `
        <h3 style="color: var(--palestinian-red); margin-bottom: 1rem;">
            <i class="fas fa-exclamation-triangle"></i> Form Hataları
        </h3>
        <ul style="color: var(--text-dark); margin-bottom: 2rem;">
            ${errors.map(error => `<li style="margin-bottom: 0.5rem;">${error}</li>`).join('')}
        </ul>
        <button onclick="this.closest('.error-modal').remove()" 
                style="background: var(--palestinian-red); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
            Tamam
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Modal dışında tıklayınca kapat
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Mesaj div oluştur
function createMessageDiv(message, type) {
    const div = document.createElement('div');
    div.className = `message-toast ${type}`;
    
    const bgColor = type === 'error' ? 'var(--palestinian-red)' : 'var(--palestinian-green)';
    
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    div.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    return div;
}

// Field label getir
function getFieldLabel(fieldName) {
    const labels = {
        'firstName': 'Ad',
        'lastName': 'Soyad',
        'email': 'E-posta',
        'phone': 'Telefon',
        'birthDate': 'Doğum Tarihi',
        'address': 'Adres',
        'idNumber': 'Kimlik Numarası',
        'profession': 'Meslek',
        'experience': 'Deneyim',
        'password': 'Şifre',
        'confirmPassword': 'Şifre Tekrar',
        'skills': 'Beceriler'
    };
    return labels[fieldName] || fieldName;
}

// Field error göster
function showFieldError(field, message) {
    hideFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: var(--palestinian-red);
        font-size: 0.85rem;
        margin-top: 0.25rem;
    `;
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Field error gizle
function hideFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Admin panel fonksiyonları
function approveUser(userId) {
    if (confirm('Bu kullanıcıyı onaylamak istediğinizden emin misiniz?')) {
        showSuccessMessage(`Kullanıcı ID: ${userId} başarıyla onaylandı!`);
        updateUserStatus(userId, 'approved');
    }
}

function rejectUser(userId) {
    const reason = prompt('Red sebebini girin:');
    if (reason) {
        showErrorMessage(`Kullanıcı ID: ${userId} reddedildi. Sebep: ${reason}`);
        updateUserStatus(userId, 'rejected');
    }
}

function viewDetails(userId) {
    // Bu fonksiyon gerçek uygulamada modal açacak
    alert(`Kullanıcı ID: ${userId} detaylarını görüntüleme - Bu özellik geliştirme aşamasında`);
}

function updateUserStatus(userId, status) {
    // Gerçek uygulamada API isteği gönderilecek
    const row = document.querySelector(`tr:nth-child(${userId})`);
    if (row) {
        const statusCell = row.querySelector('.status-pending');
        if (statusCell) {
            statusCell.textContent = status === 'approved' ? 'Onaylandı' : 'Reddedildi';
            statusCell.className = status === 'approved' ? 'status-approved' : 'status-rejected';
            
            // Satırı gizle veya üstünü çiz
            row.style.opacity = '0.6';
        }
    }
}

// CSS animasyonları ekle
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .status-rejected {
        color: var(--palestinian-red);
        font-weight: bold;
        text-decoration: line-through;
    }
    
    .feature-card:hover .fas {
        transform: scale(1.1);
        transition: transform 0.3s ease;
    }
    
    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .admin-stat:hover {
        transform: translateY(-3px);
        transition: transform 0.3s ease;
    }
`;

document.head.appendChild(style); 
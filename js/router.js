let pageUrls = {
    about: '/index.html?about',
    contact: '/index.html?contact',
    gallery: '/index.html?gallery'
};

function OnStartUp() {
    popStateHandler();
}

OnStartUp();

document.querySelector('#about-link').addEventListener('click', (event) => {
    let stateObj = { page: 'about' };
    document.title = 'About';
    history.pushState(stateObj, "about", "?about");
    RenderAboutPage();
});

document.querySelector('#contact-link').addEventListener('click', (event) => {
    let stateObj = { page: 'contact' };
    document.title = 'Contact';
    history.pushState(stateObj, "contact", "?contact");
    RenderContactPage();
});

document.querySelector('#gallery-link').addEventListener('click', (event) => {
    let stateObj = { page: 'gallery' };
    document.title = 'Gallery';
    history.pushState(stateObj, "gallery", "?gallery");
    RenderGalleryPage();
});

function RenderAboutPage() {
    document.querySelector('main').innerHTML = `
    <h1 class="title">About Me</h1>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;
}

function RenderContactPage() {
    document.querySelector('main').innerHTML = `
    <h1 class="title">Kontakt</h1>
    <div class="contact-container">
        <form id="contact-form" class="contact-form">
            <div class="form-group">
                <label for="name">Imię i nazwisko:</label>
                <input type="text" id="name" name="name" required>
                <span class="error-message" id="name-error"></span>
            </div>
            
            <div class="form-group">
                <label for="email">E-mail:</label>
                <input type="email" id="email" name="email" required>
                <span class="error-message" id="email-error"></span>
            </div>
            
            <div class="form-group">
                <label for="message">Wiadomość:</label>
                <textarea id="message" name="message" rows="5" required></textarea>
                <span class="error-message" id="message-error"></span>
            </div>
            
            <div class="form-group captcha-container">
                <div id="recaptcha" class="g-recaptcha" data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></div>
                <span class="error-message" id="recaptcha-error"></span>
            </div>
            
            <div class="form-group">
                <button type="submit" class="submit-button">Wyślij wiadomość</button>
            </div>
        </form>
        
        <div id="form-success" class="form-success" style="display: none;">
            <h2>Dziękujemy za wiadomość!</h2>
            <p>Odpowiemy najszybciej, jak to możliwe.</p>
        </div>
    </div>`;
   
    // Dodanie skryptu reCAPTCHA
    if (!document.getElementById('recaptcha-script')) {
        const recaptchaScript = document.createElement('script');
        recaptchaScript.id = 'recaptcha-script';
        recaptchaScript.src = 'https://www.google.com/recaptcha/api.js';
        recaptchaScript.async = true;
        recaptchaScript.defer = true;
        document.head.appendChild(recaptchaScript);
    }
    
    // Walidacja formularza
    document.getElementById('contact-form').addEventListener('submit', (event) => {
        event.preventDefault();
        
        if (validateForm()) {
            // Symulacja wysłania formularza (w rzeczywistej aplikacji byłby tutaj AJAX)
            document.getElementById('contact-form').style.display = 'none';
            document.getElementById('form-success').style.display = 'block';
            
            // W rzeczywistej aplikacji: wywołanie API
            console.log('Formularz wysłany poprawnie:', {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            });
        }
    });
}

function validateForm() {
    let isValid = true;
    
    // Walidacja imienia
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    
    if (nameInput.value.trim() === '') {
        nameError.textContent = 'Proszę podać imię i nazwisko';
        isValid = false;
    } else if (nameInput.value.trim().length < 3) {
        nameError.textContent = 'Imię i nazwisko powinno zawierać co najmniej 3 znaki';
        isValid = false;
    } else {
        nameError.textContent = '';
    }
    
    // Walidacja email
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailInput.value.trim() === '') {
        emailError.textContent = 'Proszę podać adres e-mail';
        isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
        emailError.textContent = 'Proszę podać poprawny adres e-mail';
        isValid = false;
    } else {
        emailError.textContent = '';
    }
    
    // Walidacja wiadomości
    const messageInput = document.getElementById('message');
    const messageError = document.getElementById('message-error');
    
    if (messageInput.value.trim() === '') {
        messageError.textContent = 'Proszę wpisać wiadomość';
        isValid = false;
    } else if (messageInput.value.trim().length < 10) {
        messageError.textContent = 'Wiadomość powinna zawierać co najmniej 10 znaków';
        isValid = false;
    } else {
        messageError.textContent = '';
    }
    
    // Walidacja reCAPTCHA
    const recaptchaError = document.getElementById('recaptcha-error');
    const recaptchaResponse = grecaptcha?.getResponse();
    
    if (!recaptchaResponse) {
        recaptchaError.textContent = 'Proszę potwierdzić, że nie jesteś robotem';
        isValid = false;
    } else {
        recaptchaError.textContent = '';
    }
    
    return isValid;
}

function RenderGalleryPage() {
    document.querySelector('main').innerHTML = `
    <h1 class="title">Gallery</h1>
    <div class="gallery-container">
        <div class="gallery-grid">
            ${generateGalleryItems(9)}
        </div>
    </div>
    <div id="image-modal" class="modal">
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <img id="modal-img" src="" alt="Powiększone zdjęcie">
        </div>
    </div>`;
    
    initializeGallery();
}

function generateGalleryItems(count) {
    let galleryHTML = '';
    for (let i = 1; i <= count; i++) {
        galleryHTML += `
        <div class="gallery-item">
            <div class="image-placeholder" data-src="https://picsum.photos/id/${i+10}/800/600">
                <div class="loading-spinner"></div>
            </div>
        </div>`;
    }
    return galleryHTML;
}

function initializeGallery() {
    // Initialize lazy loading
    const lazyLoadImages = document.querySelectorAll('.image-placeholder');
    
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const imgPlaceholder = entry.target;
                const imgUrl = imgPlaceholder.dataset.src;
                
                // Fetch image as blob
                fetch(imgUrl)
                    .then(response => response.blob())
                    .then(blob => {
                        // Create blob URL
                        const blobUrl = URL.createObjectURL(blob);
                        
                        // Create image element
                        const img = document.createElement('img');
                        img.src = blobUrl;
                        img.className = 'gallery-image';
                        img.alt = 'Gallery Image';
                        
                        // Remove loading spinner and add image
                        imgPlaceholder.innerHTML = '';
                        imgPlaceholder.appendChild(img);
                        
                        // Add click event to open modal
                        img.addEventListener('click', () => openModal(blobUrl));
                        
                        // Stop observing this element
                        observer.unobserve(imgPlaceholder);
                    })
                    .catch(error => {
                        console.error('Error loading image:', error);
                        imgPlaceholder.innerHTML = '<p>Error loading image</p>';
                    });
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });
    
    lazyLoadImages.forEach(img => {
        lazyLoadObserver.observe(img);
    });
    
    // Modal functionality
    const modal = document.getElementById('image-modal');
    const closeButton = document.querySelector('.close-button');
    
    // Close modal when clicking the close button
    closeButton.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', event => {
        if (event.target === modal) {
            closeModal();
        }
    });
}

function openModal(imgSrc) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    
    modalImg.src = imgSrc;
    modal.style.display = 'flex';
    
    // Prevent scrolling of background content
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'none';
    
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
}

function popStateHandler() {
    let loc = window.location.href.toString().split(window.location.host)[1];
    if (loc === pageUrls.contact){ RenderContactPage(); }
    else if (loc === pageUrls.about){ RenderAboutPage(); }
    else if (loc === pageUrls.gallery){ RenderGalleryPage(); }
}

window.onpopstate = popStateHandler; 

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
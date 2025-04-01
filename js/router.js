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
    <h1 class="title">Contact with me</h1>
    <form id="contact-form">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
    <label for="message">Message:</label>
    <textarea id="message" name="message" required></textarea>
    <button type="submit">Send</button>
    </form>`;
   
    document.getElementById('contact-form').addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Form submitted!');
    });
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
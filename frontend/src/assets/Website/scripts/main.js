// Login Form Handling
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  console.log('Login attempt:', { email, password });
});

// Signup Form Handling
document.getElementById('signupForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  console.log('Signup attempt:', { name, email, password });
});

// Contact Modal Handling
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('contact-modal');
  const contactLink = document.getElementById('contact-us');
  const closeModal = document.querySelector('.close-modal');

  if (contactLink) {
    contactLink.addEventListener('click', function(e) {
      e.preventDefault();
      modal.style.display = 'flex';
    });
  }

  if (closeModal) {
    closeModal.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});

// Color Selection and Cart Logic
document.addEventListener('DOMContentLoaded', function() {
  // Initialize color selection for all products
  document.querySelectorAll('.product-card').forEach(productCard => {
    const colorButtons = productCard.querySelectorAll('.color-btn');
    const images = productCard.querySelectorAll('.product-images img');
    
    // Activate first color by default
    colorButtons[0]?.classList.add('active');
    images[0]?.classList.add('active');

    // Handle color button clicks
    colorButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active state from all buttons/images
        colorButtons.forEach(b => b.classList.remove('active'));
        images.forEach(img => img.classList.remove('active'));
        
        // Get selected color
        const color = this.dataset.color;
        
        // Activate clicked button
        this.classList.add('active');
        
        // Activate corresponding image
        const targetImage = productCard.querySelector(`.product-images img[alt="${color}"]`);
        if (targetImage) targetImage.classList.add('active');
      });
    });
  });

  // Cart Functionality
  const cartCounter = document.querySelector('.cart-counter');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      
      // Get product details
      const name = productCard.querySelector('h2').textContent;
      const priceText = productCard.querySelector('p strong').nextSibling.nodeValue.trim();
      const price = parseInt(priceText.replace(/₹|,/g, ''));
      
      // Get selected color from ACTIVE BUTTON (not image)
      const colorBtn = productCard.querySelector('.color-btn.active');
      if (!colorBtn) {
        alert('Please select a color first!');
        return;
      }
      const color = colorBtn.dataset.color;
      
      // Get image from ACTIVE IMAGE
      const image = productCard.querySelector('.product-images img.active').src;

      // Add to cart
      const id = `${name}_${color}`.replace(/\s+/g, '_').toLowerCase();
      const existingItem = cart.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({
          id,
          name,
          price,
          color,
          image,
          quantity: 1
        });
      }

      // Update storage and UI
      localStorage.setItem('cart', JSON.stringify(cart));
      cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    });
  });
});

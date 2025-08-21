document.addEventListener('DOMContentLoaded', function() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartCounter = document.querySelector('.cart-counter');

  // Update cart counter
  if (cartCounter) {
    cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Handle null/undefined color
  function getColorHex(color) {
    if (!color) return '#CCCCCC'; // Default to gray
    const colors = {
      black: '#000000',
      gray: '#5b5b5b',
      orange: '#ff8800',
      red: '#ff0000',
      white: '#ffffff'
    };
    return colors[color?.toLowerCase()] || '#CCCCCC'; // Optional chaining
  }

    function capitalizeFirst(str) {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }


  // Render cart items
  function renderCart() {
    cartItemsEl.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="item-details">
          <h3>${item.name}</h3>
          <p>Color: <span class="item-color" style="background: ${getColorHex(item.color)}"></span> ${capitalizeFirst(item.color)}</p>
          <p>Price: ₹${item.price}</p>
        </div>
        <div class="quantity-controls">
          <button class="decrease" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="increase" data-index="${index}">+</button>
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>
      `;
      cartItemsEl.appendChild(itemEl);
    });

    cartTotalEl.textContent = total;
  }

  renderCart();

  // Event listeners for quantity controls
  document.addEventListener('click', (e) => {
    const index = parseInt(e.target.dataset.index);
    if (isNaN(index)) return;

    if (e.target.classList.contains('decrease')) {
      if (cart[index].quantity > 1) cart[index].quantity--;
      else cart.splice(index, 1);
    } else if (e.target.classList.contains('increase')) {
      cart[index].quantity++;
    } else if (e.target.classList.contains('remove-btn')) {
      cart.splice(index, 1);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const cartIcons = document.querySelectorAll('.fa-shopping-cart');
  const clearCartBtn = document.getElementById('clear-cart');
  const cartList = document.getElementById('cart-items-list');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');

  // Initialize cart
  loadCart();

  // Add to cart
  cartIcons.forEach(icon => {
    icon.addEventListener('click', async function () {
      const product = this.closest('.featured__item');
      const productId = product.getAttribute('data-id');
      const name = product.getAttribute('data-name');
      const price = parseFloat(product.getAttribute('data-price'));

      try {
        const response = await fetch(`/api/cart/${productId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: 1 })
        });

        if (!response.ok) throw new Error('Failed to add to cart');
        showToast(`${name} added to cart!`);
        loadCart();
      } catch (error) {
        console.error('Error:', error);
        showToast('Failed to add item to cart', 'error');
      }
    });
  });

  // Load cart from server
  async function loadCart() {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) throw new Error('Failed to load cart');
      const cart = await response.json();
      updateCartUI(cart);
      renderCartTable(cart);
      renderCheckoutSummary(cart);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }

  // Update cart UI
  function updateCartUI(cart) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = totalItems);
    document.querySelectorAll('.total-price').forEach(el => el.textContent = 'Ksh ' + totalPrice.toFixed(2));
  }

  // Render cart table
  function renderCartTable(cart) {
    const tableBody = document.getElementById('cart-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    if (cart.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5">Your cart is empty.</td></tr>';
      return;
    }

    cart.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>Ksh ${item.price.toFixed(2)}</td>
        <td>
          <div class="quantity-wrapper">
            <button class="decrease-qty" data-id="${item.id}">–</button>
            <input type="number" class="quantity-input" data-id="${item.id}" value="${item.quantity}" min="1" />
            <button class="increase-qty" data-id="${item.id}">+</button>
          </div>
        </td>
        <td>Ksh ${(item.quantity * item.price).toFixed(2)}</td>
        <td><button class="remove-btn" data-id="${item.id}">Remove</button></td>
      `;
      tableBody.appendChild(row);
    });

    tableBody.addEventListener('click', async (e) => {
      const itemId = e.target.getAttribute('data-id');

      if (e.target.classList.contains('remove-btn')) {
        try {
          const response = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
          if (!response.ok) throw new Error();
          loadCart();
          showToast('Item removed from cart');
        } catch (error) {
          showToast('Failed to remove item', 'error');
        }
      }

      if (e.target.classList.contains('increase-qty')) {
        const input = e.target.parentElement.querySelector('.quantity-input');
        const newQty = parseInt(input.value) + 1;
        await updateCartItem(itemId, newQty);
      }

      if (e.target.classList.contains('decrease-qty')) {
        const input = e.target.parentElement.querySelector('.quantity-input');
        const newQty = Math.max(1, parseInt(input.value) - 1);
        await updateCartItem(itemId, newQty);
      }
    });

    tableBody.addEventListener('change', async (e) => {
      if (e.target.classList.contains('quantity-input')) {
        const itemId = e.target.getAttribute('data-id');
        const newQty = Math.max(1, parseInt(e.target.value) || 1);
        await updateCartItem(itemId, newQty);
      }
    });
  }

  async function updateCartItem(itemId, quantity) {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });

      if (!response.ok) throw new Error();
      loadCart();
    } catch (error) {
      showToast('Failed to update quantity', 'error');
    }
  }

  function renderCheckoutSummary(cart) {
    if (!cartList || !subtotalEl || !totalEl) return;

    cartList.innerHTML = '';
    const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    cart.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name}`;
      const span = document.createElement('span');
      span.textContent = `Ksh ${(item.quantity * item.price).toFixed(2)}`;
      li.appendChild(span);
      cartList.appendChild(li);
    });

    subtotalEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
    totalEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', async function () {
      if (confirm("Are you sure you want to clear the cart?")) {
        try {
          const response = await fetch('/api/cart', { method: 'DELETE' });
          if (!response.ok) throw new Error();
          loadCart();
          showToast('Cart cleared');
        } catch (error) {
          showToast('Failed to clear cart', 'error');
        }
      }
    });
  }

  const placeOrderBtn = document.querySelector('button[type="submit"]');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', async function (e) {
      e.preventDefault();

      try {
        const cartResponse = await fetch('/api/cart');
        if (!cartResponse.ok) throw new Error('Failed to load cart');
        const cart = await cartResponse.json();

        if (cart.length === 0) {
          showToast("Your cart is empty!", 'error');
          return;
        }

        const paymentCheck = document.getElementById('payment-check')?.checked;
        const paypal = document.getElementById('paypal')?.checked;

        if (!paymentCheck && !paypal) {
          showToast("Please select a payment method.", 'error');
          return;
        }

        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethod: paymentCheck ? 'credit_card' : 'paypal'
          })
        });

        if (!orderResponse.ok) throw new Error('Failed to place order');

        showToast("Order placed successfully!");
        loadCart();
      } catch (error) {
        console.error('Order error:', error);
        showToast("Failed to place order", 'error');
      }
    });
  }

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
});

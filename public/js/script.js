document.addEventListener('DOMContentLoaded', function () {
  const cartIcons = document.querySelectorAll('.fa-shopping-cart');
  const clearCartBtn = document.getElementById('clear-cart');
  const cartList = document.getElementById('cart-items-list');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');
  const cartTableBody = document.getElementById('cart-table-body');

  // Fetch and render cart data on page load
  fetchCartData();

  // Clear cart functionality
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', async function () {
      if (confirm("Are you sure you want to clear the cart?")) {
        await fetch('/api/cart', { method: 'DELETE' }); // Delete all items in the cart
        fetchCartData(); // Re-fetch and render cart data
        alert('Cart has been cleared!');
      }
    });
  }

  // Function to fetch cart data from the backend
  async function fetchCartData() {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();

      renderCartTable(data.items);
      renderCheckoutSummary(data.items);
      updateCartUI(data.cartCount);
    } catch (err) {
      console.error('Error loading cart:', err);
      alert('Failed to load cart.');
    }
  }

  // Render cart table with fetched data
  function renderCartTable(cartItems) {
    cartTableBody.innerHTML = ''; // Clear existing table rows
    let total = 0;

    if (cartItems.length === 0) {
      cartTableBody.innerHTML = '<tr><td colspan="5">Your cart is empty.</td></tr>';
      return;
    }

    cartItems.forEach(item => {
      const subtotal = item.quantity * item.price;
      total += subtotal;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.product_name}</td>
        <td>Ksh ${item.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>Ksh ${subtotal.toFixed(2)}</td>
        <td><button class="remove-btn" data-id="${item.product_id}">Remove</button></td>
      `;
      cartTableBody.appendChild(row);
    });

    // Update total cost
    const totalCostEl = document.querySelector('.total-cost');
    if (totalCostEl) totalCostEl.textContent = `Total: Ksh ${total.toFixed(2)}`;
  }

  // Update cart UI elements (count and total price)
  function updateCartUI(cartCount) {
    const countEls = document.querySelectorAll('.cart-count');
    const priceEls = document.querySelectorAll('.total-price');

    // Update cart item count and price
    countEls.forEach(el => el.textContent = cartCount);
    priceEls.forEach(el => el.textContent = 'Ksh ' + cartCount.toFixed(2));
  }

  // Render checkout summary
  function renderCheckoutSummary(cartItems) {
    if (!cartList || !subtotalEl || !totalEl) return;

    cartList.innerHTML = '';
    let subtotal = 0;

    cartItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      const li = document.createElement('li');
      li.textContent = `${item.product_name} `;
      const span = document.createElement('span');
      span.textContent = `Ksh ${itemTotal.toFixed(2)}`;
      li.appendChild(span);
      cartList.appendChild(li);
      subtotal += itemTotal;
    });

    subtotalEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
    totalEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
  }

  // Remove item from cart (using product_id)
  document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('remove-btn')) {
      const productId = e.target.getAttribute('data-id');
      await fetch(`/api/cart/${productId}`, { method: 'DELETE' });
      fetchCartData(); // Re-fetch and render updated cart data
    }
  });
});

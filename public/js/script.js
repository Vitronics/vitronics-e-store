document.addEventListener('DOMContentLoaded', function () {
  const cartIcons = document.querySelectorAll('.fa-shopping-cart');
  const clearCartBtn = document.getElementById('clear-cart');
  const cartList = document.getElementById('cart-items-list');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');

  // Initialize cart UI
  fetchCartData().then(() => {
    updateCartUI();
    renderCartTable();
    renderCheckoutSummary();
  });

  // Add to cart
  cartIcons.forEach(icon => {
    icon.addEventListener('click', async function (e) {
      const product = this.closest('.featured__item');
      const product_id = product.getAttribute('data-id');
      const name = product.getAttribute('data-name');
      const price = parseFloat(product.getAttribute('data-price'));

      try {
        const response = await fetch('/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ product_id, name, price, quantity: 1 })
        });

        if (response.ok) {
          const data = await response.json();
          await fetchCartData();
          showToast('Item added to cart!');
        } else {
          const error = await response.json();
          showToast(error.error || 'Could not add to cart', 'error');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Failed to add item to cart', 'error');
      }
    });
  });

  // Remove from cart
  document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('remove-btn')) {
      const product_id = e.target.getAttribute('data-id');
      
      try {
        const response = await fetch(`/api/cart/${product_id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await fetchCartData();
          showToast('Item removed from cart');
        } else {
          const error = await response.json();
          showToast(error.error || 'Could not remove item', 'error');
        }
      } catch (error) {
        console.error('Error removing item:', error);
        showToast('Failed to remove item', 'error');
      }
    }
  });

  // Clear cart
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', async function () {
      if (confirm("Are you sure you want to clear the cart?")) {
        try {
          const response = await fetch('/api/cart', {
            method: 'DELETE'
          });

          if (response.ok) {
            await fetchCartData();
            showToast('Cart has been cleared');
          } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to clear cart');
          }
        } catch (error) {
          console.error('Error clearing cart:', error);
          showToast(error.message, 'error');
        }
      }
    });
  }

  // Fetch cart data from server
  async function fetchCartData() {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) throw new Error('Failed to fetch cart data');
      
      const data = await response.json();
      window.cartData = data.items || [];
      window.cartCount = data.cartCount || 0;
    } catch (error) {
      console.error('Error fetching cart data:', error);
      window.cartData = [];
      window.cartCount = 0;
    }
  }

  function updateCartUI() {
    const cart = window.cartData || [];
    let totalItems = window.cartCount || 0;
    let totalPrice = 0;

    cart.forEach(item => {
      totalPrice += item.quantity * item.price;
    });

    const countEls = document.querySelectorAll('.cart-count');
    const priceEls = document.querySelectorAll('.total-price');

    countEls.forEach(el => el.textContent = totalItems);
    priceEls.forEach(el => el.textContent = 'Ksh ' + totalPrice.toFixed(2));
  }

  function renderCartTable() {
    const cart = window.cartData || [];
    const tableBody = document.getElementById('cart-table-body');
    const totalCostEl = document.querySelector('.total-cost');

    if (!tableBody || !totalCostEl) return;

    tableBody.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5">Your cart is empty.</td></tr>';
      totalCostEl.textContent = 'Total: Ksh 0.00';
      return;
    }

    cart.forEach(item => {
      const subtotal = item.quantity * item.price;
      total += subtotal;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <img src="${item.product_image}" alt="${item.product_name}" width="50">
          ${item.product_name}
        </td>
        <td>Ksh ${item.price.toFixed(2)}</td>
        <td>
          <div class="quantity-wrapper" style="display: flex; align-items: center;">
            <button class="decrease-qty" data-id="${item.product_id}" style="padding: 2px 6px; border:none;">–</button>
            <input type="number" class="quantity-input" data-id="${item.product_id}" value="${item.quantity}" min="1" style="width: 60px; margin: 0 5px;" />
            <button class="increase-qty" data-id="${item.product_id}" style="padding: 2px 6px; border:none;">+</button>
          </div>
        </td>
        <td>Ksh ${subtotal.toFixed(2)}</td>
        <td><button class="remove-btn" data-id="${item.product_id}">Remove</button></td>
      `;
      tableBody.appendChild(row);
    });

    totalCostEl.textContent = `Total: Ksh ${total.toFixed(2)}`;

    // Quantity input change
    tableBody.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', async function () {
        const product_id = this.getAttribute('data-id');
        let newQty = parseInt(this.value);
        if (isNaN(newQty) || newQty < 1) newQty = 1;

        try {
          const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              product_id,
              quantity: newQty - parseInt(this.getAttribute('value'))
            })
          });

          if (response.ok) {
            await fetchCartData();
          } else {
            const error = await response.json();
            showToast(error.error || 'Could not update quantity', 'error');
          }
        } catch (error) {
          console.error('Error updating quantity:', error);
          showToast('Failed to update quantity', 'error');
        }
      });
    });

    // Increase quantity
    tableBody.querySelectorAll('.increase-qty').forEach(btn => {
      btn.addEventListener('click', async function () {
        const product_id = this.getAttribute('data-id');
        
        try {
          const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              product_id,
              quantity: 1
            })
          });

          if (response.ok) {
            await fetchCartData();
          } else {
            const error = await response.json();
            showToast(error.error || 'Could not increase quantity', 'error');
          }
        } catch (error) {
          console.error('Error increasing quantity:', error);
          showToast('Failed to increase quantity', 'error');
        }
      });
    });

    // Decrease quantity
    tableBody.querySelectorAll('.decrease-qty').forEach(btn => {
      btn.addEventListener('click', async function () {
        const product_id = this.getAttribute('data-id');
        
        try {
          const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              product_id,
              quantity: -1
            })
          });

          if (response.ok) {
            await fetchCartData();
          } else {
            const error = await response.json();
            showToast(error.error || 'Could not decrease quantity', 'error');
          }
        } catch (error) {
          console.error('Error decreasing quantity:', error);
          showToast('Failed to decrease quantity', 'error');
        }
      });
    });
  }

  function renderCheckoutSummary() {
    const cart = window.cartData || [];
    if (!cartList || !subtotalEl || !totalEl) return;

    cartList.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
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

  // Place order
  const placeOrderBtn = document.querySelector('button[type="submit"]');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', async function (e) {
      e.preventDefault();

      const cart = window.cartData || [];
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

      try {
        // Here you would typically send the order to your server
        // For now we'll just simulate a successful order
        showToast("Your order has been placed successfully!");
        
        // Clear the cart after successful order
        await fetch('/api/cart', { method: 'DELETE' });
        await fetchCartData();
      } catch (error) {
        console.error('Error placing order:', error);
        showToast("Failed to place order", 'error');
      }
    });
  }

  // Toast notification function
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 2000);
    }, 100);

    // Add styles if not already present
    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        .toast {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #4CAF50;
          color: white;
          padding: 12px 24px;
          border-radius: 4px;
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 1000;
        }
        .toast.error {
          background: #f44336;
        }
        .toast.show {
          opacity: 1;
        }
      `;
      document.head.appendChild(style);
    }
  }
});
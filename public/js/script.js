document.addEventListener('DOMContentLoaded', function() {
  const cartTableBody = document.getElementById('cart-table-body');
  const cartCountEl = document.querySelector('.cart-count');
  const totalPriceEl = document.querySelector('.total-price');

  // Fetch and display cart data
  fetchCartData();

  async function fetchCartData() {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) throw new Error('Failed to load cart');
      
      const { items, cartCount } = await response.json();
      renderCartTable(items, cartCount);
    } catch (error) {
      console.error('Error loading cart:', error);
      showToast('Failed to load cart', 'error');
      renderCartTable([], 0); // Show empty table
    }
  }

  function renderCartTable(items, cartCount) {
    // Clear existing rows
    cartTableBody.innerHTML = '';
    
    // Update cart count
    cartCountEl.textContent = cartCount || 0;
    
    // Calculate total price
    let totalPrice = 0;

    if (items.length === 0) {
      cartTableBody.innerHTML = '<tr><td colspan="5">Your cart is empty</td></tr>';
      totalPriceEl.textContent = 'Ksh 0.00';
      return;
    }

    // Add each item to the table
    items.forEach(item => {
      const subtotal = item.quantity * parseFloat(item.price);
      totalPrice += subtotal;
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <img src="${item.product_image}" alt="${item.product_name}" width="50">
          ${item.product_name}
        </td>
        <td>Ksh ${parseFloat(item.price).toFixed(2)}</td>
        <td>
          <button class="decrease-qty" data-id="${item.product_id}">-</button>
          <input type="number" class="quantity-input" 
                 data-id="${item.product_id}" 
                 value="${item.quantity}" min="1">
          <button class="increase-qty" data-id="${item.product_id}">+</button>
        </td>
        <td>Ksh ${subtotal.toFixed(2)}</td>
        <td>
          <button class="remove-btn" data-id="${item.product_id}">Remove</button>
        </td>
      `;
      cartTableBody.appendChild(row);
    });

    // Update total price
    totalPriceEl.textContent = `Ksh ${totalPrice.toFixed(2)}`;
  }

  // Event delegation for cart actions
  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('remove-btn')) {
      await removeItem(e.target.dataset.id);
    } else if (e.target.classList.contains('increase-qty')) {
      await updateQuantity(e.target.dataset.id, 1);
    } else if (e.target.classList.contains('decrease-qty')) {
      await updateQuantity(e.target.dataset.id, -1);
    }
  });

  // Handle quantity input changes
  cartTableBody.addEventListener('change', async (e) => {
    if (e.target.classList.contains('quantity-input')) {
      const productId = e.target.dataset.id;
      const newQty = parseInt(e.target.value) || 1;
      await updateQuantity(productId, newQty, true);
    }
  });

  // Remove item from cart
  async function removeItem(productId) {
    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to remove item');
      
      showToast('Item removed from cart');
      await fetchCartData();
    } catch (error) {
      console.error('Error removing item:', error);
      showToast(error.message, 'error');
    }
  }

  // Update item quantity
  async function updateQuantity(productId, change, isAbsolute = false) {
    try {
      const body = isAbsolute 
        ? { quantity: change } 
        : { quantity_change: change };
      
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) throw new Error('Failed to update quantity');
      
      await fetchCartData();
    } catch (error) {
      console.error('Error updating quantity:', error);
      showToast(error.message, 'error');
    }
  }

  // Toast notification
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
  }

  // Add CSS for toast if not exists
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
});
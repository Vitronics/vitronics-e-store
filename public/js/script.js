
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, initializing cart...');

  const cartTableBody = document.getElementById('cart-table-body');
  if (!cartTableBody) {
    console.error('cart-table-body element not found!');
    return;
  }

  try {
    const cartData = await fetchCartData();
    renderCartTable(cartData.items, cartData.cartCount);
    setupCartEventListeners();
  } catch (error) {
    console.error('Initial cart load failed:', error);
    renderCartTable([], 0);
    showToast('Failed to load cart. Please refresh the page.', 'error');
  }

  async function fetchCartData() {
    try {
      const response = await fetch('/api/cart', {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch (e) {
          const text = await response.text();
          if (text) errorMsg = text;
        }
        throw new Error(errorMsg);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  function renderCartTable(items, cartCount) {
    cartTableBody.innerHTML = '';

    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = cartCount || 0;
    });

    let totalPrice = 0;

    if (!items || items.length === 0) {
      cartTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Your cart is empty</td></tr>';
      document.querySelectorAll('.total-price').forEach(el => {
        el.textContent = 'Ksh 0.00';
      });
      return;
    }

    items.forEach(item => {
      const subtotal = item.quantity * parseFloat(item.price);
      totalPrice += subtotal;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="align-middle">
          <img src="${item.product_image}" alt="${item.product_name}" width="50" class="mr-2">
          ${item.product_name}
        </td>
        <td class="align-middle">Ksh ${parseFloat(item.price).toFixed(2)}</td>
        <td class="align-middle">
          <div class="d-flex align-items-center">
            <button class="btn btn-sm btn-outline-secondary decrease-qty" data-id="${item.product_id}">-</button>
            <input type="number" class="form-control form-control-sm quantity-input mx-2"
                   data-id="${item.product_id}" value="${item.quantity}" min="1" style="width: 60px;">
            <button class="btn btn-sm btn-outline-secondary increase-qty" data-id="${item.product_id}">+</button>
          </div>
        </td>
        <td class="align-middle">Ksh ${subtotal.toFixed(2)}</td>
        <td class="align-middle">
          <button class="btn btn-sm btn-outline-danger remove-btn" data-id="${item.product_id}">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      `;
      cartTableBody.appendChild(row);
    });

    document.querySelectorAll('.total-price').forEach(el => {
      el.textContent = `Ksh ${totalPrice.toFixed(2)}`;
    });
  }

  function setupCartEventListeners() {
    document.addEventListener('click', async (e) => {
      const target = e.target;
      try {
        if (target.closest('.remove-btn')) {
          const btn = target.closest('.remove-btn');
          await removeItem(btn.dataset.id);
        } else if (target.closest('.increase-qty')) {
          const btn = target.closest('.increase-qty');
          await updateQuantity(btn.dataset.id, 1);
        } else if (target.closest('.decrease-qty')) {
          const btn = target.closest('.decrease-qty');
          await updateQuantity(btn.dataset.id, -1);
        }
      } catch (error) {
        console.error('Action error:', error);
        showToast(error.message, 'error');
      }
    });

    cartTableBody.addEventListener('change', async (e) => {
      const input = e.target;
      if (input.classList.contains('quantity-input')) {
        try {
          const productId = input.dataset.id;
          const newQty = Math.max(1, parseInt(input.value) || 1);
          await updateQuantity(productId, newQty, true);
        } catch (error) {
          console.error('Quantity change error:', error);
          showToast('Failed to update quantity', 'error');
        }
      }
    });
  }

  async function updateQuantity(productId, change, isAbsolute = false) {
    const body = isAbsolute ? { quantity: change } : { quantity_change: change };

    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update quantity');
      }

      const updatedCart = await fetchCartData();
      renderCartTable(updatedCart.items, updatedCart.cartCount);
      showToast('Quantity updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
      showToast(error.message, 'error');
      try {
        const updatedCart = await fetchCartData();
        renderCartTable(updatedCart.items, updatedCart.cartCount);
      } catch (refreshError) {
        console.error('Failed to refresh cart after error:', refreshError);
      }
    }
  }

  async function removeItem(productId) {
    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to remove item');
      }

      const updatedCart = await fetchCartData();
      renderCartTable(updatedCart.items, updatedCart.cartCount);
      showToast('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      showToast(error.message, 'error');
    }
  }

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




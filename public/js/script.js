document.addEventListener('DOMContentLoaded', () => {
  const cartIcons    = document.querySelectorAll('.fa-shopping-cart');
  const clearCartBtn = document.getElementById('clear-cart');
  const cartList     = document.getElementById('cart-items-list');
  const subtotalEl   = document.getElementById('subtotal');
  const totalEl      = document.getElementById('total');

  updateCartUI();
  renderCartTable();
  renderCheckoutSummary();

  // ─── Add to cart ──────────────────────────────
  cartIcons.forEach(icon => {
    icon.addEventListener('click', async () => {
      const productEl = icon.closest('.featured__item');
      const name  = productEl.dataset.name;
      const price = parseFloat(productEl.dataset.price);

      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, quantity: 1 })
      });
      const json = await res.json();

      if (res.ok) {
        alert('Item has been added!');
      } else {
        alert(json.error || 'Could not add to cart');
      }

      await updateCartUI();
      await renderCartTable();
      await renderCheckoutSummary();
    });
  });

  // ─── Remove item ──────────────────────────────
  document.addEventListener('click', async e => {
    if (e.target.classList.contains('remove-btn')) {
      const name = e.target.dataset.name;
      const res = await fetch(`/api/cart/name/${encodeURIComponent(name)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (!res.ok) alert(json.error || 'Could not remove item');

      await updateCartUI();
      await renderCartTable();
      await renderCheckoutSummary();
    }
  });

  // ─── Clear cart ───────────────────────────────
  clearCartBtn?.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to clear the cart?')) return;
    const resAll = await fetch('/api/cart');
    const items = await resAll.json();

    await Promise.all(
      items.map(it => fetch(`/api/cart/name/${encodeURIComponent(it.product_name)}`, { method: 'DELETE' }))
    );

    alert('Cart has been cleared!');
    await updateCartUI();
    await renderCartTable();
    await renderCheckoutSummary();
  });

  // ─── Helpers ──────────────────────────────────

  async function fetchCart() {
    const res = await fetch('/api/cart');
    return res.ok ? await res.json() : [];
  }

  async function updateCartUI() {
    const cart = await fetchCart();
    let totalItems = 0, totalPrice = 0;

    cart.forEach(item => {
      totalItems += item.quantity;
      totalPrice += item.quantity * item.price;
    });

    document.querySelectorAll('.cart-count')
      .forEach(el => el.textContent = totalItems);

    document.querySelectorAll('.total-price')
      .forEach(el => el.textContent = 'Ksh ' + totalPrice.toFixed(2));
  }

  async function renderCartTable() {
    const cart = await fetchCart();
    const tableBody = document.getElementById('cart-table-body');
    const totalCostEl = document.querySelector('.total-cost');

    if (!tableBody) return;
    tableBody.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5">Your cart is empty.</td></tr>';
      totalCostEl && (totalCostEl.textContent = 'Total: Ksh 0.00');
      return;
    }

    cart.forEach(item => {
      const subtotal = item.quantity * item.price;
      total += subtotal;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.product_name}</td>
        <td>Ksh ${item.price.toFixed(2)}</td>
        <td>
          <button class="decrease-qty" data-name="${item.product_name}">–</button>
          <input type="number" class="quantity-input"
            data-name="${item.product_name}" value="${item.quantity}" min="1" />
          <button class="increase-qty" data-name="${item.product_name}">+</button>
        </td>
        <td>Ksh ${subtotal.toFixed(2)}</td>
        <td><button class="remove-btn" data-name="${item.product_name}">Remove</button></td>
      `;
      tableBody.appendChild(row);
    });

    if (totalCostEl) {
      totalCostEl.textContent = `Total: Ksh ${total.toFixed(2)}`;
    }

    tableBody.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', async () => {
        let newQty = parseInt(input.value) || 1;
        const name = input.dataset.name;
        const currentQty = parseInt(input.getAttribute('value'));

        await fetch('/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            quantity: newQty - currentQty
          })
        });

        await updateCartUI();
        await renderCartTable();
        await renderCheckoutSummary();
      });
    });

    tableBody.querySelectorAll('.increase-qty').forEach(btn => {
      btn.addEventListener('click', async () => {
        const name = btn.dataset.name;
        await fetch('/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, quantity: 1 })
        });
        await updateCartUI();
        await renderCartTable();
        await renderCheckoutSummary();
      });
    });

    tableBody.querySelectorAll('.decrease-qty').forEach(btn => {
      btn.addEventListener('click', async () => {
        const name = btn.dataset.name;
        await fetch('/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, quantity: -1 })
        });
        await updateCartUI();
        await renderCartTable();
        await renderCheckoutSummary();
      });
    });
  }

  async function renderCheckoutSummary() {
    const cart = await fetchCart();
    cartList.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
      const lineTotal = item.price * item.quantity;
      const li = document.createElement('li');
      li.textContent = `${item.product_name} — Ksh ${lineTotal.toFixed(2)}`;
      cartList.appendChild(li);
      subtotal += lineTotal;
    });

    subtotalEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
    totalEl.textContent    = `Ksh ${subtotal.toFixed(2)}`;
  }

  // Optional: place order
  document.querySelector('button[type="submit"]')?.addEventListener('click', e => {
    e.preventDefault();
    alert('Order placed!');
  });
});

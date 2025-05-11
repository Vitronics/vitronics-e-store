// document.addEventListener('DOMContentLoaded', () => {
//   const cartIcons    = document.querySelectorAll('.fa-shopping-cart');
//   const clearCartBtn = document.getElementById('clear-cart');
//   const cartList     = document.getElementById('cart-items-list');
//   const subtotalEl   = document.getElementById('subtotal');
//   const totalEl      = document.getElementById('total');

//   updateCartUI();
//   renderCartTable();
//   renderCheckoutSummary();

//   // ─── Add to cart ──────────────────────────────
//   cartIcons.forEach(icon => {
//     icon.addEventListener('click', async () => {
//       const productEl = icon.closest('.featured__item');
//       const name  = productEl.dataset.name;
//       const price = parseFloat(productEl.dataset.price);

//       const res = await fetch('/api/cart/add', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, price, quantity: 1 })
//       });
//       const json = await res.json();

//       if (res.ok) {
//         alert('Item has been added!');
//       } else {
//         alert(json.error || 'Could not add to cart');
//       }

//       await updateCartUI();
//       await renderCartTable();
//       await renderCheckoutSummary();
//     });
//   });

//   // ─── Remove item ──────────────────────────────
//   document.addEventListener('click', async e => {
//     if (e.target.classList.contains('remove-btn')) {
//       const name = e.target.dataset.name;
//       const res = await fetch(`/api/cart/name/${encodeURIComponent(name)}`, {
//         method: 'DELETE'
//       });
//       const json = await res.json();
//       if (!res.ok) alert(json.error || 'Could not remove item');

//       await updateCartUI();
//       await renderCartTable();
//       await renderCheckoutSummary();
//     }
//   });

//   // ─── Clear cart ───────────────────────────────
//  clearCartBtn?.addEventListener('click', async () => {
//   if (!confirm('Are you sure you want to clear the cart?')) return;
  
//   try {
//     const response = await fetch('/api/cart', { method: 'DELETE' });
    
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to clear cart');
//     }
    
//     alert('Cart has been cleared!');
//     await updateCartUI();
//     await renderCartTable();
//     await renderCheckoutSummary();
//   } catch (error) {
//     alert(error.message);
//   }
// });


//   // ─── Helpers ──────────────────────────────────

//   async function fetchCart() {
//     const res = await fetch('/api/cart');
//     return res.ok ? await res.json() : [];
//   }

//   async function updateCartUI() {
//     const cart = await fetchCart();
//     let totalItems = 0, totalPrice = 0;

//     cart.forEach(item => {
//       totalItems += item.quantity;
//       totalPrice += item.quantity * item.price;
//     });

//     document.querySelectorAll('.cart-count')
//       .forEach(el => el.textContent = totalItems);

//     document.querySelectorAll('.total-price')
//       .forEach(el => el.textContent = 'Ksh ' + totalPrice.toFixed(2));
//   }

//   async function renderCartTable() {
//     const cart = await fetchCart();
//     const tableBody = document.getElementById('cart-table-body');
//     const totalCostEl = document.querySelector('.total-cost');

//     if (!tableBody) return;
//     tableBody.innerHTML = '';
//     let total = 0;

//     if (cart.length === 0) {
//       tableBody.innerHTML = '<tr><td colspan="5">Your cart is empty.</td></tr>';
//       totalCostEl && (totalCostEl.textContent = 'Total: Ksh 0.00');
//       return;
//     }

//     cart.forEach(item => {
//       const subtotal = item.quantity * item.price;
//       total += subtotal;
//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td>${item.product_name}</td>
//         <td>Ksh ${item.price.toFixed(2)}</td>
//         <td>
//           <button class="decrease-qty" data-name="${item.product_name}">–</button>
//           <input type="number" class="quantity-input"
//             data-name="${item.product_name}" value="${item.quantity}" min="1" />
//           <button class="increase-qty" data-name="${item.product_name}">+</button>
//         </td>
//         <td>Ksh ${subtotal.toFixed(2)}</td>
//         <td><button class="remove-btn" data-name="${item.product_name}">Remove</button></td>
//       `;
//       tableBody.appendChild(row);
//     });

//     if (totalCostEl) {
//       totalCostEl.textContent = `Total: Ksh ${total.toFixed(2)}`;
//     }

//     tableBody.querySelectorAll('.quantity-input').forEach(input => {
//       input.addEventListener('change', async () => {
//         let newQty = parseInt(input.value) || 1;
//         const name = input.dataset.name;
//         const currentQty = parseInt(input.getAttribute('value'));

//         await fetch('/api/cart/add', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             name,
//             quantity: newQty - currentQty
//           })
//         });

//         await updateCartUI();
//         await renderCartTable();
//         await renderCheckoutSummary();
//       });
//     });

//     tableBody.querySelectorAll('.increase-qty').forEach(btn => {
//       btn.addEventListener('click', async () => {
//         const name = btn.dataset.name;
//         await fetch('/api/cart/add', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ name, quantity: 1 })
//         });
//         await updateCartUI();
//         await renderCartTable();
//         await renderCheckoutSummary();
//       });
//     });

//     tableBody.querySelectorAll('.decrease-qty').forEach(btn => {
//       btn.addEventListener('click', async () => {
//         const name = btn.dataset.name;
//         await fetch('/api/cart/add', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ name, quantity: -1 })
//         });
//         await updateCartUI();
//         await renderCartTable();
//         await renderCheckoutSummary();
//       });
//     });
//   }

//   async function renderCheckoutSummary() {
//     const cart = await fetchCart();
//     cartList.innerHTML = '';
//     let subtotal = 0;

//     cart.forEach(item => {
//       const lineTotal = item.price * item.quantity;
//       const li = document.createElement('li');
//       li.textContent = `${item.product_name} — Ksh ${lineTotal.toFixed(2)}`;
//       cartList.appendChild(li);
//       subtotal += lineTotal;
//     });

//     subtotalEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
//     totalEl.textContent    = `Ksh ${subtotal.toFixed(2)}`;
//   }

//   // Optional: place order
//   document.querySelector('button[type="submit"]')?.addEventListener('click', e => {
//     e.preventDefault();
//     alert('Order placed!');
//   });
// });

//code tw0  working manual cart refresh

document.addEventListener('DOMContentLoaded', () => {
  // Safely get DOM elements with null checks
  const cartIcons = document.querySelectorAll('.fa-shopping-cart');
  const clearCartBtn = document.getElementById('clear-cart');
  const cartList = document.getElementById('cart-items-list');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');
  const cartTableBody = document.getElementById('cart-table-body');
  const totalCostEl = document.querySelector('.total-cost');

  // Initialize UI only if elements exist
  if (cartTableBody) updateCartUI().then(renderCartTable);
  if (cartList) renderCheckoutSummary();

  // ─── Add to cart ──────────────────────────────
  cartIcons.forEach(icon => {
    icon.addEventListener('click', async () => {
      const productEl = icon.closest('.featured__item');
      if (!productEl) return;

      const name = productEl.dataset.name;
      const price = parseFloat(productEl.dataset.price);

      try {
        const res = await fetch('/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, price, quantity: 1 })
        });
        
        if (res.ok) {
          alert('Item has been added!');
          await safeUpdateUI();
        } else {
          const json = await res.json();
          alert(json.error || 'Could not add to cart');
        }
      } catch (error) {
        console.error('Add to cart error:', error);
        alert('Failed to add item to cart');
      }
    });
  });

  // ─── Remove item ──────────────────────────────
  document.addEventListener('click', async e => {
    if (e.target.classList.contains('remove-btn')) {
      const name = e.target.dataset.name;
      try {
        const res = await fetch(`/api/cart/name/${encodeURIComponent(name)}`, {
          method: 'DELETE'
        });
        
        if (!res.ok) {
          const json = await res.json();
          alert(json.error || 'Could not remove item');
        }
        
        await safeUpdateUI();
      } catch (error) {
        console.error('Remove item error:', error);
        alert('Failed to remove item');
      }
    }
  });

  // ─── Clear cart ───────────────────────────────
  clearCartBtn?.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to clear the cart?')) return;
    
    try {
      const response = await fetch('/api/cart', { method: 'DELETE' });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to clear cart');
      }
      
      alert('Cart has been cleared!');
      await safeUpdateUI();
    } catch (error) {
      console.error('Clear cart error:', error);
      alert(error.message);
    }
  });

  // ─── Helpers ──────────────────────────────────
  async function safeUpdateUI() {
    try {
      await updateCartUI();
      if (cartTableBody) await renderCartTable();
      if (cartList) await renderCheckoutSummary();
    } catch (error) {
      console.error('UI update error:', error);
    }
  }

  async function fetchCart() {
    try {
      const res = await fetch('/api/cart');
      return res.ok ? await res.json() : [];
    } catch (error) {
      console.error('Fetch cart error:', error);
      return [];
    }
  }

  async function updateCartUI() {
    try {
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
    } catch (error) {
      console.error('Update cart UI error:', error);
    }
  }

  async function renderCartTable() {
    if (!cartTableBody) return;
    
    try {
      const cart = await fetchCart();
      cartTableBody.innerHTML = '';
      
      if (cart.length === 0) {
        cartTableBody.innerHTML = '<tr><td colspan="5">Your cart is empty.</td></tr>';
        if (totalCostEl) totalCostEl.textContent = 'Total: Ksh 0.00';
        return;
      }

      let total = 0;
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
        cartTableBody.appendChild(row);
      });

      if (totalCostEl) {
        totalCostEl.textContent = `Total: Ksh ${total.toFixed(2)}`;
      }

      // Add event listeners to new elements
      addQuantityEventListeners();
    } catch (error) {
      console.error('Render cart table error:', error);
      cartTableBody.innerHTML = '<tr><td colspan="5">Error loading cart</td></tr>';
    }
  }

  function addQuantityEventListeners() {
    if (!cartTableBody) return;

    cartTableBody.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', async () => {
        let newQty = parseInt(input.value) || 1;
        const name = input.dataset.name;
        const currentQty = parseInt(input.getAttribute('value'));

        try {
          await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              quantity: newQty - currentQty
            })
          });
          await safeUpdateUI();
        } catch (error) {
          console.error('Quantity change error:', error);
        }
      });
    });

    cartTableBody.querySelectorAll('.increase-qty').forEach(btn => {
      btn.addEventListener('click', async () => {
        const name = btn.dataset.name;
        try {
          await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, quantity: 1 })
          });
          await safeUpdateUI();
        } catch (error) {
          console.error('Increase quantity error:', error);
        }
      });
    });

    cartTableBody.querySelectorAll('.decrease-qty').forEach(btn => {
      btn.addEventListener('click', async () => {
        const name = btn.dataset.name;
        try {
          await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, quantity: -1 })
          });
          await safeUpdateUI();
        } catch (error) {
          console.error('Decrease quantity error:', error);
        }
      });
    });
  }

  async function renderCheckoutSummary() {
    if (!cartList || !subtotalEl || !totalEl) return;
    
    try {
      const cart = await fetchCart();
      cartList.innerHTML = '';
      let subtotal = 0;

      if (cart.length === 0) {
        cartList.innerHTML = '<li>Your cart is empty</li>';
        subtotalEl.textContent = 'Ksh 0.00';
        totalEl.textContent = 'Ksh 0.00';
        return;
      }

      cart.forEach(item => {
        const lineTotal = item.price * item.quantity;
        const li = document.createElement('li');
        li.textContent = `${item.product_name} — Ksh ${lineTotal.toFixed(2)}`;
        cartList.appendChild(li);
        subtotal += lineTotal;
      });

      subtotalEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
      totalEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
    } catch (error) {
      console.error('Render checkout summary error:', error);
      cartList.innerHTML = '<li>Error loading cart</li>';
    }
  }

  // Optional: place order
  document.querySelector('button[type="submit"]')?.addEventListener('click', e => {
    e.preventDefault();
    alert('Order placed!');
  });
});



//another code


// document.addEventListener('DOMContentLoaded', () => {
//   // DOM Elements
//   const cartIcons = document.querySelectorAll('.fa-shopping-cart');
//   const clearCartBtn = document.getElementById('clear-cart');
//   const cartList = document.getElementById('cart-items-list');
//   const subtotalEl = document.getElementById('subtotal');
//   const totalEl = document.getElementById('total');
//   const cartTableBody = document.getElementById('cart-table-body');
//   const totalCostEl = document.querySelector('.total-cost');

//   // Initialize UI
//   initializeCartUI();

//   // ─── Event Listeners ──────────────────────────
//   cartIcons.forEach(icon => {
//     icon.addEventListener('click', handleAddToCart);
//   });

//   document.addEventListener('click', handleCartActions);
//   clearCartBtn?.addEventListener('click', handleClearCart);
//   document.querySelector('button[type="submit"]')?.addEventListener('click', handlePlaceOrder);

//   // ─── Initialization ──────────────────────────
//   async function initializeCartUI() {
//     try {
//       const { items, cartCount } = await fetchCartWithCount();
//       updateCartCount(cartCount);
//       if (cartTableBody) renderCartTable(items);
//       if (cartList) renderCheckoutSummary(items);
//     } catch (error) {
//       console.error('Initialization error:', error);
//     }
//   }

//   // ─── Cart Operations ─────────────────────────
//   async function handleAddToCart(e) {
//     const productEl = e.target.closest('.featured__item');
//     if (!productEl) return;

//     const product_id = productEl.dataset.id;
//     const name = productEl.dataset.name;
//     const price = parseFloat(productEl.dataset.price);

//     try {
//       const response = await fetch('/api/cart/add', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ product_id, name, price, quantity: 1 })
//       });

//       if (response.ok) {
//         const { cartCount } = await response.json();
//         updateCartCount(cartCount);
//         showToast('Item added to cart!');
//         await safeUpdateUI();
//       } else {
//         const error = await response.json();
//         showToast(error.error || 'Could not add to cart', 'error');
//       }
//     } catch (error) {
//       console.error('Add to cart error:', error);
//       showToast('Failed to add item to cart', 'error');
//     }
//   }

//   async function handleCartActions(e) {
//     if (e.target.classList.contains('remove-btn')) {
//       await handleRemoveItem(e);
//     } else if (e.target.classList.contains('increase-qty')) {
//       await handleQuantityChange(e.target, 1);
//     } else if (e.target.classList.contains('decrease-qty')) {
//       await handleQuantityChange(e.target, -1);
//     } else if (e.target.classList.contains('quantity-input')) {
//       await handleManualQuantityChange(e.target);
//     }
//   }

//   async function handleRemoveItem(e) {
//     const product_id = e.target.dataset.id;
//     try {
//       const response = await fetch(`/api/cart/${product_id}`, {
//         method: 'DELETE'
//       });

//       if (response.ok) {
//         const { cartCount } = await response.json();
//         updateCartCount(cartCount);
//         showToast('Item removed from cart');
//         await safeUpdateUI();
//       } else {
//         const error = await response.json();
//         showToast(error.error || 'Could not remove item', 'error');
//       }
//     } catch (error) {
//       console.error('Remove item error:', error);
//       showToast('Failed to remove item', 'error');
//     }
//   }

//   async function handleClearCart() {
//     if (!confirm('Are you sure you want to clear the cart?')) return;
    
//     try {
//       const response = await fetch('/api/cart', { method: 'DELETE' });
      
//       if (response.ok) {
//         const { cartCount } = await response.json();
//         updateCartCount(cartCount);
//         showToast('Cart cleared successfully');
//         await safeUpdateUI();
//       } else {
//         const error = await response.json();
//         throw new Error(error.error || 'Failed to clear cart');
//       }
//     } catch (error) {
//       console.error('Clear cart error:', error);
//       showToast(error.message, 'error');
//     }
//   }

//   async function handleQuantityChange(button, change) {
//     const product_id = button.dataset.id;
//     try {
//       const response = await fetch('/api/cart/add', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           product_id, 
//           quantity: change 
//         })
//       });

//       if (response.ok) {
//         const { cartCount } = await response.json();
//         updateCartCount(cartCount);
//         await safeUpdateUI();
//       } else {
//         const error = await response.json();
//         showToast(error.error || 'Could not update quantity', 'error');
//       }
//     } catch (error) {
//       console.error('Quantity change error:', error);
//       showToast('Failed to update quantity', 'error');
//     }
//   }

//   async function handleManualQuantityChange(input) {
//     const newQty = parseInt(input.value) || 1;
//     const product_id = input.dataset.id;
//     const currentQty = parseInt(input.getAttribute('value'));

//     try {
//       const response = await fetch('/api/cart/add', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           product_id,
//           quantity: newQty - currentQty
//         })
//       });

//       if (response.ok) {
//         const { cartCount } = await response.json();
//         updateCartCount(cartCount);
//         await safeUpdateUI();
//       } else {
//         const error = await response.json();
//         showToast(error.error || 'Could not update quantity', 'error');
//       }
//     } catch (error) {
//       console.error('Manual quantity change error:', error);
//       showToast('Failed to update quantity', 'error');
//     }
//   }

//   function handlePlaceOrder(e) {
//     e.preventDefault();
//     showToast('Order placed successfully!');
//     // Add actual order processing logic here
//   }

//   // ─── UI Helpers ──────────────────────────────
//   async function safeUpdateUI() {
//     try {
//       const { items, cartCount } = await fetchCartWithCount();
//       updateCartCount(cartCount);
//       if (cartTableBody) renderCartTable(items);
//       if (cartList) renderCheckoutSummary(items);
//     } catch (error) {
//       console.error('UI update error:', error);
//     }
//   }

//   async function fetchCartWithCount() {
//     try {
//       const response = await fetch('/api/cart');
//       if (!response.ok) throw new Error('Failed to fetch cart');
//       return await response.json();
//     } catch (error) {
//       console.error('Fetch cart error:', error);
//       return { items: [], cartCount: 0 };
//     }
//   }




  
//             const cartCountEl = document.querySelector('.cart-count');
//             const totalPriceEl = document.querySelector('.total-price');

//             // Initialize cart
//             fetchCartItems();

//             // Clear cart button
//             clearCartBtn?.addEventListener('click', async () => {
//                 if (!confirm('Are you sure you want to clear the cart?')) return;
                
//                 try {
//                     const response = await fetch('/api/cart', { method: 'DELETE' });
                    
//                     if (response.ok) {
//                         const { cartCount } = await response.json();
//                         updateCartUI([], cartCount);
//                         showToast('Cart cleared successfully');
//                     } else {
//                         const error = await response.json();
//                         throw new Error(error.error || 'Failed to clear cart');
//                     }
//                 } catch (error) {
//                     console.error('Clear cart error:', error);
//                     showToast(error.message, 'error');
//                 }
//             });

//             // Handle quantity changes and remove buttons
//             document.addEventListener('click', async (e) => {
//                 if (e.target.classList.contains('remove-btn')) {
//                     await handleRemoveItem(e.target.dataset.id);
//                 } else if (e.target.classList.contains('increase-qty')) {
//                     await handleQuantityChange(e.target.dataset.id, 1);
//                 } else if (e.target.classList.contains('decrease-qty')) {
//                     await handleQuantityChange(e.target.dataset.id, -1);
//                 } else if (e.target.classList.contains('quantity-input')) {
//                     await handleManualQuantityChange(e.target);
//                 }
//             });

//             // Fetch cart items from server
//             async function fetchCartItems() {
//                 try {
//                     const response = await fetch('/api/cart');
//                     if (!response.ok) throw new Error('Failed to fetch cart');
//                     const { items, cartCount } = await response.json();
//                     updateCartUI(items, cartCount);
//                 } catch (error) {
//                     console.error('Fetch cart error:', error);
//                     showToast('Failed to load cart', 'error');
//                 }
//             }

//   function updateCartCount(count) {
//     document.querySelectorAll('.cart-count').forEach(el => {
//       el.textContent = count;
//       el.classList.add('pulse');
//       setTimeout(() => el.classList.remove('pulse'), 300);
//     });
//   }

//   function renderCartTable(items) {
//     cartTableBody.innerHTML = '';
    
//     if (items.length === 0) {
//       cartTableBody.innerHTML = '<tr><td colspan="5">Your cart is empty.</td></tr>';
//       if (totalCostEl) totalCostEl.textContent = 'Total: Ksh 0.00';
//       return;
//     }

//     let total = 0;
//     items.forEach(item => {
//       const subtotal = item.quantity * item.price;
//       total += subtotal;
//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td>${item.product_name}</td>
//         <td>Ksh ${item.price.toFixed(2)}</td>
//         <td>
//           <button class="decrease-qty" data-id="${item.product_id}">–</button>
//           <input type="number" class="quantity-input"
//             data-id="${item.product_id}" value="${item.quantity}" min="1" />
//           <button class="increase-qty" data-id="${item.product_id}">+</button>
//         </td>
//         <td>Ksh ${subtotal.toFixed(2)}</td>
//         <td><button class="remove-btn" data-id="${item.product_id}">Remove</button></td>
//       `;
//       cartTableBody.appendChild(row);
//     });

//     if (totalCostEl) {
//       totalCostEl.textContent = `Total: Ksh ${total.toFixed(2)}`;
//     }
//   }

//   function renderCheckoutSummary(items) {
//     cartList.innerHTML = '';
//     let subtotal = 0;

//     if (items.length === 0) {
//       cartList.innerHTML = '<li>Your cart is empty</li>';
//       subtotalEl.textContent = 'Ksh 0.00';
//       totalEl.textContent = 'Ksh 0.00';
//       return;
//     }

//     items.forEach(item => {
//       const lineTotal = item.price * item.quantity;
//       const li = document.createElement('li');
//       li.textContent = `${item.product_name} — Ksh ${lineTotal.toFixed(2)}`;
//       cartList.appendChild(li);
//       subtotal += lineTotal;
//     });

//     subtotalEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
//     totalEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
//   }

//   function showToast(message, type = 'success') {
//     const toast = document.createElement('div');
//     toast.className = `toast ${type}`;
//     toast.textContent = message;
//     document.body.appendChild(toast);
    
//     setTimeout(() => {
//       toast.classList.add('show');
//       setTimeout(() => {
//         toast.classList.remove('show');
//         setTimeout(() => toast.remove(), 300);
//       }, 2000);
//     }, 100);
//   }

//   // Add CSS for animations
//   const style = document.createElement('style');
//   style.textContent = `
//     .pulse {
//       animation: pulse 0.3s ease;
//       transform: scale(1.2);
//     }
//     @keyframes pulse {
//       0% { transform: scale(1); }
//       50% { transform: scale(1.5); }
//       100% { transform: scale(1.2); }
//     }
//     .toast {
//       position: fixed;
//       bottom: 20px;
//       left: 50%;
//       transform: translateX(-50%);
//       background: #4CAF50;
//       color: white;
//       padding: 12px 24px;
//       border-radius: 4px;
//       opacity: 0;
//       transition: opacity 0.3s;
//       z-index: 1000;
//     }
//     .toast.error {
//       background: #f44336;
//     }
//     .toast.show {
//       opacity: 1;
//     }
//   `;
//   document.head.appendChild(style);
// });
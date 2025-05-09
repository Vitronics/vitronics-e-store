//   document.addEventListener('DOMContentLoaded', function () {
//   const cartIcons = document.querySelectorAll('.fa-shopping-cart');
//   const clearCartBtn = document.getElementById('clear-cart');
//   const cartList = document.getElementById('cart-items-list');
//   const subtotalEl = document.getElementById('subtotal');
//   const totalEl = document.getElementById('total');

//   updateCartUI();
//   renderCartTable();
//   renderCheckoutSummary();

//   // Add to cart
//   cartIcons.forEach(icon => {
//     icon.addEventListener('click', function (e) {
//       // e.preventDefault();
//       const product = this.closest('.featured__item');
//       const name = product.getAttribute('data-name');
//       const price = parseFloat(product.getAttribute('data-price'));

//       let cart = JSON.parse(localStorage.getItem('cart')) || [];

//       const existingItem = cart.find(item => item.name === name);
//       if (existingItem) {
//         existingItem.quantity += 1;
//       } else {
//         cart.push({ name, price, quantity: 1 });
//       }

//       localStorage.setItem('cart', JSON.stringify(cart));
//       updateCartUI();
//       renderCartTable();
//       renderCheckoutSummary();
//       alert('Item has been added!');
//     });
//   });

//   // Remove from cart
//   document.addEventListener('click', function (e) {
//     if (e.target.classList.contains('remove-btn')) {
//       const nameToRemove = e.target.getAttribute('data-name');
//       let cart = JSON.parse(localStorage.getItem('cart')) || [];
//       cart = cart.filter(item => item.name !== nameToRemove);
//       localStorage.setItem('cart', JSON.stringify(cart));
//       updateCartUI();
//       renderCartTable();
//       renderCheckoutSummary();
//     }
//   });

//   // Clear cart
//   if (clearCartBtn) {
//     clearCartBtn.addEventListener('click', function () {
//       if (confirm("Are you sure you want to clear the cart?")) {
//         localStorage.removeItem('cart');
//         updateCartUI();
//         renderCartTable();
//         renderCheckoutSummary();
//         alert('Cart has been cleared!');
//       }
//     });
//   }

//   function updateCartUI() {
//     const cart = JSON.parse(localStorage.getItem('cart')) || [];
//     let totalItems = 0;
//     let totalPrice = 0;

//     cart.forEach(item => {
//       totalItems += item.quantity;
//       totalPrice += item.quantity * item.price;
//     });

//     const countEls = document.querySelectorAll('.cart-count');
//     const priceEls = document.querySelectorAll('.total-price');

//     countEls.forEach(el => el.textContent = totalItems);
//     priceEls.forEach(el => el.textContent = 'Ksh ' + totalPrice.toFixed(2));
//   }

//   function renderCartTable() {
//     const cart = JSON.parse(localStorage.getItem('cart')) || [];
//     const tableBody = document.getElementById('cart-table-body');
//     const totalCostEl = document.querySelectorAll('.total-cost');

//     if (!tableBody || !totalCostEl) return;

//     tableBody.innerHTML = '';
//     let total = 0;

//     if (cart.length === 0) {
//       tableBody.innerHTML = '<tr><td colspan="5">Your cart is empty.</td></tr>';
//       totalCostEl.textContent = 'Total: Ksh 0.00';
//       return;
//     }

//     cart.forEach(item => {
//       const subtotal = item.quantity * item.price;
//       total += subtotal;

//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td>${item.name}</td>
//         <td>Ksh ${item.price.toFixed(2)}</td>
//         <td>
//           <div class="quantity-wrapper" style="display: flex; align-items: center;">
//             <button class="decrease-qty" data-name="${item.name}" style="padding: 2px 6px; border:none;">–</button>
//             <input type="number" class="quantity-input" data-name="${item.name}" value="${item.quantity}" min="1" style="width: 60px; margin: 0 5px; " />
//             <button class="increase-qty" data-name="${item.name}" style="padding: 2px 6px; border:none;">+</button>
//           </div>
//         </td>
//         <td>Ksh ${subtotal.toFixed(2)}</td>
//         <td><button class="remove-btn" data-name="${item.name}">Remove</button></td>
//       `;
//       tableBody.appendChild(row);
//     });

//     totalCostEl.textContent = `Total: Ksh ${total.toFixed(2)}`;

//     // Quantity input change
//     const qtyInputs = tableBody.querySelectorAll('.quantity-input');
//     qtyInputs.forEach(input => {
//       input.addEventListener('change', function () {
//         const name = this.getAttribute('data-name');
//         let newQty = parseInt(this.value);
//         if (isNaN(newQty) || newQty < 1) newQty = 1;

//         let cart = JSON.parse(localStorage.getItem('cart')) || [];
//         const item = cart.find(i => i.name === name);
//         if (item) {
//           item.quantity = newQty;
//           localStorage.setItem('cart', JSON.stringify(cart));
//           updateCartUI();
//           renderCartTable();
//           renderCheckoutSummary();
//         }
//       });
//     });

//     // Increase quantity
//     const increaseBtns = tableBody.querySelectorAll('.increase-qty');
//     increaseBtns.forEach(btn => {
//       btn.addEventListener('click', function () {
//         const name = this.getAttribute('data-name');
//         let cart = JSON.parse(localStorage.getItem('cart')) || [];
//         const item = cart.find(i => i.name === name);
//         if (item) {
//           item.quantity += 1;
//           localStorage.setItem('cart', JSON.stringify(cart));
//           updateCartUI();
//           renderCartTable();
//           renderCheckoutSummary();
//         }
//       });
//     });

//     // Decrease quantity
//     const decreaseBtns = tableBody.querySelectorAll('.decrease-qty');
//     decreaseBtns.forEach(btn => {
//       btn.addEventListener('click', function () {
//         const name = this.getAttribute('data-name');
//         let cart = JSON.parse(localStorage.getItem('cart')) || [];
//         const item = cart.find(i => i.name === name);
//         if (item && item.quantity > 1) {
//           item.quantity -= 1;
//           localStorage.setItem('cart', JSON.stringify(cart));
//           updateCartUI();
//           renderCartTable();
//           renderCheckoutSummary();
//         }
//       });
//     });
//   }

//   function renderCheckoutSummary() {
//     const cart = JSON.parse(localStorage.getItem('cart')) || [];
//     if (!cartList || !subtotalEl || !totalEl) return;

//     cartList.innerHTML = '';
//     let subtotal = 0;

//     cart.forEach(item => {
//       const itemTotal = item.price * item.quantity;
//       const li = document.createElement('li');
//       li.textContent = `${item.name} `;
//       const span = document.createElement('span');
//       span.textContent = `Ksh ${itemTotal.toFixed(2)}`;
//       li.appendChild(span);
//       cartList.appendChild(li);
//       subtotal += itemTotal;
//     });

//     subtotalEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
//     totalEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
//   }

//   const placeOrderBtn = document.querySelector('button[type="submit"]');
//   if (placeOrderBtn) {
//     placeOrderBtn.addEventListener('click', function (e) {
//       e.preventDefault();

//       const cart = JSON.parse(localStorage.getItem('cart')) || [];
//       if (cart.length === 0) {
//         alert("Your cart is empty!");
//         return;
//       }

//       const paymentCheck = document.getElementById('payment-check')?.checked;
//       const paypal = document.getElementById('paypal')?.checked;

//       if (!paymentCheck && !paypal) {
//         alert("Please select a payment method.");
//         return;
//       }

//       alert("Your order has been placed successfully!");

//       localStorage.removeItem('cart');
//       updateCartUI();
//       renderCartTable();
//       renderCheckoutSummary();
//     });
//   }
// });


// document.addEventListener('DOMContentLoaded', function () {
//   // DOM Elements
//   const cartIcons = document.querySelectorAll('.fa-shopping-cart');
//   const clearCartBtn = document.getElementById('clear-cart');
//   const cartList = document.getElementById('cart-items-list');
//   const subtotalEl = document.getElementById('subtotal');
//   const totalEl = document.getElementById('total');
//   const placeOrderBtn = document.querySelector('button[type="submit"]');
  
//   // Cart state management
//   const CartManager = {
//     getCart: () => JSON.parse(localStorage.getItem('cart')) || [],
    
//     saveCart: (cart) => localStorage.setItem('cart', JSON.stringify(cart)),
    
//     addItem: (name, price) => {
//       const cart = CartManager.getCart();
//       const existingItem = cart.find(item => item.name === name);
      
//       if (existingItem) {
//         existingItem.quantity += 1;
//       } else {
//         cart.push({ name, price, quantity: 1 });
//       }
      
//       CartManager.saveCart(cart);
//       return cart;
//     },
    
//     removeItem: (name) => {
//       const cart = CartManager.getCart().filter(item => item.name !== name);
//       CartManager.saveCart(cart);
//       return cart;
//     },
    
//     updateQuantity: (name, quantity) => {
//       const cart = CartManager.getCart();
//       const item = cart.find(i => i.name === name);
      
//       if (item) {
//         item.quantity = Math.max(1, quantity);
//         CartManager.saveCart(cart);
//       }
      
//       return cart;
//     },
    
//     clearCart: () => {
//       localStorage.removeItem('cart');
//       return [];
//     },
    
//     calculateTotals: (cart) => {
//       return cart.reduce((acc, item) => {
//         acc.totalItems += item.quantity;
//         acc.subtotal += item.quantity * item.price;
//         return acc;
//       }, { totalItems: 0, subtotal: 0 });
//     }
//   };

//   // UI Updaters
//   const UIUpdater = {
//     updateCartCounters: () => {
//       const cart = CartManager.getCart();
//       const { totalItems, subtotal } = CartManager.calculateTotals(cart);
      
//       document.querySelectorAll('.cart-count').forEach(el => {
//         el.textContent = totalItems;
//       });
      
//       document.querySelectorAll('.total-price').forEach(el => {
//         el.textContent = `Ksh ${subtotal.toFixed(2)}`;
//       });
//     },
    
//     renderCartTable: () => {
//       const cart = CartManager.getCart();
//       const tableBody = document.getElementById('cart-table-body');
//       if (!tableBody) return;
      
//       tableBody.innerHTML = '';
      
//       if (cart.length === 0) {
//         tableBody.innerHTML = '<tr><td colspan="5">Your cart is empty.</td></tr>';
//         return;
//       }
      
//       cart.forEach(item => {
//         const subtotal = item.quantity * item.price;
//         const row = document.createElement('tr');
        
//         row.innerHTML = `
//           <td>${item.name}</td>
//           <td>Ksh ${item.price.toFixed(2)}</td>
//           <td>
//             <div class="quantity-wrapper">
//               <button class="decrease-qty" data-name="${item.name}">–</button>
//               <input type="number" class="quantity-input" 
//                      data-name="${item.name}" 
//                      value="${item.quantity}" 
//                      min="1" />
//               <button class="increase-qty" data-name="${item.name}">+</button>
//             </div>
//           </td>
//           <td>Ksh ${subtotal.toFixed(2)}</td>
//           <td><button class="remove-btn" data-name="${item.name}">Remove</button></td>
//         `;
        
//         tableBody.appendChild(row);
//       });
//     },
    
//     renderCheckoutSummary: () => {
//       const cart = CartManager.getCart();
//       const { subtotal } = CartManager.calculateTotals(cart);
      
//       if (!cartList || !subtotalEl || !totalEl) return;
      
//       cartList.innerHTML = '';
//       cart.forEach(item => {
//         const li = document.createElement('li');
//         li.textContent = `${item.name} `;
//         const span = document.createElement('span');
//         span.textContent = `Ksh ${(item.price * item.quantity).toFixed(2)}`;
//         li.appendChild(span);
//         cartList.appendChild(li);
//       });
      
//       subtotalEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
//       totalEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
//     },
    
//     showToast: (message, duration = 3000) => {
//       const toast = document.createElement('div');
//       toast.className = 'toast-notification';
//       toast.textContent = message;
//       document.body.appendChild(toast);
      
//       setTimeout(() => {
//         toast.classList.add('fade-out');
//         setTimeout(() => toast.remove(), 500);
//       }, duration);
//     }
//   };

//   // Event Delegation for Dynamic Elements
//   document.addEventListener('click', function(e) {
//     const cart = CartManager.getCart();
    
//     // Add to cart
//     if (e.target.classList.contains('fa-shopping-cart')) {
//       e.preventDefault();
//       const product = e.target.closest('.featured__item');
//       const name = product.getAttribute('data-name');
//       const price = parseFloat(product.getAttribute('data-price'));
      
//       CartManager.addItem(name, price);
//       UIUpdater.updateCartCounters();
//       UIUpdater.renderCartTable();
//       UIUpdater.renderCheckoutSummary();
//       UIUpdater.showToast('Item added to cart!');
//     }
    
//     // Remove item
//     else if (e.target.classList.contains('remove-btn')) {
//       const name = e.target.getAttribute('data-name');
//       CartManager.removeItem(name);
//       UIUpdater.updateCartCounters();
//       UIUpdater.renderCartTable();
//       UIUpdater.renderCheckoutSummary();
//       UIUpdater.showToast('Item removed from cart');
//     }
    
//     // Increase quantity
//     else if (e.target.classList.contains('increase-qty')) {
//       const name = e.target.getAttribute('data-name');
//       const item = cart.find(i => i.name === name);
//       if (item) {
//         CartManager.updateQuantity(name, item.quantity + 1);
//         UIUpdater.updateCartCounters();
//         UIUpdater.renderCartTable();
//         UIUpdater.renderCheckoutSummary();
//       }
//     }
    
//     // Decrease quantity
//     else if (e.target.classList.contains('decrease-qty')) {
//       const name = e.target.getAttribute('data-name');
//       const item = cart.find(i => i.name === name);
//       if (item && item.quantity > 1) {
//         CartManager.updateQuantity(name, item.quantity - 1);
//         UIUpdater.updateCartCounters();
//         UIUpdater.renderCartTable();
//         UIUpdater.renderCheckoutSummary();
//       }
//     }
    
//     // Clear cart
//     else if (e.target === clearCartBtn) {
//       if (confirm("Are you sure you want to clear your cart?")) {
//         CartManager.clearCart();
//         UIUpdater.updateCartCounters();
//         UIUpdater.renderCartTable();
//         UIUpdater.renderCheckoutSummary();
//         UIUpdater.showToast('Cart cleared');
//       }
//     }
//   });

//   // Quantity input changes
//   document.addEventListener('change', function(e) {
//     if (e.target.classList.contains('quantity-input')) {
//       const name = e.target.getAttribute('data-name');
//       const quantity = parseInt(e.target.value) || 1;
      
//       CartManager.updateQuantity(name, quantity);
//       UIUpdater.updateCartCounters();
//       UIUpdater.renderCartTable();
//       UIUpdater.renderCheckoutSummary();
//     }
//   });

//   // Place order
//   if (placeOrderBtn) {
//     placeOrderBtn.addEventListener('click', function(e) {
//       e.preventDefault();
//       const cart = CartManager.getCart();
      
//       if (cart.length === 0) {
//         UIUpdater.showToast('Your cart is empty!', 2000);
//         return;
//       }
      
//       const paymentMethod = document.querySelector('input[name="payment"]:checked');
//       if (!paymentMethod) {
//         UIUpdater.showToast('Please select a payment method', 2000);
//         return;
//       }
      
//       // Here you would typically send the order to your backend
//       console.log('Order placed:', { 
//         items: cart, 
//         paymentMethod: paymentMethod.value,
//         total: CartManager.calculateTotals(cart).subtotal
//       });
      
//       CartManager.clearCart();
//       UIUpdater.updateCartCounters();
//       UIUpdater.renderCartTable();
//       UIUpdater.renderCheckoutSummary();
//       UIUpdater.showToast('Order placed successfully!');
//     });
//   }

//   // Initialize UI
//   UIUpdater.updateCartCounters();
//   UIUpdater.renderCartTable();
//   UIUpdater.renderCheckoutSummary();
// });



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
    icon.addEventListener('click', async function (e) {
      const product = this.closest('.featured__item');
      const productId = product.getAttribute('data-id');
      const name = product.getAttribute('data-name');
      const price = parseFloat(product.getAttribute('data-price'));

      try {
        const response = await fetch('/api/cart/' + productId, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
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

    const total = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    cart.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>Ksh ${item.price.toFixed(2)}</td>
        <td>
          <div class="quantity-wrapper">
            <button class="decrease-qty" data-id="${item.id}">–</button>
            <input type="number" class="quantity-input" data-id="${item.id}" 
                   value="${item.quantity}" min="1" />
            <button class="increase-qty" data-id="${item.id}">+</button>
          </div>
        </td>
        <td>Ksh ${(item.quantity * item.price).toFixed(2)}</td>
        <td><button class="remove-btn" data-id="${item.id}">Remove</button></td>
      `;
      tableBody.appendChild(row);
    });

    // Event delegation for dynamic buttons
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

    // Handle direct input changes
    tableBody.addEventListener('change', async (e) => {
      if (e.target.classList.contains('quantity-input')) {
        const itemId = e.target.getAttribute('data-id');
        const newQty = Math.max(1, parseInt(e.target.value) || 1);
        await updateCartItem(itemId, newQty);
      }
    });
  }

  // Update cart item quantity
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

  // Render checkout summary
  function renderCheckoutSummary(cart) {
    if (!cartList || !subtotalEl || !totalEl) return;

    cartList.innerHTML = '';
    const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    cart.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name} `;
      const span = document.createElement('span');
      span.textContent = `Ksh ${(item.quantity * item.price).toFixed(2)}`;
      li.appendChild(span);
      cartList.appendChild(li);
    });

    subtotalEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
    totalEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
  }

  // Clear cart
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

  // Place order
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

        // Create order
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

  // Toast notification
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
// document.addEventListener('DOMContentLoaded', async function() {
//   const cartTableBody = document.getElementById('cart-table-body');
//   const cartCountEl = document.querySelectorAll('.cart-count');
//   const totalPriceEl = document.querySelectorAll('.total-price');

//   try {
//     // Load initial cart data
//     const cartData = await fetchCartData();
//     renderCartTable(cartData.items, cartData.cartCount);
    
//     // Set up event listeners
//     setupCartEventListeners();
//   } catch (error) {
//     console.error('Initial cart load failed:', error);
//     renderCartTable([], 0); // Show empty cart
//     showToast('Failed to load cart. Please refresh the page.', 'error');
//   }

//   async function fetchCartData() {
//     try {
//       const response = await fetch('/api/cart');
    
//       if (!response.ok) {
        
//         let errorMsg = `HTTP error! status: ${response.status}`;
//         try {
//           const errorData = await response.json();
//           errorMsg = errorData.error || errorData.message || errorMsg;
//         } catch (e) {
         
//           const text = await response.text();
//           if (text) errorMsg = text;
//         }
//         throw new Error(errorMsg);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//       throw error;
//     }
//   }

//   function renderCartTable(items, cartCount) {
//     // Clear existing rows
//     cartTableBody.innerHTML = '';
    
//     // Update cart count
//     if (cartCountEl) cartCountEl.textContent = cartCount || 0;
    
//     // Calculate total price
//     let totalPrice = 0;

//     if (!items || items.length === 0) {
//       cartTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Your cart is empty</td></tr>';
//       if (totalPriceEl) totalPriceEl.textContent = 'Ksh 0.00';
//       return;
//     }

//     // Add each item to the table
//     items.forEach(item => {
//       const subtotal = item.quantity * parseFloat(item.price);
//       totalPrice += subtotal;
      
//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td class="align-middle">
//           <img src="${item.product_image}" alt="${item.product_name}" width="50" class="mr-2">
//           ${item.product_name}
//         </td>
//         <td class="align-middle">Ksh ${parseFloat(item.price).toFixed(2)}</td>
//         <td class="align-middle">
//           <div class="d-flex align-items-center">
//             <button class="btn btn-sm btn-outline-secondary decrease-qty" data-id="${item.product_id}">-</button>
//             <input type="number" class="form-control form-control-sm quantity-input mx-2" 
//                    data-id="${item.product_id}" 
//                    value="${item.quantity}" min="1" style="width: 60px;">
//             <button class="btn btn-sm btn-outline-secondary increase-qty" data-id="${item.product_id}">+</button>
//           </div>
//         </td>
//         <td class="align-middle">Ksh ${subtotal.toFixed(2)}</td>
//         <td class="align-middle">
//           <button class="btn btn-sm btn-outline-danger remove-btn" data-id="${item.product_id}">
//             <i class="fa fa-trash"></i>
//           </button>
//         </td>
//       `;
//       cartTableBody.appendChild(row);
//     });

//     // Update total price
//     if (totalPriceEl) totalPriceEl.textContent = `Ksh ${totalPrice.toFixed(2)}`;
//   }

//   function setupCartEventListeners() {
//     // Event delegation for cart actions
//     document.addEventListener('click', async (e) => {
//       try {
//         if (e.target.closest('.remove-btn')) {
//           const btn = e.target.closest('.remove-btn');
//           await removeItem(btn.dataset.id);
//         } else if (e.target.closest('.increase-qty')) {
//           const btn = e.target.closest('.increase-qty');
//           await updateQuantity(btn.dataset.id, 1);
//         } else if (e.target.closest('.decrease-qty')) {
//           const btn = e.target.closest('.decrease-qty');
//           await updateQuantity(btn.dataset.id, -1);
//         }
//       } catch (error) {
//         console.error('Action error:', error);
//         showToast(error.message, 'error');
//       }
//     });

//     // Handle quantity input changes
//     cartTableBody.addEventListener('change', async (e) => {
//       if (e.target.classList.contains('quantity-input')) {
//         try {
//           const input = e.target;
//           const productId = input.dataset.id;
//           const newQty = parseInt(input.value) || 1;
//           await updateQuantity(productId, newQty, true);
//         } catch (error) {
//           console.error('Quantity change error:', error);
//           showToast('Failed to update quantity', 'error');
//         }
//       }
//     });
//   }

//   // Update item quantity
//   async function updateQuantity(productId, change, isAbsolute = false) {
//     try {
//       const body = isAbsolute 
//         ? { quantity: change } 
//         : { quantity_change: change };
      
//       const response = await fetch(`/api/cart/${productId}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body)
//       });
      
//       if (!response.ok) throw new Error('Failed to update quantity');
      
//       await fetchCartData();
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       showToast(error.message, 'error');
//     }
//   }

//   // Toast notification
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

//   // Add CSS for toast if not exists
//   if (!document.getElementById('toast-styles')) {
//     const style = document.createElement('style');
//     style.id = 'toast-styles';
//     style.textContent = `
//       .toast {
//         position: fixed;
//         bottom: 20px;
//         left: 50%;
//         transform: translateX(-50%);
//         background: #4CAF50;
//         color: white;
//         padding: 12px 24px;
//         border-radius: 4px;
//         opacity: 0;
//         transition: opacity 0.3s;
//         z-index: 1000;
//       }
//       .toast.error {
//         background: #f44336;
//       }
//       .toast.show {
//         opacity: 1;
//       }
//     `;
//     document.head.appendChild(style);
//   }
// });




// document.addEventListener('DOMContentLoaded', async function () {
//   const cartTableBody = document.getElementById('cart-table-body');

//   try {
//     const cartData = await fetchCartData();
//     renderCartTable(cartData.items, cartData.cartCount);
//     setupCartEventListeners();
//   } catch (error) {
//     console.error('Initial cart load failed:', error);
//     renderCartTable([], 0);
//     showToast('Failed to load cart. Please refresh the page.', 'error');
//   }

//   async function fetchCartData() {
//     try {
//       const response = await fetch('/api/cart');

//       if (!response.ok) {
//         let errorMsg = `HTTP error! status: ${response.status}`;
//         try {
//           const errorData = await response.json();
//           errorMsg = errorData.error || errorData.message || errorMsg;
//         } catch (e) {
//           const text = await response.text();
//           if (text) errorMsg = text;
//         }
//         throw new Error(errorMsg);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//       throw error;
//     }
//   }

//   function renderCartTable(items, cartCount) {
//     cartTableBody.innerHTML = '';

//     // Update ALL cart count elements
//     document.querySelectorAll('.cart-count').forEach(el => {
//       el.textContent = cartCount || 0;
//     });

//     let totalPrice = 0;

//     if (!items || items.length === 0) {
//       cartTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Your cart is empty</td></tr>';
//       // Update ALL total price elements
//       document.querySelectorAll('.total-price').forEach(el => {
//         el.textContent = 'Ksh 0.00';
//       });
//       return;
//     }

//     items.forEach(item => {
//       const subtotal = item.quantity * parseFloat(item.price);
//       totalPrice += subtotal;

//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td class="align-middle">
//           <img src="${item.product_image}" alt="${item.product_name}" width="50" class="mr-2">
//           ${item.product_name}
//         </td>
//         <td class="align-middle">Ksh ${parseFloat(item.price).toFixed(2)}</td>
//         <td class="align-middle">
//           <div class="d-flex align-items-center">
//             <button class="btn btn-sm btn-outline-secondary decrease-qty" data-id="${item.product_id}">-</button>
//             <input type="number" class="form-control form-control-sm quantity-input mx-2" 
//                    data-id="${item.product_id}" 
//                    value="${item.quantity}" min="1" style="width: 60px;">
//             <button class="btn btn-sm btn-outline-secondary increase-qty" data-id="${item.product_id}">+</button>
//           </div>
//         </td>
//         <td class="align-middle">Ksh ${subtotal.toFixed(2)}</td>
//         <td class="align-middle">
//           <button class="btn btn-sm btn-outline-danger remove-btn" data-id="${item.product_id}">
//             <i class="fa fa-trash"></i>
//           </button>
//         </td>
//       `;
//       cartTableBody.appendChild(row);
//     });

//     // Update ALL total price elements
//     document.querySelectorAll('.total-price').forEach(el => {
//       el.textContent = `Ksh ${totalPrice.toFixed(2)}`;
//     });
//   }

//   function setupCartEventListeners() {
//     document.addEventListener('click', async (e) => {
//       try {
//         if (e.target.closest('.remove-btn')) {
//           const btn = e.target.closest('.remove-btn');
//           await removeItem(btn.dataset.id);
//         } else if (e.target.closest('.increase-qty')) {
//           const btn = e.target.closest('.increase-qty');
//           await updateQuantity(btn.dataset.id, 1);
//         } else if (e.target.closest('.decrease-qty')) {
//           const btn = e.target.closest('.decrease-qty');
//           await updateQuantity(btn.dataset.id, -1);
//         }
//       } catch (error) {
//         console.error('Action error:', error);
//         showToast(error.message, 'error');
//       }
//     });

//     cartTableBody.addEventListener('change', async (e) => {
//       if (e.target.classList.contains('quantity-input')) {
//         try {
//           const input = e.target;
//           const productId = input.dataset.id;
//           const newQty = Math.max(1, parseInt(input.value) || 1);
//           await updateQuantity(productId, newQty, true);
//         } catch (error) {
//           console.error('Quantity change error:', error);
//           showToast('Failed to update quantity', 'error');
//         }
//       }
//     });
//   }

//   async function updateQuantity(productId, change, isAbsolute = false) {
//     try {
//       const body = isAbsolute
//         ? { quantity: change }
//         : { quantity_change: change };

//       const response = await fetch(`/api/cart/${productId}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body)
//       });

//       if (!response.ok) throw new Error('Failed to update quantity');

//       const updatedCart = await fetchCartData();
//       renderCartTable(updatedCart.items, updatedCart.cartCount);
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       showToast(error.message, 'error');
//     }
//   }

//   async function removeItem(productId) {
//     try {
//       const response = await fetch(`/api/cart/${productId}`, {
//         method: 'DELETE'
//       });

//       if (!response.ok) throw new Error('Failed to remove item');

//       const updatedCart = await fetchCartData();
//       renderCartTable(updatedCart.items, updatedCart.cartCount);
//       showToast('Item removed from cart');
//     } catch (error) {
//       console.error('Error removing item:', error);
//       showToast(error.message, 'error');
//     }
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

//   if (!document.getElementById('toast-styles')) {
//     const style = document.createElement('style');
//     style.id = 'toast-styles';
//     style.textContent = `
//       .toast {
//         position: fixed;
//         bottom: 20px;
//         left: 50%;
//         transform: translateX(-50%);
//         background: #4CAF50;
//         color: white;
//         padding: 12px 24px;
//         border-radius: 4px;
//         opacity: 0;
//         transition: opacity 0.3s;
//         z-index: 1000;
//       }
//       .toast.error {
//         background: #f44336;
//       }
//       .toast.show {
//         opacity: 1;
//       }
//     `;
//     document.head.appendChild(style);
//   }
// });



document.addEventListener('DOMContentLoaded', async function () {
  console.log('DOM loaded, initializing cart...'); // Debug log
  
  const cartTableBody = document.getElementById('cart-table-body');
  
  if (!cartTableBody) {
    console.error('cart-table-body element not found!');
    return;
  }

  try {
    console.log('Fetching initial cart data...'); // Debug log
    const cartData = await fetchCartData();
    console.log('Cart data received:', cartData); // Debug log
    renderCartTable(cartData.items, cartData.cartCount);
    setupCartEventListeners();
  } catch (error) {
    console.error('Initial cart load failed:', error);
    renderCartTable([], 0);
    showToast('Failed to load cart. Please refresh the page.', 'error');
  }

  async function fetchCartData() {
    try {
      console.log('Making API request to /api/cart...'); // Debug log
      const response = await fetch('/api/cart', {
        headers: {
          'Accept': 'application/json',
        }
      });

      console.log('Response status:', response.status); // Debug log
      
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

      const data = await response.json();
      console.log('Parsed cart data:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  function renderCartTable(items, cartCount) {
    console.log('Rendering cart table with:', {items, cartCount}); // Debug log
    cartTableBody.innerHTML = '';

    // Update ALL cart count elements
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = cartCount || 0;
    });

    let totalPrice = 0;

    if (!items || items.length === 0) {
      cartTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Your cart is empty</td></tr>';
      // Update ALL total price elements
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
                   data-id="${item.product_id}" 
                   value="${item.quantity}" min="1" style="width: 60px;">
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

    // Update ALL total price elements
    document.querySelectorAll('.total-price').forEach(el => {
      el.textContent = `Ksh ${totalPrice.toFixed(2)}`;
    });
  }

  function setupCartEventListeners() {
    console.log('Setting up event listeners...'); // Debug log
    
    // Use event delegation for dynamic elements
    document.addEventListener('click', async (e) => {
      try {
        if (e.target.closest('.remove-btn')) {
          const btn = e.target.closest('.remove-btn');
          console.log('Remove button clicked for product:', btn.dataset.id); // Debug log
          await removeItem(btn.dataset.id);
        } else if (e.target.closest('.increase-qty')) {
          const btn = e.target.closest('.increase-qty');
          console.log('Increase button clicked for product:', btn.dataset.id); // Debug log
          await updateQuantity(btn.dataset.id, 1);
        } else if (e.target.closest('.decrease-qty')) {
          const btn = e.target.closest('.decrease-qty');
          console.log('Decrease button clicked for product:', btn.dataset.id); // Debug log
          await updateQuantity(btn.dataset.id, -1);
        }
      } catch (error) {
        console.error('Action error:', error);
        showToast(error.message, 'error');
      }
    });

    cartTableBody.addEventListener('change', async (e) => {
      if (e.target.classList.contains('quantity-input')) {
        try {
          const input = e.target;
          const productId = input.dataset.id;
          const newQty = Math.max(1, parseInt(input.value) || 1);
          console.log('Manual quantity change for product:', productId, 'New qty:', newQty); // Debug log
          await updateQuantity(productId, newQty, true);
        } catch (error) {
          console.error('Quantity change error:', error);
          showToast('Failed to update quantity', 'error');
        }
      }
    });
  }

  async function updateQuantity(productId, change, isAbsolute = false) {
    console.log(`Updating quantity for ${productId}, change: ${change}, isAbsolute: ${isAbsolute}`); // Debug log
    try {
      const body = isAbsolute
        ? { quantity: change }
        : { quantity_change: change };

      const response = await fetch(`/api/cart/${productId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      });

      console.log('Update quantity response status:', response.status); // Debug log
      
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
      // Re-fetch cart to ensure UI is in sync
      try {
        const updatedCart = await fetchCartData();
        renderCartTable(updatedCart.items, updatedCart.cartCount);
      } catch (fetchError) {
        console.error('Failed to refresh cart after error:', fetchError);
      }
    }
  }

  async function removeItem(productId) {
    console.log('Removing item:', productId); // Debug log
    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('Remove item response status:', response.status); // Debug log
      
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
    console.log(`Showing toast: ${type} - ${message}`); // Debug log
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




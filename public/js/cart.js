async function updateCartCountAndTotal() {
  try {
    const response = await fetch('/api/cart', {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error('Failed to fetch cart data');

    const data = await response.json();

    // Update cart count everywhere
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = data.cartCount || 0;
    });

    // Update total price everywhere
    document.querySelectorAll('.total-price').forEach(el => {
      el.textContent = 'Ksh ' + (data.totalPrice || '0.00');
    });
  } catch (error) {
    console.error('Error updating cart display:', error);
  }
}

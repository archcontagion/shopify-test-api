export const useCart = () => {
  const cart = useState<any>('cart', () => null);

  const getOrCreateCart = async () => {
    if (cart.value) return cart.value;

    if (import.meta.client) {
      const stored = localStorage.getItem('cart_id');
      if (stored) {
        cart.value = {id: stored};
        return cart.value;
      }
    }

    const newCart = await $fetch('/api/cart/create', {
      method: 'POST',
    });

    cart.value = newCart;
    if (import.meta.client && newCart?.id) {
      localStorage.setItem('cart_id', newCart.id);
    }
    return newCart;
  };

  const addToCart = async (variantId: string) => {
    const c = await getOrCreateCart();

    const updated = await $fetch('/api/cart/add', {
      method: 'POST',
      body: {
        cartId: c.id,
        variantId,
      },
    });

    cart.value = updated;
  };

  const clearCart = async () => {
    if (!cart.value) return;
    const cartId = cart.value.id;
    try {
      const result = await $fetch('/api/cart/clear', {
        method: 'POST',
        body: { cartId },
      });
      cart.value = result;
      if (import.meta.client && (!result?.id || result.totalQuantity === 0)) {
        localStorage.removeItem('cart_id');
        if (!result?.id) cart.value = null;
      }
    } catch {
      // Clear local state so UI shows empty even if API failed (e.g. expired cart)
      cart.value = null;
      if (import.meta.client) localStorage.removeItem('cart_id');
    }
  };

  const updateLine = async (lineId: string, quantity: number) => {
    if (!cart.value) return;

    cart.value = await $fetch('/api/cart/update', {
      method: 'POST',
      body: {
        cartId: cart.value.id,
        lines: [{id: lineId, quantity}],
      },
    });
  };

  const removeLine = async (lineId: string) => {
    if (!cart.value) return;

    cart.value = await $fetch('/api/cart/remove', {
      method: 'POST',
      body: {
        cartId: cart.value.id,
        lineIds: [lineId],
      },
    });
  };

  const fetchCart = async () => {
    if (import.meta.client) {
      const cartId = cart.value?.id ?? localStorage.getItem('cart_id');
      if (!cartId) return null;
      if (!cart.value) cart.value = {id: cartId};
      try {
        const full = await $fetch<Record<string, unknown>>('/api/cart/get', {
          query: {cartId},
        });
        if (full) cart.value = full;
        return full;
      } catch {
        return null;
      }
    }
    return null;
  };

  return {
    cart,
    clearCart,
    addToCart,
    updateLine,
    removeLine,
    fetchCart,
  };
};

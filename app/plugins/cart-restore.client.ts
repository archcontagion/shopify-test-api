import {useCart} from '~/composable/useCart';

export default defineNuxtPlugin(async () => {
  const {cart, fetchCart} = useCart();
  if (!cart.value && localStorage.getItem('cart_id')) {
    await fetchCart();
  }
});

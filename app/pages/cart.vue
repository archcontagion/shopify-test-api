<script setup lang="ts">
import {useCart} from '~/composable/useCart';
const {cart, updateLine, removeLine, fetchCart, clearCart} = useCart();

const loading = ref(true);
onMounted(async () => {
  await fetchCart();
  loading.value = false;
});
</script>

<template>
  <main v-if="cart" class="container py-4">
    <div class="d-flex gap-2 align-items-center mb-4">
      <NuxtLink to="/" title="Home" class="btn btn-primary">Home</NuxtLink>
      <button class="btn btn-primary" @click="clearCart">Clear cart</button>
    </div>
    <h1>Your cart</h1>

    <p v-if="loading" class="text-muted">Loading cart…</p>

    <template v-else>
      <div
        v-for="line in cart.lines?.edges ?? []"
        :key="line.node.id"
        class="d-flex align-items-center gap-3 border-bottom pb-3 mb-3"
      >
        <NuxtImg
          v-if="line.node.merchandise?.image?.url"
          :src="line.node.merchandise.image.url"
          :alt="line.node.merchandise.image.altText ?? ''"
          class="rounded"
          width="64"
          height="64"
          format="webp"
        />
        <div class="flex-grow-1">
          <strong>
            {{ line.node.merchandise?.product?.title ?? 'Item' }}
          </strong>
          <p v-if="line.node.merchandise?.price" class="text-muted small mb-0">
            {{ formatPrice(line.node.merchandise.price.amount) }}
            {{ line.node.merchandise.price.currencyCode }}
            each
          </p>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button
            class="btn btn-outline-secondary btn-sm"
            @click="updateLine(line.node.id, line.node.quantity - 1)"
            :disabled="line.node.quantity <= 1"
          >
            −
          </button>
          <span
            class="text-nowrap"
            style="min-width: 1.5rem; text-align: center"
          >
            {{ line.node.quantity }}
          </span>
          <button
            class="btn btn-outline-secondary btn-sm"
            @click="updateLine(line.node.id, line.node.quantity + 1)"
          >
            +
          </button>
          <button
            class="btn btn-outline-danger btn-sm"
            @click="removeLine(line.node.id)"
          >
            Remove
          </button>
        </div>
      </div>

      <p v-if="cart.cost?.totalAmount" class="fw-bold mt-3">
        Total:
        {{ formatPrice(cart.cost.totalAmount.amount) }}
        {{ cart.cost.totalAmount.currencyCode }}
      </p>

      <a
        v-if="cart.checkoutUrl"
        class="btn btn-success"
        :href="cart.checkoutUrl"
      >
        Go to checkout
      </a>
    </template>
  </main>

  <main v-else class="container py-4">
    <p class="text-muted">Your cart is empty.</p>
  </main>
</template>

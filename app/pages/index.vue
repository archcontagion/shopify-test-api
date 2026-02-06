<script setup lang="ts">
import {useCart} from '~/composable/useCart';
import Navbar from '~/components/Navbar.vue';
const {data: products} = await useFetch('/api/products');
const {cart, clearCart} = useCart();
</script>

<template>
  <Navbar />
  <main class="container py-4">
    <div class="row g-3 mb-4">
      <div class="col-12">
        <div
          v-if="cart"
          class="alert alert-primary d-flex flex-wrap align-items-center gap-2"
        >
          <p class="mb-0 me-2">
            You have {{ cart.totalQuantity ?? 0 }} items in your cart
          </p>
          <p v-if="cart.cost?.totalAmount" class="mb-0 me-2">
            Total: {{ formatPrice(cart.cost.totalAmount.amount) }}
            {{ cart.cost.totalAmount.currencyCode }}
          </p>
          <a
            v-if="cart.checkoutUrl"
            target="_blank"
            class="btn btn-success btn-sm ms-auto"
            :href="cart.checkoutUrl"
          >
            Checkout
          </a>
        </div>
        <p v-else class="text-muted mb-0">Your cart is empty.</p>
      </div>
    </div>
    <div class="row g-3">
      <article v-for="p in products" :key="p.id" class="col-md-6 col-lg-4">
        <div class="card h-100 d-flex flex-column">
          <div
            class="p-0 flex-shrink-0 overflow-hidden bg-light"
            style="height: 400px"
          >
            <NuxtImg
              loading="lazy"
              v-if="p.images?.edges?.[0]?.node"
              class="w-100 h-100 object-fit-contain"
              :src="p.images.edges[0].node.url"
              :alt="p.images.edges[0].node.altText"
            />
          </div>
          <div class="card-body d-flex flex-column flex-grow-1 flex-shrink-0">
            <NuxtLink
              class="mb-4 h-100 d-inline-block"
              :to="`/products/${p.handle}`"
            >
              <h2 class="card-title">{{ p.title }}</h2>
            </NuxtLink>
            <p class="card-text" v-if="p.variants?.edges?.[0]?.node">
              {{ formatPrice(p.variants.edges[0].node.price.amount) }}
              {{ p.variants.edges[0].node.price.currencyCode }}
            </p>

            <AddToCart
              class="btn btn-primary"
              v-if="p.variants?.edges?.[0]?.node"
              :variant-id="p.variants.edges[0].node.id"
            />
          </div>
        </div>
      </article>
    </div>
  </main>
</template>

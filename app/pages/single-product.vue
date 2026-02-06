<script setup lang="ts">
import Navbar from '~/components/Navbar.vue';
import {useCart} from '~/composable/useCart';

const productId = ref('');
const product = ref<Record<string, unknown> | null>(null);
const error = ref('');
const {addToCart} = useCart();

const handleSubmit = async () => {
  error.value = '';
  product.value = null;
  try {
    const data = await $fetch<Record<string, unknown>>('/api/products/by-id', {
      query: {id: productId.value.trim()},
    });
    product.value = data;
  } catch (e: unknown) {
    const status = (e as {statusCode?: number})?.statusCode;
    if (status === 404) {
      error.value = 'Product not found.';
    } else {
      error.value = 'Failed to load product.';
    }
  }
};

const firstImage = computed(() => {
  const p = product.value;
  const edges = (
    p?.images as {edges?: Array<{node: {url: string; altText?: string}}>}
  )?.edges;
  return edges?.[0]?.node;
});

const firstVariant = computed(() => {
  const p = product.value;
  const edges = (
    p?.variants as {
      edges?: Array<{
        node: {id: string; price?: {amount: string; currencyCode: string}};
      }>;
    }
  )?.edges;
  return edges?.[0]?.node;
});
</script>

<template>
  <Navbar />
  <main class="container py-4">
    <h1 class="my-4">Single Product</h1>
    <p>
      This is a single product page that displays a single product, basedf on
      the product id in the form field.
    </p>
    Test ids:
    <ul>
      <li>9596425371987 -The Videographer Snowboard</li>
      <li>9596425339219 - The Compare at Price Snowboard</li>
      <li>9596425634131 - The Collection Snowboard: Oxygen</li>
    </ul>

    <form @submit.prevent="handleSubmit">
      <div class="form-group mb-4">
        <label for="productId" class="form-label me-2">Product ID</label>
        <input
          type="text"
          id="productId"
          v-model="productId"
          class="form-control"
          required
        />
      </div>
      <button class="btn btn-primary" type="submit">Get Product</button>
    </form>

    <p v-if="error" class="text-danger mt-2">{{ error }}</p>

    <div v-if="product" class="mt-4">
      <h2>{{ product.title }}</h2>
      <p>{{ product.description }}</p>
      <img
        v-if="firstImage"
        :src="firstImage.url"
        :alt="firstImage.altText ?? ''"
        class="img-fluid rounded mb-2"
      />
      <p v-if="firstVariant?.price" class="mb-2">
        Price:
        {{ formatPrice(firstVariant.price.amount) }}
        {{ firstVariant.price.currencyCode }}
      </p>
      <AddToCart v-if="firstVariant" :variant-id="firstVariant.id" />
    </div>
  </main>
</template>

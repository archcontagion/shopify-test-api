<script setup lang="ts">
import Navbar from '~/components/Navbar.vue';

const collectionId = ref('');
const collection = ref<Record<string, unknown> | null>(null);
const error = ref('');

const handleSubmit = async () => {
  error.value = '';
  collection.value = null;
  try {
    const data = await $fetch<Record<string, unknown>>(
      '/api/collections/by-id',
      {
        query: {id: collectionId.value.trim()},
      },
    );
    collection.value = data;
  } catch (e: unknown) {
    const status = (e as {statusCode?: number})?.statusCode;
    if (status === 404) {
      error.value = 'Collection not found.';
    } else {
      error.value = 'Failed to load collection.';
    }
  }
};

const products = computed(() => {
  const c = collection.value;
  const edges = (
    c?.products as {edges?: Array<{node: Record<string, unknown>}>}
  )?.edges;
  return edges?.map((e) => e.node) ?? [];
});

function firstProductImage(
  p: Record<string, unknown>,
): {url: string; altText?: string} | null {
  const edges = (
    p?.images as {edges?: Array<{node: {url: string; altText?: string}}>}
  )?.edges;
  return edges?.[0]?.node ?? null;
}

function firstVariantPrice(
  p: Record<string, unknown>,
): {amount: string; currencyCode: string} | null {
  const edges = (
    p?.variants as {
      edges?: Array<{node: {price?: {amount: string; currencyCode: string}}}>;
    }
  )?.edges;
  return edges?.[0]?.node?.price ?? null;
}

function firstVariantId(p: Record<string, unknown>): string | null {
  const edges = (p?.variants as {edges?: Array<{node: {id: string}}>})?.edges;
  return edges?.[0]?.node?.id ?? null;
}
</script>

<template>
  <Navbar />
  <main class="container py-4">
    <h1 class="my-4">Collection by ID</h1>
    <p class="text-muted">
      Enter only the collection ID number (no GID prefix).
    </p>
    <ul class="mb-3">
      <li>634720452947 – Hydrogen</li>
      <li>648055914835 – Kategorie Grüne Snowboards</li>
    </ul>

    <form @submit.prevent="handleSubmit" class="mb-4">
      <div class="mb-3">
        <label for="collectionId" class="form-label"
          >Collection ID (number only)</label
        >
        <input
          id="collectionId"
          v-model="collectionId"
          type="text"
          class="form-control"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Load collection</button>
    </form>

    <p v-if="error" class="text-danger">{{ error }}</p>

    <template v-if="collection">
      <div class="mb-4">
        <h2>{{ collection.title }}</h2>
        <p v-if="collection.description" class="text-muted">
          {{ collection.description }}
        </p>
        <img
          v-if="(collection.image as {url?: string})?.url"
          :src="(collection.image as {url: string}).url"
          :alt="(collection.image as {altText?: string})?.altText ?? ''"
          class="img-fluid rounded mt-2"
          style="max-height: 200px; object-fit: cover"
        />
      </div>

      <h3 class="mb-3">Products ({{ products.length }})</h3>
      <div class="row g-3">
        <article
          v-for="p in products"
          :key="p.id as string"
          class="col-md-6 col-lg-4"
        >
          <div class="card h-100 d-flex flex-column">
            <div
              class="p-0 flex-shrink-0 overflow-hidden bg-light"
              style="height: 220px"
            >
              <NuxtImg
                v-if="firstProductImage(p)"
                class="w-100 h-100 object-fit-contain"
                :src="firstProductImage(p)!.url"
                :alt="firstProductImage(p)!.altText ?? ''"
              />
            </div>
            <div class="card-body d-flex flex-column flex-grow-1 flex-shrink-0">
              <NuxtLink
                class="text-decoration-none"
                :to="`/products/${p.handle as string}`"
              >
                <h2 class="card-title h6">{{ p.title }}</h2>
              </NuxtLink>
              <p v-if="firstVariantPrice(p)" class="card-text small mb-2">
                {{ formatPrice(firstVariantPrice(p)!.amount) }}
                {{ firstVariantPrice(p)!.currencyCode }}
              </p>
              <AddToCart
                v-if="firstVariantId(p)"
                class="btn btn-primary btn-sm mt-auto"
                :variant-id="firstVariantId(p)!"
              />
            </div>
          </div>
        </article>
      </div>
    </template>
  </main>
</template>

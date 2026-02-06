<script setup lang="ts">
import {useCart} from '~/composable/useCart';

const route = useRoute();

const {data: product} = await useFetch(`/api/products/${route.params.handle}`);

if (!product.value) {
  throw createError({statusCode: 404});
}

useSeoMeta({
  title: product.value.seo?.title || product.value.title,
  description: product.value.seo?.description || product.value.description,
});

const selectedVariant = ref(product.value.variants.edges[0].node);

const {addToCart} = useCart();
</script>

<template>
  <Navbar />
  <main v-if="product">
    <div class="container py-4">
      <div class="row">
        <div class="col-12 col-md-6">
          <div class="mx-auto">
            <NuxtImg
              v-if="product.images.edges[0]"
              :src="product.images.edges[0].node.url"
              :alt="product.images.edges[0].node.altText"
              class="img-fluid rounded mb-2"
            />

            <h1>{{ product.title }}</h1>
            <p>{{ product.description }}</p>

            <select class="form-select mb-4" v-model="selectedVariant">
              <option
                v-for="v in product.variants.edges"
                :key="v.node.id"
                :value="v.node"
              >
                {{ formatPrice(v.node.price.amount) }}
                {{ v.node.price.currencyCode }}
              </option>
            </select>

            <button
              class="btn btn-primary"
              @click="addToCart(selectedVariant.id)"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

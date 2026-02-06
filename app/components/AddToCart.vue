<script setup lang="ts">
import {useCart} from '~/composable/useCart';

const props = defineProps<{
  variantId: string;
}>();

const {addToCart} = useCart();
</script>

<template>
  <button @click="addToCart(props.variantId)">Add to cart</button>
</template>

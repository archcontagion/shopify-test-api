<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container mt-4">
      <div class="d-flex gap-2 align-items-center mb-4">
        <NuxtLink to="/" title="Home" class="btn btn-primary">Home</NuxtLink>
        <NuxtLink to="/single-product" class="btn btn-primary"
          >Single Product</NuxtLink
        >
        <NuxtLink to="/collection-product" class="btn btn-primary"
          >Collection Product</NuxtLink
        >
        <NuxtLink to="/cart" class="btn btn-primary">View cart</NuxtLink>
        <button class="btn btn-primary" @click="clearCart">Clear cart</button>
      </div>
    </div>
  </nav>
</template>

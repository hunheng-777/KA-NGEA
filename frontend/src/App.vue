<template>
  <div>
    <Navbar />      
    <RouterView />
    <Footer />      
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Navbar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
</script>
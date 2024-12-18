<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

<template>
  <rich-text :nodes="content" />
</template>

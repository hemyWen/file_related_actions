<template>
  <div class="upload-container">
    <UploadFile filename="测试.doc" />
  </div>
</template>
<script setup lang="ts">
import UploadFile from "@/components/UploadFile.vue";
</script>
<style scoped>
.upload-container {
  width: 800px;
}
</style>

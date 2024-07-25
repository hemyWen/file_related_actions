<template>
  <div>
    <input type="file" id="fileInput" @change="uploadChange" />
    <div id="preview"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { renderAsync } from "docx-preview";
const uploadChange = (e) => {
  const fileInputDom = document.getElementById("fileInput");
  const previewDom = document.getElementById("preview");
  renderAsync(fileInputDom.files[0], previewDom);
};
</script>
<style scoped></style>

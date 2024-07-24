<template>
  <div class="">
    <el-radio-group v-model="radio">
      <el-radio label="图片" value="image" />
      <el-radio label="word" value="word" />
      <el-radio label="excel" value="excel" />
      <el-radio label="pdf" value="pdf" />
    </el-radio-group>
    <el-divider />
    <PreviewImage v-if="radio === 'image'" :images="images" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const radio = ref("image");
// 图片预览
import PreviewImage from "@/components/PreviewImage.vue";
const images = [new URL("@/assets/lufei.jpg", import.meta.url).href];
</script>
<style scoped></style>

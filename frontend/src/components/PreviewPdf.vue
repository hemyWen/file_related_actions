<template>
  <div style="display: inline-block">
    <el-button type="primary" size="small" @click="onView">查看</el-button>
    <el-dialog v-model="dialogVisible" fullscreen>
      <embed :src="props.url" width="100%" :height="height" />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});
const height = document.body.clientHeight;
const dialogVisible = ref(false);
const onView = () => {
  dialogVisible.value = true;
};
</script>
<style scoped></style>

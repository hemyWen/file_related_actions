<template>
  <el-button type="primary" size="small" @click="onView">查看</el-button>
  <el-dialog v-model="dialogVisible" title="预览" fullscreen>
    <div id="preview-container"></div>
  </el-dialog>
</template>
<script setup lang="ts">
import { UploadFile } from "element-plus";
import { PropType, ref, nextTick } from "vue";
const props = defineProps({
  file: {
    type: Object as PropType<UploadFile>,
    required: true,
  },
});
const dialogVisible = ref(false);

import { renderAsync } from "docx-preview";
const onView = () => {
  dialogVisible.value = true;
  nextTick(() => {
    const previewDom = document.getElementById(
      "preview-container"
    ) as HTMLElement;
    renderAsync(props.file.raw, previewDom as HTMLElement);
  });
};
</script>
<style scoped></style>

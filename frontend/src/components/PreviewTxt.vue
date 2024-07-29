<template>
  <div style="display: inline-block">
    <el-button type="primary" size="small" @click="onView">查看</el-button>
    <el-dialog v-model="dialogVisible" title="预览" fullscreen>
      <div id="preview-container" style="white-space: pre-wrap">
        {{ txtContent }}
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, nextTick } from "vue";
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});
const dialogVisible = ref(false);
const txtContent = ref("");
const onView = () => {
  dialogVisible.value = true;
  nextTick(async () => {
    const response = await fetch(props.url);
    if (response.status >= 200 && response.status < 300) {
      txtContent.value = await response.text();
    } else {
      throw new Error(response.statusText);
    }
  });
};
</script>
<style scoped></style>

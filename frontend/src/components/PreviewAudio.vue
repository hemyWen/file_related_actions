<template>
  <div style="display: inline-block">
    <el-button type="primary" size="small" @click="onView">播放</el-button>
    <el-dialog v-model="dialogVisible" fullscreen>
      <audio
        v-if="dialogVisible"
        controls
        controlsList="nodownload"
        style="width: 60%"
      >
        <track kind="captions" />
        <source :src="props.url" type="video/mp4" />
      </audio>
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
const dialogVisible = ref(false);
const onView = () => {
  dialogVisible.value = true;
};
</script>
<style scoped></style>

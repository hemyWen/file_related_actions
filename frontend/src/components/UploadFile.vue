<template>
  <div class="upload-item">
    <svg-icon :iconName="iconName"></svg-icon>
    <span class="filename">{{ props.filename }}</span>
    <span class="other"></span>
    <span class="upload-time">2014-09-09 23:00:00</span>
    <div class="operation">
      <el-button type="primary" size="small">查看</el-button>
      <el-button type="warning" size="small">上传</el-button>
      <el-button type="danger" size="small">删除</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { matchTypes, getIconName } from "@/utils/tools";
const props = defineProps({
  filename: {
    type: String,
    required: true,
  },
});
const iconName = computed(() => getIconName(matchTypes(props.filename)));
</script>
<style scoped>
.upload-item {
  width: 100%;
  display: flex;
  align-items: center;
}
.filename {
  margin-left: 20px;
  color: #777;
}
.upload-time {
  color: #777;
}
.operation {
  margin-left: 20px;
}
.other {
  flex: 1;
}
</style>

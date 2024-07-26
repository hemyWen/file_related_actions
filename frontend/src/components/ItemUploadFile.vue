<template>
  <div class="upload-item">
    <svg-icon :iconName="iconName"></svg-icon>
    <span class="filename">{{ props.file.name }}</span>
    <span class="other"></span>
    <div class="operation">
      <PreviewWord v-if="fileType === 'word'" :file="file" />
      <PreviewExcel v-if="fileType === 'excel'" :url="fileUrl" />
      <PreviewPdf v-if="fileType === 'pdf'" :url="fileUrl" />
      <PreviewAudio v-if="fileType === 'mp3'" :file="fileUrl" />
      <PreviewVideo v-if="fileType === 'video'" :file="fileUrl" />
      <el-button type="warning" size="small" style="margin-left: 10px">
        上传
      </el-button>
      <el-button type="danger" size="small">删除</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, PropType } from "vue";
import { matchTypes, getIconName } from "@/utils/tools";
import { UploadFile } from "element-plus";
const props = defineProps({
  file: {
    type: Object as PropType<UploadFile>,
    required: true,
  },
});
const fileUrl = URL.createObjectURL(props.file.raw as File);
const fileType = computed(() => matchTypes(props.file.name));
const iconName = computed(() => getIconName(matchTypes(props.file.name)));
</script>
<style scoped>
.upload-item {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.filename {
  margin-left: 10px;
  width: 200px;
  display: inline-block;
  white-space: nowrap; /*强制span不换行*/
  overflow: hidden; /*超出宽度部分隐藏*/
  text-overflow: ellipsis; /*超出部分以点号代替*/
  font-size: 14px;
  color: #777;
}
.upload-time {
  font-size: 14px;
  color: #777;
}
.operation {
  margin-left: 20px;
}
.other {
  flex: 1;
}
</style>

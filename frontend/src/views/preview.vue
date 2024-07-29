<template>
  <div class="upload-container">
    <el-upload
      class="upload-demo"
      v-model:file-list="fileList"
      :show-file-list="false"
      :auto-upload="false"
      drag
      multiple
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">拖放此处或 <em>点击上传</em></div>
    </el-upload>
    <ItemUploadFile
      v-for="(file, index) in fileList"
      :file="file"
      :index="index"
      @on-delete="onDelete"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import ItemUploadFile from "@/components/ItemUploadFile.vue";
import { UploadFile } from "element-plus";
const fileList = ref<UploadFile[]>([]);
const onDelete = (index: number) => {
  fileList.value.splice(index, 1);
};
</script>
<style scoped>
.upload-container {
  width: 800px;
}
</style>

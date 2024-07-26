<template>
  <div style="display: inline-block">
    <el-button type="primary" size="small" @click="onView">查看</el-button>
    <el-dialog v-model="dialogVisible" fullscreen>
      <vue-office-excel
        :src="props.url"
        style="height: 100vh"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import VueOfficeExcel from "@vue-office/excel";
//引入相关样式
import "@vue-office/excel/lib/index.css";
import { ref } from "vue";
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});
function renderedHandler() {
  console.log("渲染完成");
}
function errorHandler() {
  console.log("渲染失败");
}
const dialogVisible = ref(false);
const onView = () => {
  dialogVisible.value = true;
};
</script>
<style scoped></style>

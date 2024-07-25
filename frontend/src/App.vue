<template>
  <div class="container">
    <el-menu default-active="1" class="el-menu-vertical-demo" router>
      <el-menu-item index="preview">
        <template #title> 文件预览上传 </template>
      </el-menu-item>
      <el-menu-item index="upload">
        <template #title> 大文件上传 </template>
      </el-menu-item>
      <el-menu-item index="export-import">
        <template #title> 导入导出 </template>
      </el-menu-item>
      <el-menu-item index="print">
        <template #title> 打印 </template>
      </el-menu-item>
    </el-menu>
    <div class="right-container"><RouterView /></div>
  </div>
</template>

<script lang="ts" setup></script>

<style>
.container {
  display: flex;
  width: 100%;
  height: 100%;
}
.el-menu-vertical-demo {
  width: 200px;
  height: 100%;
}
.right-container {
  flex: 1;
  padding: 10px;
}
</style>

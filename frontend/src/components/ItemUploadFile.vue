<template>
  <div class="upload-item">
    <PreviewImage
      v-if="fileType === 'image'"
      width="45"
      height="45"
      :images="[mUrl]"
    />
    <svg-icon v-else :iconName="iconName"></svg-icon>

    <div class="middle">
      <span class="filename">{{ props.file.name }}</span>
      <!-- <span class="size">{{ props.file.size }}</span> -->
    </div>
    <span class="other"></span>
    <div class="operation">
      <PreviewWord v-if="fileType === 'word'" :file="file" />
      <PreviewExcel v-if="fileType === 'excel'" :url="fileUrl" />
      <PreviewPdf v-if="fileType === 'pdf'" :url="fileUrl" />
      <PreviewAudio v-if="fileType === 'mp3'" :url="mUrl" />
      <PreviewVideo v-if="fileType === 'video'" :url="fileUrl" />
      <PreviewTxt v-if="fileType === 'txt'" :url="fileUrl" />
      <el-button type="warning" size="small" style="margin-left: 10px">
        上传
      </el-button>
      <el-button type="danger" size="small" @click="onDelete">删除</el-button>
    </div>
  </div>
  <div class="bottom">
    <HemyProgress
      class="progress"
      type="line"
      :percentage="0"
      :lineHeight="12"
      :borderRadius="6"
    />
    <el-button type="primary" link style="margin-left: 10px"> 暂停 </el-button>
    <el-button type="primary" link> 取消 </el-button>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, PropType, ref } from "vue";
import { matchTypes, getIconName, getFileUrl } from "@/utils/tools";
import { UploadFile } from "element-plus";
import HemyProgress from "@hemy-progress/vue3";
const props = defineProps({
  file: {
    type: Object as PropType<UploadFile>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});
//URL.createObjectURL和readAsDataURL都可
const fileUrl = URL.createObjectURL(props.file.raw as File);
const mUrl = ref("");
onMounted(async () => {
  mUrl.value = await getFileUrl(props.file.raw);
});

const fileType = computed(() => matchTypes(props.file.name));
const iconName = computed(() => getIconName(matchTypes(props.file.name)));
//删除
const emit = defineEmits<{
  (e: "on-delete", index: number): void;
}>();
const onDelete = () => {
  emit("on-delete", props.index);
};
</script>
<style scoped>
.upload-item {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.middle {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  font-size: 14px;
  color: #777;
}
.filename {
  width: 200px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
.bottom {
  padding: 0 10px;
  display: flex;
  align-items: center;
}
.progress {
  flex: 1;
}
</style>

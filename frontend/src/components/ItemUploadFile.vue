<template>
  <div class="upload-item">
    <PreviewImage v-if="fileType === 'image'" width="45" height="45" :images="[mUrl]" />
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
      <el-button type="warning" size="small" style="margin-left: 10px" @click="onUpload"> 上传 </el-button>
      <el-button type="danger" size="small" @click="onDelete">删除</el-button>
    </div>
  </div>
  <div class="bottom">
    <HemyProgress class="progress" type="line" :percentage="percentage" :lineHeight="12" :borderRadius="6" />
    <el-button v-if="file.status === 'ready'" type="primary" link style="margin-left: 10px"> 继续 </el-button>
    <el-button v-else-if="file.status === 'uploading'" type="primary" link style="margin-left: 10px"> 暂停 </el-button>
    <el-button v-else-if="file.status === 'success'" type="success" link style="margin-left: 10px"> 已上传 </el-button>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, PropType, ref } from "vue";
import { matchTypes, getIconName, getFileUrl } from "@/utils/tools";
import { baseUrl } from "@/utils/config";
import { UploadStatusReturn, ChunkType } from "@/types/type";
import { getFileChunks } from "@/utils/upload";
import { UploadFile, UploadRawFile } from "element-plus";
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
const file = props.file;
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
//已上传分片数量
const uploadedChunksCount = ref(0);
//总分片数量
const chunksCount = ref(0);
const percentage = computed(() =>
  chunksCount.value > 0 ? Math.floor((uploadedChunksCount.value / chunksCount.value) * 100) : 0
);

//上传操作
const onUpload = async () => {
  const fileRaw = file.raw as UploadRawFile;
  const fileMd5 = (await useWorker(fileRaw)) as string;

  let chunks = getFileChunks(fileRaw, fileMd5);
  chunksCount.value = chunks.length;
  const result = (await getUploadStatus(fileMd5, fileRaw.name)) as UploadStatusReturn;
  if (result.code === 0) {
    props.file.status = "success";
    uploadedChunksCount.value = chunks.length;
    return ElMessage.success(`${file.name}已上传`);
  } else if (result.code == 1) {
    //已上传的分片
    const uploadedChunks = result.chunks as string[];
    uploadedChunksCount.value = uploadedChunks.length;
    chunks = chunks.filter((item) => !uploadedChunks.includes(item.chunkIndex + ""));
    //分片全部上传
    if (chunks.length === 0) {
      props.file.status = "success";
      await mergeRequest(fileMd5, file.name);
      return ElMessage.success(`${file.name}已上传`);
    }
  }
  try {
    await uploadChunks(chunks);
    await mergeRequest(fileMd5, file.name);
  } catch (err) {
    return {
      mag: "文件上传错误",
      success: false,
    };
  }
};
const uploadChunks = (chunks: ChunkType[], maxRequest = 3) => {
  return new Promise((resolve, reject) => {
    if (chunks.length == 0) {
      resolve([]);
    }
    let requestSliceArr = [];
    let start = 0;
    while (start < chunks.length) {
      requestSliceArr.push(chunks.slice(start, start + maxRequest));
      start += maxRequest;
    }
    let index = 0;
    let requestResults: any[] = [];
    let requestErrReaults = [];

    const request = async () => {
      if (index > requestSliceArr.length - 1) {
        resolve(requestResults);
        return;
      }
      let sliceChunks = requestSliceArr[index];
      Promise.all(sliceChunks.map((chunk: ChunkType) => uploadHandler(chunk)))
        .then((res) => {
          requestResults.push(...(Array.isArray(res) ? res : []));
          index++;
          uploadedChunksCount.value = uploadedChunksCount.value + maxRequest;
          request();
        })
        .catch((err) => {
          requestErrReaults.push(...(Array.isArray(err) ? err : []));
          reject(requestErrReaults);
        });
    };
    request();
  });
};
const uploadHandler = (chunk: ChunkType) => {
  return new Promise(async (resolve, reject) => {
    try {
      let fd = new FormData();
      const { fileChunk, fileHash, fileName, chunkIndex } = chunk;
      fd.append("file", fileChunk);
      fd.append("fileHash", fileHash);
      fd.append("fileName", fileName);
      fd.append("chunkIndex", chunkIndex + "");
      let result = await fetch(`${baseUrl}/upload`, {
        method: "POST",
        body: fd,
      }).then((res) => res.json());
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};
// 合并分片请求
const mergeRequest = (fileHash: string, fileName: string) => {
  return fetch(`${baseUrl}/merge?fileHash=${fileHash}&fileName=${fileName}`, {
    method: "GET",
  }).then((res) => res.json());
};
// 验证当前文件是否上传过或上传到哪个切片
const getUploadStatus = (fileHash: string, fileName: string) => {
  return new Promise((resolve) => {
    fetch(`${baseUrl}/verify?fileHash=${fileHash}&fileName=${fileName}`, {
      method: "GET",
    }).then((res) => resolve(res.json()));
  });
};
const useWorker = (file: File) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("../utils/md5-worker", import.meta.url), { type: "module" });
    worker.postMessage({ file });
    worker.onmessage = (e) => {
      const { name, data } = e.data;
      name === "succeed" ? resolve(data) : reject(data);
    };
  });
};
onUpload();
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

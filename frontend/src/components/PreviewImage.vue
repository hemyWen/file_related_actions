<template>
  <viewer :images="props.images" :style="style">
    <template #default="scope">
      <img class="image" v-for="src in scope.images" :src="src" :key="src" />
      {{ scope.options }}
    </template>
  </viewer>
</template>
<!-- Options API -->
<script lang="ts" setup>
interface Props {
  width?: string;
  height?: string;
  images: string[];
}
import "viewerjs/dist/viewer.css";
import { component as Viewer } from "v-viewer";
import { ref } from "vue";
const props = withDefaults(defineProps<Props>(), {
  width: "100",
  height: "100",
  images: () => [],
});
const style = ref({ width: props.width + "px", height: props.height + "px" });
</script>
<style scoped>
.image {
  width: 100%;
  height: 100%;
}
</style>

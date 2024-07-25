import { createWebHashHistory, createRouter } from "vue-router";
import Home from "./views/home.vue";
import Preview from "./views/preview.vue";
import Upload from "./views/upload.vue";
import Print from "./views/print.vue";
import ExportImport from "./views/export-import.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/preview", component: Preview },
  { path: "/upload", component: Upload },
  { path: "/export-import", component: ExportImport },
  { path: "/print", component: Print },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;

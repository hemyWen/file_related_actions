//文件上传状态
export enum UploadStatus {
  READY_UPLOAD = 0, //上传准备
  UPLOADING = 1, //上传中
  PAUSE_UPLOAD = 2, //上传暂停
  UPLOADED = 3, //已上传
}
export interface UploadStatusReturn {
  msg: string;
  code: number;
  chunks?: Array<string>;
}
export interface ChunkType {
  fileChunk: Blob;
  fileHash: string;
  fileName: string;
  chunkIndex: number;
}
export interface ReturnType {
  msg: string;
  success: boolean;
}

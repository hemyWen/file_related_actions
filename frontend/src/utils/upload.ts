import SparkMD5 from "spark-md5";
import { UploadRawFile } from "element-plus";
//获取文件MD5，谷歌浏览器有最大文件限制当文件大于2G时浏览器无法读取文件
export const getFileMD5 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const fileMd5 = SparkMD5.ArrayBuffer.hash(e.target?.result);
      resolve(fileMd5);
    };
    fileReader.onerror = (e) => {
      reject("文件读取失败:" + e);
    };
    fileReader.readAsArrayBuffer(file);
  });
};
//获取文件的分片
export const getFileChunks = (file: UploadRawFile, fileHash: string, chunkSize: number = 3 * 1024 * 1024) => {
  const chunks = [];
  let start = 0;
  let end;
  let index = 0;
  while (start < file.size) {
    end = Math.min(start + chunkSize, file.size);
    chunks.push({ fileChunk: file.slice(start, end), fileHash, fileName: file.name, chunkIndex: index });
    start = end;
    index++;
  }
  return chunks;
};

import SparkMD5 from "spark-md5";
self.onmessage = async (e) => {
  const file = e.data.file;
  //切片
  const chunkSize = 1024 * 1024 * 3; // 每个切片的大小定位3m
  const chunkNum = Math.ceil(file.size / chunkSize); // 切片数量
  const sparkMD5 = new SparkMD5.ArrayBuffer();
  //利用文件首尾分片的md5合并作为整个文件md5
  const firstFile = file.slice(0 * chunkSize, (0 + 1) * chunkSize);
  try {
    if (chunkNum === 1) {
      await loadNext(firstFile);
    } else {
      const endFile = file.slice(
        (chunkNum - 1) * chunkSize,
        (chunkNum - 1 + 1) * chunkSize
      );
      await loadNext(firstFile);
      await loadNext(endFile);
    }
    const md = sparkMD5.end();
    self.postMessage({ name: "succeed", data: md });
    self.close();
  } catch (err) {
    self.postMessage({ name: "error", data: err });
    self.close();
  }
  function loadNext(park) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(park);
      reader.onload = (e) => {
        sparkMD5.append(e.target.result);
        resolve();
      };
      reader.onerror = (err) => {
        reject(err);
      };
    });
  }
};

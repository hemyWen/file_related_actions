export function matchTypes(filename: string): string {
  let suffix = "";
  try {
    let fileArr = filename.split(".");
    suffix = fileArr[fileArr.length - 1];
  } catch {
    suffix = "";
  }
  if (!suffix) {
    return "";
  }

  let suffixList: { [key: string]: string } = {
    png: "image",
    jpg: "image",
    jpeg: "image",
    bmp: "image",
    gif: "image",
    txt: "txt",
    xls: "excel",
    xlsx: "excel",
    pdf: "pdf",
    ppt: "ppt",
    mp4: "video",
    m2v: "video",
    mkv: "video",
    mp3: "mp3",
    wav: "mp3",
    wmv: "mp3",
    zip: "zip",
    rar: "zip",
    tar: "zip",
    doc: "word",
    docx: "word",
  };
  let suffixKeys = Object.keys(suffixList);
  let key = suffixKeys.find((item) => item === suffix);
  if (key) {
    return suffixList[key];
  } else {
    return "";
  }
}
export function getIconName(filename: string): string {
  if (filename) {
    const iconName: { [key: string]: string } = {
      image: "icon-image",
      txt: "icon-txtwenjian",
      excel: "icon-EXCEL",
      pdf: "icon-Pdf",
      ppt: "icon-ppt",
      video: "icon-video",
      mp3: "icon-mp",
      zip: "icon-ZIP",
      word: "icon-WORD",
    };
    return iconName[filename];
  } else {
    return "icon-wenjian";
  }
}
export function getFileUrl(file: any): Promise<any> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function () {
      const result = reader.result;
      resolve(result);
    };
    reader.readAsDataURL(file);
  });
}

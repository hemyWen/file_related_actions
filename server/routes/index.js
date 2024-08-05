var express = require('express');
var router = express.Router();
const multer = require('multer')
const path = require('path')
const fse = require('fs-extra')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, './uploadFiles')
  },
  filename (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({
  storage,
  fileFilter (req, file, callback) {
    // 解决中文名乱码的问题
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    callback(null, true);
  },
})
router.post('/upload', upload.single('file'), function (req, res, next) {
  try {
    const { fileHash, chunkIndex } = req.body;
    // 上传文件临时目录文件夹
    let tempFileDir = path.resolve('uploadFiles', fileHash);
    console.log(tempFileDir)
    // 如果当前文件的临时文件夹不存在，则创建该文件夹
    if (!fse.pathExistsSync(tempFileDir)) {
      fse.mkdirSync(tempFileDir)
    }
    // 如果无临时文件夹或不存在该切片，则将用户上传的切片移到临时文件夹里
    // 如果有临时文件夹并存在该切片，则删除用户上传的切片（因为用不到了）
    // 目标切片位置
    const tempChunkPath = path.resolve(tempFileDir, chunkIndex);
    // 当前切片位置（multer默认保存的位置）
    let currentChunkPath = path.resolve(req.file.path);
    if (!fse.existsSync(tempChunkPath)) {
      fse.moveSync(currentChunkPath, tempChunkPath)
    } else {
      fse.removeSync(currentChunkPath)
    }
    res.send({
      msg: '上传成功',
      success: true
    })
  } catch (error) {
    res.send({
      msg: '上传失败',
      success: false
    })
  }

});
router.get('/merge', async (req, res) => {
  const { fileHash, fileName } = req.query;
  // 最终合并的文件路径
  const filePath = path.resolve('uploadFiles', fileHash + path.extname(fileName));
  // 临时文件夹路径
  let tempFileDir = path.resolve('uploadFiles', fileHash);

  // 读取临时文件夹，获取所有切片
  const chunkPaths = fse.readdirSync(tempFileDir);

  // 将切片追加到文件中
  let mergeTasks = [];
  for (let index = 0; index < chunkPaths.length; index++) {
    mergeTasks.push(new Promise((resolve) => {
      // 当前遍历的切片路径
      const chunkPath = path.resolve(tempFileDir, index + '');
      // 将当前遍历的切片切片追加到文件中
      fse.appendFileSync(filePath, fse.readFileSync(chunkPath));
      // 删除当前遍历的切片
      fse.unlinkSync(chunkPath);
      resolve();
    }))
  }
  await Promise.all(mergeTasks);
  // 等待所有切片追加到文件后，删除临时文件夹
  fse.removeSync(tempFileDir);
  res.send({
    msg: "合并成功",
    success: true
  });
})
//1:已上传
//2:上传中
//3:未上传
router.get('/verify', (req, res) => {
  const { fileHash, fileName } = req.query;
  const filePath = path.resolve('uploadFiles', fileHash + path.extname(fileName));

  const exitFile = fse.pathExistsSync(filePath);
  if (exitFile) {
    res.send({
      msg: '文件已上传',
      code: 0
    })
  } else {
    const folderPath = path.resolve('uploadFiles', fileHash)
    const exitFolder = fse.pathExistsSync(folderPath);
    //同时返回该filehash文件夹最后一个切片序号(即上传到哪个切片)
    if (exitFolder) {
      const chunks = fse.readdirSync(folderPath)
      res.send({
        msg: '文件正在上传',
        code: 1,
        chunks
      })
    } else {
      res.send({
        msg: '文件未上传',
        code: 2
      })
    }
  }
})

module.exports = router;

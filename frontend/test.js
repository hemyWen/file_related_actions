// 切片上传
const slicesUpdate = (taskArrItem: taskArrItem, progressTotal = 100) => {
  // 一片都没有了,或者有正在请求中的接口,都直接不执行下边的逻辑,毕竟都有正在请求中的还上传,容易造成并发数高于浏览器限制
  if (taskArrItem.allData.length === 0 || taskArrItem.whileRequests.length > 0) { return }
  const isTaskArrIng = toRaw(taskArr.value).filter(itemB => itemB.state === 1 || itemB.state === 2)
  maxNumb = Math.ceil(6 / isTaskArrIng.length)  // 实时动态获取并发请求数,每次掉请求前都获取一次最大并发数
  const whileRequest = taskArrItem.allData.slice(-maxNumb)
  taskArrItem.allData.length > maxNumb ? taskArrItem.allData.length = taskArrItem.allData.length - maxNumb : taskArrItem.allData.length = 0
  taskArrItem.whileRequests.push(...whileRequest)
  for (const item of whileRequest) {
    isUpdate(item)
  }
  // 单个分片请求
  async function isUpdate (needObj: AllDataItem) {
    const fd = new FormData()
    const { file, fileMd5, sliceFileSize, index, fileSize, fileName, sliceNumber } = needObj
    fd.append('file', file as File)
    fd.append('fileMd5', fileMd5)
    fd.append('sliceFileSize', String(sliceFileSize))
    fd.append('index', String(index))
    fd.append('fileSize', String(fileSize))
    fd.append('fileName', fileName)
    fd.append('sliceNumber', String(sliceNumber))
    const res = await update(fd, (cancel) => { needObj.cancel = cancel }).catch(() => { })
    if (taskArrItem.state === 5 || taskArrItem.state === 3) { return }  // 你的状态都已经变成暂停或者中断了,就什么都不要再做了,及时停止
    // 请求异常,或者请求成功服务端返回报错都按单片上传失败逻辑处理,.then.catch的.catch是只能捕捉请求异常的
    if (!res || res.result === -1) {
      taskArrItem.errNumber++
      // 超过3次之后直接上传中断
      if (taskArrItem.errNumber > 3) {
        console.log('超过三次了')
        pauseUpdate(taskArrItem, false)  // 上传中断
      } else {
        console.log('还没超过3次')
        isUpdate(needObj)  // 失败了一片,单个分片请求
      }
    } else {
      const { result, data } = res
      if (result === 1) {
        sliceProgress(needObj, taskArrItem, progressTotal)  // 更新进度条
        taskArrItem.errNumber > 0 ? taskArrItem.errNumber-- : ''
        taskArrItem.finishNumber++
        needObj.finish = true
        taskArrItem.whileRequests = taskArrItem.whileRequests.filter(item => item.index !== needObj.index)  // 上传成功了就删掉请求中数组中的那一片
        console.log(taskArrItem.whileRequests.length, '请求成功了')
        if (taskArrItem.finishNumber === sliceNumber) {
          const resB = await mergeSlice(data).catch(() => { })
          resB && resB.result === 1 ? isFinishTask(taskArrItem) : pauseUpdate(taskArrItem, false)
          taskArrItem.finishNumber = 0
        } else {
          slicesUpdate(taskArrItem)
        }
      } else if (result === -2) {
        pauseUpdate(taskArrItem, false)
        message('服务器剩余容量不足! 请清空本地和服务器存储的文件')
      }
    }
  }
}

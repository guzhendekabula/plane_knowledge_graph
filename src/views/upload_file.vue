<template>
  <div class="file-upload-container">
    <img class="school-logo" src="@/assets/2.jpg" alt="badge">
    <el-button class="return" type="danger" @click="goBack">返回</el-button>
    <div class="header">
      <h1>文件智能分析系统</h1>
      <p>上传文档，使用DeepSeek AI分析内容</p>
    </div>

    <div class="upload-area" @dragover.prevent="onDragOver" @drop.prevent="onDrop">
      <div class="upload-content" :class="{ 'drag-active': isDragActive }">
        <el-icon class="upload-icon"><DocumentAdd /></el-icon>

        <h3>上传您的文件</h3>
        <p>拖放文件到这里，或点击选择文件</p>
        <p class="file-types">支持：TXT, PDF, DOC, DOCX, XLSX, PPTX (最大1MB)</p>
        
        <el-upload
          ref="uploadRef"
          class="upload-input"
          action=""
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleFileChange"
          :accept="allowedFileTypes"
        >
          <el-button type="primary" style="width: 150px; height: 45px; font-size: 20px">选择文件</el-button>
        </el-upload>
      </div>
    </div>

    <div class="file-list" v-if="selectedFile">
      <div class="file-item">
        <el-icon><Document /></el-icon>
        <span class="file-name">{{ selectedFile.name }}</span>
        <span class="file-size">({{ formatFileSize(selectedFile.size) }})</span>
        <el-button type="danger"  @click="removeFile">删除</el-button>
      </div>
    </div>

    <div class="actions">
      <el-button 
        type="primary" 
        style="width: 200px; height: 50px; font-size: 24px"
        color="#0066CC"
        :disabled="!selectedFile" 
        @click="uploadFile"
        :loading="isUploading"
      >
        开始分析
      </el-button>
    </div>

    <div class="footer">
      <p>© 2023 文件分析系统 | 使用DeepSeek AI技术</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DocumentAdd , Document } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router' // 导入路由
import { ElMessage } from 'element-plus'
import { onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const router = useRouter() // 获取路由实例
const uploadRef = ref(null)      //引用 el-upload 组件实例，用于调用组件方法
const isDragActive = ref(false)  //标记是否正在拖拽文件到上传区域
const selectedFile = ref(null)   //存储用户选择的文件对象
const isUploading = ref(false)   //标记文件是否正在上传中

const allowedFileTypes = '.txt,.pdf,.doc,.docx,.xlsx,.pptx'   //允许上传的文件扩展名列表
const maxFileSize = 1 * 1024 * 1024     // 最大文件大小限制(20MB)

const preventDefault = (e) => {
  e.preventDefault()     //阻止浏览器对拖拽事件的默认处理（如打开/下载文件）
}

onMounted(() => {
  // 阻止整个页面的默认拖放行为
  window.addEventListener('dragover', preventDefault, false)
  window.addEventListener('drop', preventDefault, false)
})

onUnmounted(() => {
  window.removeEventListener('dragover', preventDefault)
  window.removeEventListener('drop', preventDefault)
})

//当文件被拖到上传区域时触发，激活拖拽状态
const onDragOver = () => {
  isDragActive.value = true               
}

//当文件离开上传区域时触发，取消拖拽状态
//const onDragLeave = () => {
  //isDragActive.value = false            
//}

//当文件被放入上传区域时触发，获取拖放的文件并处理
const onDrop = (e) => {                   
  isDragActive.value = false
  const files = e.dataTransfer.files
  if (files.length > 0) {
    handleFile(files[0])
  }
}

//el-upload 组件的文件变化回调，提取原始文件对象
const handleFileChange = (file) => {      
  handleFile(file.raw)
}

const handleFile = (file) => {
  // 验证文件类型(检查扩展名是否在允许列表中)
  const fileExtension = file.name.split('.').pop().toLowerCase()
  const allowedExtensions = allowedFileTypes.split(',').map(ext => ext.replace('.', ''))
  
  if (!allowedExtensions.includes(fileExtension)) {
    ElMessage.error('不支持的文件类型')
    return
  }

  // 验证文件大小
  if (file.size > maxFileSize) {
    ElMessage.error('文件大小超过1MB限制')
    return
  }
  //存储验证通过后的文件
  selectedFile.value = file
}

//清除已选择的文件
const removeFile = () => {
  selectedFile.value = null
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
}

//将字节数转换为更易读的格式(如"1.5 MB")，自动选择合适的单位(Bytes/KB/MB/GB)
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

//上传文件
const uploadFile = async () => {
  if (!selectedFile.value) return

  isUploading.value = true
  ElMessage.success('文件成功上传，正在处理，请稍等30秒')
  try {
    // 创建FormData对象
    const formData = new FormData()
    formData.append('file', selectedFile.value) // 添加文件到表单数据
    
    // 发送POST请求到文件处理接口
    const response = await axios.post(
      '/api/process-file', // 使用代理路径 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data' // 设置正确的Content-Type
        }
      }
    )

    // 检查响应状态
    if (response.status === 200) {
      ElMessage.success('文件处理成功，正在跳转，请耐心等待...')
      
      // 文件处理成功后跳转到指定URL
      setTimeout(() => {
        window.location.href = 'http://47.115.45.110:7474/'
      }, 1500)
    } else {
      ElMessage.error('文件处理失败: ' + (response.data.message || '未知错误'))
    }
    
  } catch (error) {
    console.error('上传错误:', error)
    ElMessage.error('文件上传失败: ' + (error.response?.data?.message || error.message))
  } finally {
    isUploading.value = false
  }
}

//返回首页
const goBack = () => {
  //window.history.back(); // 使用浏览器历史记录返回
  // 或者使用路由返回：
  router.go(-1);
};

</script>

<style scoped>

.school-logo {
    position: absolute;  /* 绝对定位 */
    top: 53.59px;          /* 距离顶部 20px */
    left: 32.26px;         /* 距离左侧 20px */
    width: 85.35px;        /* 调整宽度 */
    height: auto;       /* 高度自适应 */
    z-index: 10;        /* 确保校徽在内容上方 */
  }

.return {
    position: absolute;  /* 绝对定位 */
    font-size: 16px;
    top: 74px;          /* 距离顶部 20px */
    right: 60px;         /* 距离左侧 20px */
    width: 100px;        /* 调整宽度 */
    height:45px;       /* 高度自适应 */
    z-index: 10;        /* 确保校徽在内容上方 */
  }

.file-upload-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.header {
  margin-bottom: 2rem;
  background-color:#409eff
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.header p {
  color: #fef6f6;
}

.upload-area {
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.drag-active {
  border-color: #409eff;
  background-color: rgba(64, 158, 255, 0.05);
}

.upload-icon {
  font-size: 3rem;
  color: #316ff4;
}

.file-types {
  color: #909399;
  font-size: 0.9rem;
}

.upload-input {
  margin-top: 1rem;
}

.file-list {
  margin-bottom: 1.5rem;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.file-name {
  font-weight: 500;
}

.file-size {
  color: #909399;
  font-size: 0.9rem;
}

.actions {
  margin-bottom: 2rem;
}

.footer {
  color: #909399;
  font-size: 0.9rem;
  margin-top: 2rem;
}
</style>
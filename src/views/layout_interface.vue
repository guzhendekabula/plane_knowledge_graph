<template>
  <div class="layout" :class="{ 'no-bg': isuploadfileRoute }">
    
    <div v-if="isuploadfileRoute">
      <router-view></router-view>
    </div>
    <div v-if="!isuploadfileRoute" class="common-layout">
      <img class="school-logo" src="@/assets/2.jpg" alt="badge">
      <h1 class="main-title">欢迎使用智能飞机知识图谱小工具</h1>
      <div class="start_button">
      <el-button plain @click="dialogVisible = true" style="width: 150px; height: 45px; font-size: 20px">查看帮助</el-button>
      <el-dialog
    v-model="dialogVisible"
    title="帮助"
    width="400"
    style="margin-top: 300px;" 
    :before-close="handleClose"
  >
    <span>在这里，你可以上传飞机的设计文档给我们，我们帮你用AI生成一个可以直接使用的飞机知识图谱</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </div>
    </template>
  </el-dialog>
      <el-button  type="primary" style="width: 150px; height: 45px; font-size: 20px; margin-left: 100px;" @click="goToUploadfile">开始</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 响应式数据
const isuploadfileRoute = ref(false)
const dialogVisible = ref(false)

// 检查路由
const checkRoute = (currentRoute) => {
  const isuploadfileRouteList = ['upload_file']
  isuploadfileRoute.value = isuploadfileRouteList.includes(currentRoute.name)
}

// 路由变化监听
watch(() => route, (newRoute) => {
  checkRoute(newRoute)
}, { immediate: true, deep: true })

// 导航方法
const goToUploadfile = () => {
  router.push({ name: 'upload_file' })
}

// 对话框关闭处理
const handleClose = (done) => {
  ElMessageBox.confirm('确定要关闭对话框吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  .then(() => done())
  .catch(() => {})
}

// 初始化检查路由
onMounted(() => {
  checkRoute(route)
})
</script>

<style lang='stylus' scoped>
body, html {
  margin: 0
  padding: 0
  height: 100%
}

.layout {
  position: relative
  min-height: 100vh
  width: 100%
  overflow: hidden
  
  &::before {
    content: ''
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: linear-gradient(rgba(0, 100, 200, 0.3), rgba(0, 100, 200, 0.3)), 
                url('~@/assets/background.png')
    background-size: cover
    background-position: center
    z-index: -1
    animation: slideFromLeft 3s cubic-bezier(0.22, 1, 0.36, 1) forwards
  }
  
  &.no-bg::before {
    display: none
  }
}

/* 从左到右滑动动画 */
@keyframes slideFromLeft {
  0% {
    clip-path: inset(0 100% 0 0);  /* 右侧100%被裁剪 */
  }
  100% {
    clip-path: inset(0 0 0 0);     /* 完全显示 */
  }
}

.school-logo {
  position: fixed
  top: 0px
  left: 0px
  width: 100px
  height: auto
  z-index: 10
  animation: fadeIn 0.5s 1s both; /* 延迟显示校徽 */
}

.start_button{
  margin-top: 180px

}

.common-layout {
  display: flex
  flex-direction: column
  align-items: center
  height: 100vh
  color: white
  margin-top: 150px
  font-weight: bold
  animation: fadeIn 0.8s 0.8s both; /* 内容延迟淡入 */
}

@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}

.main-title {
  font-weight: bold;
  font-size: 60px;  
}


</style>



import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../views/layout_interface.vue'

const routes = [
  {
    path:"/",
    name:"Layout",
    component:Layout,
    children:[
        {
            path: 'upload_file',
            name: 'upload_file',
            component: ()=>import("../views/upload_file.vue")
        }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

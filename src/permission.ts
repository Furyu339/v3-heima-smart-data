// 权限控制
import router from './router'
import { getLocalToken } from './utils/auth'

const WHITE_LIST = ['/login', '/404']
router.beforeEach((to, from, next) => {
  const token = getLocalToken()
  // 有token
  if (token) {
    next()
  } else {
    // 没有token
    if (WHITE_LIST.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const userInfo = store.getters && store.getters.userInfo || {}
    const roles = userInfo.roles || []
    const permissions = userInfo.permissions || []
    if (value && value instanceof Array && value.length > 0) {
      let hasPermission
      if(roles.includes('admin')){
        hasPermission = true
      }else{
        hasPermission = value.some(p => {
          return permissions.includes(p)
        })
      }

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`使用方式： v-permission="['admin','editor']"`)
    }
  }
}

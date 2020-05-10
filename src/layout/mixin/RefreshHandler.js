// import store from '@/store'

export default {
  beforeMount() {
    window.addEventListener('beforeunload', this.$_unloadHandler)
    this.$_loadVisitedViews()
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.$_unloadHandler)
  },
  methods: {
    $_loadVisitedViews() {
      const visitedViews = JSON.parse(localStorage.getItem('visitedViews') || '[]')
      const visitedViewsName = visitedViews.map(v => { return v.name })
      if (!visitedViews.length) return
      this.$store.state.permission.routes.map(v => {
        if (v.children) {
          v.children.map(vv => {
            if (visitedViewsName.includes(vv.name)) {
              const localView = visitedViews.find(x => {
                return x.name === vv.name
              })
              const view = Object.assign({}, vv, localView)
              this.$store.dispatch('tagsView/addVisitedView', view)
            }
          })
        }
      })
    },
    $_unloadHandler: function(e) {
      e.preventDefault()
      // e.returnValue = ('确定离开当前页面吗？')
      const visitedViews = this.$store.state.tagsView.visitedViews.map(v => {
        return {
          name: v.name,
          title: v.title || v.meta.title,
          path: v.path,
          params: v.params
        }
      })
      localStorage.setItem('visitedViews', JSON.stringify(visitedViews))
    }
  }
}

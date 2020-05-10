const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  userInfo: state => state.user.userinfo,
  roles: state => state.user.userinfo.roles,
  permission_routes: state => state.permission.routes,
  userPermissions: state => state.user.userinfo.permissions || [],
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  errorLogs: state => state.errorLog.logs,
  siteConfig: state => state.settings.siteConfig,
  theme: state => state.settings.theme,
  colorVariables: state => state.settings.colorVariables
}
export default getters

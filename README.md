# vue-admin
```
git clone https://github.com/anZong/vue-admin
cd vue-admin
npm i
```
## 登录
账号： admin or editor
密码：任意

## mock设置
```javascript
devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // proxy: {
    //   [process.env.VUE_APP_BASE_API]: {
    //     target: process.env.NODE_ENV === 'production' ? defaultSettings.server : defaultSettings.devServer,
    //     changeOrigin: true,
    //     ws: true,
    //     secure: false
    //   }
    // },
    before: require('./mock/mock-server')
}
```
默认关闭代理，方便使用mock.js本地调试，和后端对接口时需要打开代理，关闭before

### 本地模拟后端接口
```
cd mock
```
```javascript
export default [
  // login
  {
      url: '/api/login',
      type: 'post',
      response: req =>{
        const {username} = req.body
        const token = tokens[username]
        // mock error
        if(!token){
          return {
            status: 60204,
            message: 'Account and password are incorrect.'
          }
        }
  
        return {
          status: 200,
          data: {
            token: token.token,
            user: users[`${username}-token`]
          }
        }
      }
    }
  ]
```

### 自定义主题
```
cd src/styles/themes
```
创建主题文件夹，从`default`目录拷贝`colors.scss`和`index.scss`，修改`colors.scss`文件中的`theme color`
```
$--color-primary: #394d66;
$--color-success: #346559;
$--color-warning: #FF8C6B;
$--color-danger: #FF6639;
$--color-info: #7791B3;
```
```
cd layout/components/Settings/index.vue
```
引入刚才新建的主题
```javascript
import defaultTheme from '@/styles/themes/default/colors.scss';
import Theme1 from '@/styles/themes/theme1/colors.scss';
import Theme2 from '@/styles/themes/theme2/colors.scss';
import Theme3 from '@/styles/themes/theme3/colors.scss';
import Theme4 from '@/styles/themes/theme4/colors.scss';
```
在`data`的`themes`中添加
```
[
  {name: '默认主题', theme: 'default', color: defaultTheme},
  {name: '春暖花开', theme: 'theme1', color: Theme1},
  {name: '夏日炎炎', theme: 'theme2', color: Theme2},
  {name: '秋高气爽', theme: 'theme3', color: Theme3},
  {name: '银装素裹', theme: 'theme4', color: Theme4},
]
```




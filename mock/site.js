import {users} from './user'

const siteConfig = {

}

let getFields = function(modelname) {
  let fields = []
  switch (modelname){
    case 'User':
      fields = [
        {verbose_name: '姓名', name: 'name', width: 150, type: ''},
        {verbose_name: '用户名', name: 'username', width: 100, type: ''},
        {verbose_name: '昵称', name: 'nickname', width: 100, type: ''},
        {verbose_name: '头像', name: 'avatar', width: 80, type: 'ImageField'},
        {verbose_name: '简介', name: 'introduction', width: 200, type: ''},
      ]
      break;
    case 'Role':
      fields = [
        {verbose_name: '角色名称', name: 'name', width: 200, type: ''},
        {verbose_name: '角色', name: 'ename', width: 200, type: ''},
      ]
      break;
  }
  return fields
}

let getList = function(modelname) {
  let list = []
  switch (modelname){
    case 'User':
      list = Object.values(users)
      break;
    case 'Role':
      list = [{
        name: '管理员',
        ename: 'admin'
      },{
        name: '业务员',
        ename: 'editor'
      }]
      break;
  }
  return list
}

export default [
  // code
  {
    url: '/api/getSiteConfig',
    type: 'get',
    response: config =>{
      return {
        status: 200,
        data: {
          siteConfig: siteConfig
        }
      }
    }
  },
  // getModelFields
  {
    url: '/api/getModelFields',
    type: 'post',
    response: req =>{
      let {modelname} = req.body
      return {
        status: 200,
        data:{
          fields: getFields(modelname)
        }
      }
    }
  },
  // getModelList
  {
    url: '/api/getModelList',
    type: 'post',
    response: req => {
      let {modelname} = req.body
      return {
        status: 200,
        data:{
          list: getList(modelname),
          total: 10
        }
      }
    }
  }
]

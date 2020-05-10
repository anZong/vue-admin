const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

export const users = {
  'admin-token': {
    roles: ['admin'],
    permissions: [],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    username: 'zongan',
    nickname: 'Zong'
  },
  'editor-token': {
    roles: ['editor'],
    permissions: [],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor',
    username: 'yangl',
    nickname: 'Yang'
  }
}

export default [
  // code
  {
    url: '/api/authsys/code',
    type: 'get',
    response: config =>{
      return {
        status: 200,
        data: {
          codeUrl: '/code.png'
        }
      }
    }
  },
  // user login
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
  },
  // get user info
  {
    url: '/api/userInfo',
    type: 'get',
    response: req =>{
      const token = req.headers.authorization
      const info = users[token]

      // mock error
      if(!info){
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },
  // save userinfo
  {
    url: '/api/saveProfile',
    type: 'post',
    response: req =>{
      const token = req.headers.authorization
      const info = users[token]

      return {
        code: 20000,
        data: info
      }
    }
  },
  // user logout
  {
    url: '/api/logout',
    type: 'post',
    response: req =>{
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

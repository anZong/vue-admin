<template>
  <div class="app-container">
    <el-row>
      <el-col :span="2">
        <div class="item-name">头像</div>
      </el-col>
      <el-col :span="5">
        <ximage :max="1" :urls.sync="avatar"></ximage>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <div class="item-name">用户名</div>
      </el-col>
      <el-col :span="5">
        <el-input type="text" disabled :value="username" :max-length="20"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <div class="item-name">昵称</div>
      </el-col>
      <el-col :span="5">
        <el-input type="text" v-model="nickname" :max-length="20"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <div class="item-name">角色</div>
      </el-col>
      <el-col :span="5">
        <el-input type="text" disabled :value="roles|toStr"></el-input>
      </el-col>
    </el-row>
    <save :onSave="saveHandler"></save>
  </div>
</template>

<script>
  import XImage from '@/components/XImage'
  import Save from '@/components/Save'

  export default {
    name: 'Profile',
    components: {
      'ximage': XImage,
      'save': Save
    },
    filters:{
      toStr(arr){
        if(!arr) arr = []
        return arr.join(',')
      }
    },
    data() {
      var userInfo = this.$store.getters.userInfo
      return {
        avatar: userInfo.avatar,
        username: userInfo.username,
        nickname: userInfo.nickname,
        roles: userInfo.roles,
      }
    },
    methods: {
      saveHandler() {
        this.$store.dispatch('user/save', {nickname:this.nickname, avatar: this.avatar}).then(()=>{
          this.$message.success('保存成功')
        }).catch(err=>{
          this.$message.error(err)
        })
      }
    }
  }
</script>

<style scss scoped>

</style>

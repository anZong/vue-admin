<template>
    <div class="app-container">
      <el-row>
        <el-col :span="2">
          <div class="item-name">原密码</div>
        </el-col>
        <el-col :span="5">
          <el-input type="password" v-model="raw_password" placeholder="请输入原来的密码" clearable></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">
          <div class="item-name">新密码</div>
        </el-col>
        <el-col :span="5">
          <el-input type="password" v-model="password" placeholder="字母数字下划线组成，不小于8位" :minlength="8" clearable></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">
          <div class="item-name">重复密码</div>
        </el-col>
        <el-col :span="5">
          <el-input type="password" v-model="re_password" placeholder="请重复一遍密码" :minlength="8" clearable></el-input>
        </el-col>
      </el-row>
      <save :onSave="saveHandler"></save>
    </div>
</template>

<script>
  import Save from '@/components/Save'
  import { changePassword } from "@/api/user";

  export default {
    name: 'Password',
    components: {
      'save': Save
    },
    data() {
      return {
        raw_password: '',
        password: '',
        re_password: ''
      }
    },
    methods:{
      saveHandler: function(){
        if(!this.raw_password){
          this.$message.warning('原密码不能为空')
          return
        }
        if(this.password.length < 8){
          this.$message.warning('密码长度不能小于8位')
          return
        }
        if(this.password != this.re_password){
          this.$message.error('两次密码输入不一致')
          return
        }
        if(this.raw_password == this.password){
          this.$message.warning('新密码和原密码一样')
          return
        }
        changePassword({raw_password:this.raw_password, password:this.password}).then(async(res)=>{
          this.$message.success('密码修改成功')
          await this.$store.dispatch('user/logout').then(res=>{})
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        }).catch(err=>{
          console.log(err)
        })
      }
    }
  }
</script>

<style scss scoped>
  .el-row{
    margin: 10px 0;
  }
</style>

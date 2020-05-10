<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      上传图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        accept="image/jpg, image/png, image/jpeg, image/icon"
        :action="uploadUrl"
        :data="dataObj"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">
          点击上传
        </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确认
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/api/qiniu'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    const siteConfig = this.$store.getters.siteConfig
    return {
      dialogVisible: false,
      dataObj: {
        token: '',
        key: ''
      },
      uploadUrl: siteConfig.qiniu_upload_url,
      qiniu_root: siteConfig.qiniu_root_url,
      fileList: []
    }
  },
  methods: {
    checkAllSuccess() {
      return this.fileList.every(item => item.status == "success")
    },
    handleSubmit() {
      if (!this.checkAllSuccess()) {
        this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
        return
      }
      this.$emit('successCBK', this.fileList)
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      this.fileList.push({
        name: file.name,
        uid: file.uid,
        url: this.qiniu_root +'/'+ file.name
      })
    },
    handleRemove(file) {
      const uid = file.uid
      const index = this.fileList.findIndex(v => {
        return v.uid == uid
      })
      this.fileList.splice(index,1)
    },
    checkFile(file){
      const isLt2M = file.size / 1024 / 1024 < 10;
      if(!isLt2M) {
        this.$message.error('上传文件大小不能超过 10MB!');
      }
    },
    beforeUpload(file) {
      this.checkFile(file)
      let _self = this
      let files = this.fileList.map( v=> {
        return v.name
      })
      if (files.includes(file.name)){
        this.$message.warning('图片已经存在，请勿重复上传!')
        return false
      }
      return new Promise(resolve => {
        getToken().then(response => {
          _self.dataObj.token = response.data.qiniu_token
          _self.dataObj.key = file.name
          resolve(true)
        })
      }).catch(err => {
        console.log(err)
        reject(false)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>

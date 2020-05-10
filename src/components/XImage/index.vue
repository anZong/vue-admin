<template>
  <div :class="{'el-upload-hide': hideUpload}">
    <el-upload
      class="avatar-uploader"
      :class="imageClass"
      list-type="picture-card"
      :show-file-list="true"
      :multiple="multiple && max > 1"
      :on-success="handleUploadSuccess"
      :before-upload="beforeUpload"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :limit="max"
      :disabled="disabled"
      :data="dataObj"
      accept="image/jpg, image/png, image/jpeg, image/icon"
      :file-list="fileList"
      :action="uploadUrl">
      <i v-if="fileList.length<max" class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import { getToken } from '@/api/qiniu'

  export default {
    name: 'XImage',
    props: {
      name: {
        type: String,
        default: 'ximage'
      },
      multiple: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      max: {
        type: Number,
        default: 1
      },
      urls: {
        type: String,
        default: ''
      },
      ratio: {
        type: String,
        default: '1:1'
      },
      w: {
        type: Number,
        default: 178
      },
      h: {
        type: Number,
        default: 178
      },
      radius: {
        type: Number,
        default: 2
      }
    },
    data() {
      const siteConfig = this.$store.getters.siteConfig
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        dataObj: {token: '', key: ''},
        uploadUrl: siteConfig.upload_url || '',
        qiniu_root: siteConfig.root_url || '',
        hideUpload: false,
        fileList: []
      }
    },
    computed: {
      imageClass(){
        let str = ''
        switch (this.ratio){
          case '1:2': str = 'ratio-1-2';break;
          case '1:1':   str = 'ratio-1';break;
          case '4:3': str = 'ratio-4-3';break;
          case '16:9': str = 'ratio-16-9';break;
          case '2:1':   str = 'ratio-2-1';break;
        }
        return str
      }
    },
    watch: {
      urls: function (n, o) {
        if(!o){
          this.urlsChange()
        }
      }
    },
    methods: {
      checkFile(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if(!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
      },
      beforeUpload(file) {
        this.checkFile(file)
        let _self = this
        let files = this.fileList.map(v => {
          return v.name
        })
        if(files.includes(file.name)) {
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
      handleUploadSuccess(res, file) {
        this.fileList.push({
          name: file.name,
          uid: file.uid,
          url: this.qiniu_root + '/' + file.name
        })
        let urls = this.fileList.map(v => {
          return v.url.replace(this.qiniu_root+'/', '')
        }).join(';')
        this.$emit('update:urls', urls)
      },
      handleChange(file, fileList) {
        this.hideUpload = fileList.length < this.max ? false : true
      },
      handleRemove(file, fileList) {
        this.fileList = fileList
        let urls = fileList.map(v => {
          return v.url.replace(/this.qiniu_root+\'\/\'/g, '')
        }).join(';')
        this.$emit('update:urls', urls)
        this.handleChange(file, fileList)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      urlsChange(){
        let urls = this.urls.split(';').filter(v => {
          return String(v)
        }).map(v=>{
          if(v.startsWith('http://') || v.startsWith('https://')){
            this.fileList.push({url: v})
          }
          return v.replace(this.qiniu_root+'/', '')
        }).join(';')
        this.hideUpload = this.fileList.length < this.max ? false : true
        this.$emit('update:urls', urls)
      }
    },
    mounted() {
      this.urlsChange()
    }
  }
</script>

<style>
  .el-upload-hide .el-upload {
    display: none;
  }
</style>

<style lang="scss">
  $image-width: 148px;
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -14px;
    margin-left: -14px;
  }

  .avatar {
    width: $image-width;
    height: $image-width;
    display: block;
  }

  .ratio-1-2{
    .el-upload-list--picture-card .el-upload-list__item,.avator,.el-upload--picture-card{
      width: $image-width;
      height: 1.5*$image-width;
    }
  }
  .ratio-2-1 {
    .el-upload-list--picture-card .el-upload-list__item,.avatar,.el-upload--picture-card{
      width: 2*$image-width;
    }
  }
  .ratio-4-3 {
    .el-upload-list--picture-card .el-upload-list__item, .avatar, .el-upload--picture-card{
      width: 1.3*$image-width;
    }
  }
  .ratio-16-9 {
    .el-upload-list--picture-card .el-upload-list__item, .avatar, .el-upload--picture-card{
      width: 1.7*$image-width;
    }
  }
</style>

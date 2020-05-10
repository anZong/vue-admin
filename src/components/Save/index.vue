<template>
  <div class="save">
    <div class="btns">
      <el-button type="primary" plain @click="onSave">保存</el-button>
      <el-button type="info" plain @click="handlerClose">关闭</el-button>
    </div>
    <div class="btns-right" v-if="showRightBar">
      <el-button type="primary" icon="el-icon-check" circle @click="onSave"></el-button>
      <el-button type="info" icon="el-icon-close" circle @click="handlerClose"></el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Save',
    props: {
      onSave: {
        type: Function,
        default: () => {
        }
      },
      showRightBar:{
        type: Boolean,
        default: false
      }
    },
    data() {
      return {}
    },
    methods: {
      handlerClose() {
        let view = this.$route
        this.$confirm('确定要关闭吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$store.dispatch('tagsView/delView', view).then(({visitedViews}) => {
            const latestView = visitedViews.slice(-1)[0]
            if(latestView) {
              this.$router.push(latestView)
            } else {
              // now the default is to redirect to the home page if there is no tags-view,
              // you can adjust it according to your needs.
              if(view.name === 'Dashboard') {
                // to reload home page
                this.$router.replace({path: '/redirect' + view.fullPath})
              } else {
                this.$router.push('/')
              }
            }
          })
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消'
          });
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .save {
    margin-top: 50px;
    margin-left: 20px;
  }

  .btns-right {
    position: fixed;
    top: 50%;
    right: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .el-button + .el-button {
      margin-left: 0;
      margin-top: 10px;
    }
  }
</style>

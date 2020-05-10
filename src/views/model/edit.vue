<template>
    <div class="app-container edit-page">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 80%; margin-left:50px;">
        <template v-for="(field, index) in fields">
          <el-form-item v-if="!field.hidden" :label="field.verbose_name" :prop="field.name">
            <el-checkbox-group v-model="temp[field.name]" v-if="field.type == 'DataDicsField'">
              <el-checkbox v-for="(item,index) in field.choices" :label="item.key" :key="item.key">{{ item.value }}</el-checkbox>
            </el-checkbox-group>
            <el-cascader v-else-if="field.type == 'Cascader'" :options="field.choices" v-model="temp[field.name]" filterable clearable></el-cascader>
            <el-select v-else-if="field.choices && field.choices.length || field.type == 'ForeignKey' || field.type == 'DataDicField' || field.type == 'ManyToManyField'" v-model="temp[field.name]" :multiple="field.type === 'ManyToManyField'" clearable filterable class="filter-item" placeholder="请选择">
              <el-option v-for="item in field.choices" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
            <el-date-picker v-else-if="field.type == 'DateTimeField'" v-model="temp[field.name]" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择时间" />
            <el-date-picker v-else-if="field.type == 'DateField'" v-model="temp[field.name]" value-format="yyyy-MM-dd" type="date" placeholder="请选择日期" />
            <el-transfer v-else-if="field.name=='permissions'" :titles="['所有权限','当前用户权限']" v-model="temp['permissions']" :data="permissions"></el-transfer>
            <el-input v-else-if="field.type == 'TextField'" v-model="temp[field.name]" placeholder="请输入" />
            <el-input v-else-if="field.type == 'LargeTextField'" v-model="temp[field.name]" :autosize="{ minRows: 5, maxRows: 10}" type="textarea" placeholder="请输入" />
            <el-input v-else-if="field.type == 'JsonField'" v-model="temp[field.name]" :autosize="{ minRows: 10, maxRows: 50}" type="textarea" placeholder="请输入" />
            <ximage v-else-if="field.type == 'ImageField'" :name="field.name" :max="1" :ratio="field.ratio" :urls.sync="temp[field.name]"></ximage>
            <ximage v-else-if="field.type == 'ImagesField'" :name="field.name" :max="field.max" :ratio="field.ratio" :urls.sync="temp[field.name]"></ximage>
            <el-input v-else-if="field.type == 'IntegerField' || field.type == 'DecimalField' || field.type == 'FloatField'" type="number" v-model="temp[field.name]" />
            <el-input v-else-if="field.name == 'password'" type="password" v-model="temp[field.name]" />
            <el-switch v-else-if="field.type == 'BooleanField'" v-model="temp[field.name]" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            <tinymce v-else-if="field.type == 'FullTextField'" v-model="temp[field.name]" :height="500" menubar=""/>
            <el-input v-else v-model="temp[field.name]"/>
          </el-form-item>
        </template>
      </el-form>
      <save :onSave="saveHandler"></save>
    </div>
</template>

<script>
  import XImage from '@/components/XImage'
  import Save from '@/components/Save'
  import Tinymce from '@/components/Tinymce'
  import { getModelFields, getModelList, getInstance, saveInstance } from '@/api/base'
  import EditModelMixin from '@/views/model/mixin/EditModelMixin'
  import { param2Obj, obj2Param } from '@/utils'

  export default {
    name: 'EditModel',
    components: {
      'ximage': XImage,
      Save,
      Tinymce
    },
    mixins: [EditModelMixin],
    data() {
      return {
        baseData:{},
        fields: [],
        rules:{},
        temp: {}
      }
    },
    computed:{
      permissions: function () {
        const permissions = []
        this.$store.state.settings.siteConfig.permissions.map(v=>{
          permissions.push({
            key: v.key,
            label: v.value
          })
          v.children.map(vv => {
            permissions.push({
              key: vv.key,
              label: vv.value
            })
          })
        })
        return permissions
      }
    },
    methods: {
      updateListView(){
        const list_route_name = this.$route.meta.listPage
        if (!list_route_name) return
        const list_view = this.$store.state.tagsView.visitedViews.find(v => {
          return v.name == list_route_name
        })
        this.$store.dispatch('tagsView/delCachedView', list_view).then(() => {
          const { fullPath } = list_view
          const url = fullPath.split('?')[0]
          const params = param2Obj(fullPath)
          const t = Date.now()
          params['t'] = t
          this.$nextTick(() => {
            this.$router.replace({
              path: url + '?' + obj2Param(params)
            })
          })
        })
      },
      saveHandler(){
        let data = Object.assign({}, this.temp)
        if(data.hasOwnProperty('permissions')){
          data.permissions = data.permissions.join(',')
        }
        saveInstance(Object.assign(this.baseData, {
          data: JSON.stringify(data),
          editPage: true
        })).then(res=>{
          this.temp.id = res.data.id
          this.$confirm('保存成功，是否关闭当前页面？', '提示', {
            type: 'info'
          }).then(()=>{
            this.$store.dispatch('tagsView/delView', this.$route).then(({visitedViews}) => {
              const latestView = visitedViews.slice(-1)[0]
              this.updateListView()
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
          })
        }).catch(err=>{
          this.$message.error(err)
        })
      }
    },
    beforeRouteEnter(to, from, next){
      let id = Number.parseInt(to.params.id)
      let str = id ? '编辑' : '创建'
      let title = str + to.meta.verbose_name
      if(id){
        title += `(ID:${id})`
      }
      to.params.title = title
      next()
    },
    beforeMount(){
      this.baseData = {
        app_label: this.$route.meta.app_label,
        modelname: this.$route.meta.modelname,
        id: 0
      }
    },
    mounted(){
      this.getEditFields().then(res=>{
        this.fields = res
      })
      this.id = Number.parseInt(this.$route.params.id)
      if(this.id){
        this.baseData.id = this.id
        this.getData({id: this.id})
      }
    }
  }
</script>
<style lang="scss">
  .edit-page{
    .el-input__inner{
      width: 250px;
    }
    .el-textarea__inner{
      width: 500px;
    }
  }
</style>

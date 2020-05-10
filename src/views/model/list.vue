<template>
  <div class="app-container xtable">
      <div class="filter-container" v-if="selects && selects.length">
        <template v-for="select in selects">
          <el-select v-if="select.type == 'select' || !select.type" v-model="select.value" :placeholder="select.label" clearable :style="'width:'+ (select.width || 100) +'px'" class="filter-item" @change="handleFilter"  size="small">
            <el-option v-for="item in select.options" :key="select.name+'-'+item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span class="label" v-if="select.type == 'date'">{{ select.label }}</span>
          <el-date-picker
            v-if="select.type == 'date'"
            v-model="select.value"
            type="daterange"
            align="right"
            unlink-panels
            :picker-options="pickerOptions"
            @change="handleFilter"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </template>
        <template v-if="kw">
          <el-input v-model="search" placeholder="请输入关键字" style="width: 200px;" class="filter-item" size="small" @keyup.enter.native="handleFilter" clearable @clear="clearSearch"/>
          <el-button v-waves class="filter-item" icon="el-icon-search" size="small" @click="handleFilter">搜索</el-button>
        </template>
        <el-button v-if="showAdd" v-permission="['add']" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" size="small" @click="handleCreate">增加</el-button>
        <el-button v-if="showAdd" v-permission="['del']" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" size="small" @click="handleBatchDelete">删除</el-button>
        <el-button v-if="needAudit" v-permission="['audit']" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-check" size="small" @click="handleAudit(1)">批量审核通过</el-button>
        <el-button v-if="needAudit" v-permission="['audit']" class="filter-item" style="margin-left: 10px;" type="warning" icon="el-icon-close" size="small" @click="handleAudit(-1)">批量拒绝</el-button>
        <el-button v-if="showExport" v-permission="['export']" v-waves :loading="downloadLoading" class="filter-item" type="info" icon="el-icon-download" size="small" @click="handleDownload">导出</el-button>
      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        border
        :height="tableHeight"
        :max-height="tableHeight"
        highlight-current-row
        :summary-method="getSummaries"
        show-summary
        :fit="false"
        stripe
        style="width: 100%;"
        :default-sort = "{prop: 'id', order: 'descending'}"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
        row-key="id">
        <el-table-column
          type="selection"
          width="60"
          align="center"
          fixed
          v-if="showSelect">
        </el-table-column>
        <el-table-column type="expand" v-if="enableExpend">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand" v-for="(item,index) in scope.row['expandData']">
              <el-form-item :label="item.name">
                <span>{{ item.value }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column v-for="field in fields" :label="field.verbose_name" :prop="field.name" :width="field.width" show-overflow-tooltip :sortable="field.sort_able ? 'custom' : false" align="center">
          <template slot-scope="scope">
            <img v-if="field.type == 'ImageField'" :src="scope.row[field.name]" class="list-image" alt="">
            <span v-else-if="field.type == 'BooleanField'" class="table-cell">{{ scope.row[field.name] ? '是' : '否'}}</span>
            <span v-else class="table-cell">{{ scope.row[field.name] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" :width="needAudit ? 200 : 100" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button v-permission="['edit']" type="success" size="mini" icon="el-icon-edit" circle @click="handleUpdate(row)"></el-button>
            <el-button v-if="row.status!='deleted'" v-permission="['del']" icon="el-icon-delete" circle size="mini" type="danger" @click="handleDelete(row)"></el-button>
            <el-button v-if="needAudit && !row.__audit__" v-permission="['audit']" style="margin-top: 10px;" type="primary" icon="el-icon-check" circle size="mini" @click="handleAudit(1, row.id)"></el-button>
            <el-button v-if="needAudit &&  !row.__audit__" v-permission="['audit']" style="margin-top: 10px;" type="warning" icon="el-icon-close" circle size="mini" @click="handleAudit(-1, row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getListData" />
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
          <template v-for="field in editFields">
            <el-form-item :label="field.verbose_name" :prop="field.name">
              <el-select v-if="field.choices && field.choices.length || field.type == 'ForeignKey'" v-model="temp[field.name]" class="filter-item" placeholder="请选择" clearable filterable>
                <el-option v-for="item in field.choices" :key="item.key" :label="item.value" :value="item.key" />
              </el-select>
              <el-date-picker v-else-if="field.type == 'DateTimeField'" v-model="temp[field.name]" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择时间" />
              <el-date-picker v-else-if="field.type == 'DateField'" v-model="temp[field.name]" value-format="yyyy-MM-dd" type="date" placeholder="请选择日期" />
              <el-transfer v-else-if="field.name=='permissions'" :titles="['所有权限','当前用户权限']" v-model="temp['permissions']" :data="permissions"></el-transfer>
              <el-input v-else-if="field.type == 'TextField'" v-model="temp[field.name]" :autosize="{ minRows: 1, maxRows: 1}" type="textarea" placeholder="请输入" />
              <el-input v-else-if="field.type == 'LargeTextField'" v-model="temp[field.name]" :autosize="{ minRows: 5, maxRows: 10}" type="textarea" placeholder="请输入" />
              <ximage ref="ximage" v-else-if="field.type == 'ImageField'" :name="field.name" :max="1" :urls.sync="temp[field.name]"></ximage>
              <ximage ref="ximage" v-else-if="field.type == 'ImagesField'" :name="field.name" :max="10" :urls.sync="temp[field.name]"></ximage>
              <el-input v-else-if="field.type == 'IntegerField' || field.type == 'DecimalField' || field.type == 'MoneyField' || field.type == 'FloatField'" type="number" style="width: 100px" v-model="temp[field.name]" />
              <el-input v-else-if="field.name == 'password'" type="password" v-model="temp[field.name]" />
              <el-switch v-else-if="field.type == 'BooleanField'" v-model="temp[field.name]" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
              <el-input v-else v-model="temp[field.name]"/>
            </el-form-item>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { getModelFields, getModelList, delRows,saveInstance } from '@/api/base'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import XImage from '@/components/XImage'
  import EditModelMixin from '@/views/model/mixin/EditModelMixin'
  import request from '@/utils/request'

  export default {
    name: 'ModelList',
    components: {
      'ximage': XImage,
      Pagination
    },
    directives: { waves },
    mixins: [EditModelMixin],
    data() {
      return {
        baseData: {},
        editPage: '',
        kw: '',
        showSelect: true,
        showAdd: true,
        showExport: true,
        selects: [],  // 选择过滤参数
        page: 1,
        limit: 20,
        downloadLoading: false,
        listLoading: false,
        fields: [],
        summary_fields: [],
        sums: {},
        editFields: [],
        list: [],
        total: 0,
        search: '',
        model_verbose_name: '',
        temp: {},
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        selectRows: [],   //选中的行
        enableExpend: false, //是否允许展开行
        needAudit: false,
        auditApi: '',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      }
    },
    watch:{
      dialogFormVisible(n, o){
        if(!n){
          let ximage = this.$refs.ximage
          if(ximage && ximage.length>=1) {
            ximage[0].fileList = []
          }
        }
      }
    },
    computed: {
      tableHeight(){
        const window_height = document.body.clientHeight
        return window_height-200
      }
    },
    methods: {
      getListFields: function () {
        getModelFields(this.baseData).then(res=>{
          this.fields = res.data.fields
          this.summary_fields = res.data.summary_fields || []
          this.enableExpend = res.data.enableExpend || false
          this.needAudit = res.data.needAudit || false
          this.auditApi = res.data.auditApi || false
          this.kw = res.data.search_key || ''
          if(!this.selects.length){
            this.selects = res.data.selects || []
          }
          this.handleFilter()
        }).catch(err=>{
          this.$message.error(err)
        })
      },
      getListData: function (params={}) {
        params.page = this.page
        params.size = this.limit
        getModelList(Object.assign(this.$route.meta.params || {}, this.baseData, params)).then(res=>{
          this.list = res.data.list || []
          this.total = res.data.total || 0
          this.sums = res.data.sums || []
        }).catch(err=>{
          this.$message.error(err)
        })
      },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (this.summary_fields.includes(column.property)) {
            let tmp = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = `${tmp}/${this.sums[column.property]}`
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
      sortChange: function (data) {
        this.getListData({'sort': data.prop, 'order': data.order})
      },
      handleFilter: function () {
        let params = {}
        if(this.kw){
          params[this.kw] = this.search
        }
        this.selects.map(v=>{
          if(v.value !== null && v.type == 'select') {
            params['q__'+v.name] = v.value
          }
          if(v.type == 'date' && v.value && v.value.length == 2){
            params[`q__${v.name}__gte`]  = v.value[0]
            params[`q__${v.name}__lte`]  = v.value[1]
          }
        })
        // if(Object.keys(params).length){
          this.getListData(params)
        // }
      },
      resetTemp() {
        // let temp = {}
        // this.fields.map( v=> {
        //   temp[v.name] = ''
        // })
        this.temp = {}
      },
      async beforeEdit(){
        if(this.editPage){
          this.$router.push( this.editPage.replace(/:id/, this.temp.id || 0))
          return false
        }
        // get edit fields
        if(!this.editFields.length){
          this.editFields = await this.getEditFields()
        }
        this.dialogStatus = this.temp.id ? 'update' : 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleCreate() {
        this.resetTemp()
        this.beforeEdit()
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            saveInstance(Object.assign({}, this.baseData, {data: JSON.stringify(this.temp), id: 0})).then((res) => {
              if(!this.temp.id){
                this.temp.id = res.data.id
              }
              this.list.unshift(res.data)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      async handleUpdate(row) {
        if(!this.editPage){
          this.getData({id: row.id})
        }else{
          this.temp.id = row.id
        }
        this.beforeEdit()
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            // tempData.updated = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            saveInstance(Object.assign({}, this.baseData, {id: tempData.id, data: JSON.stringify(tempData)})).then((res) => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, res.data)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleBatchDelete(){
        if(!this.selectRows.length){
          this.$message.warning('没有选中任何行')
          return
        }
        this.deleteRows(this.selectRows)
      },
      handleDelete(row) {
        this.deleteRows([row.id])
      },
      deleteRows(ids){
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(()=>{
          delRows(Object.assign({}, this.baseData, {ids: ids.join(',')})).then(res=>{
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.list = this.list.filter(v => {
              return !ids.includes(v.id)
            })
          })
        })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = this.fields.map(v => {
            return v.verbose_name
          })
          const filterVal = this.fields.map(v=>{
            return v.name
          })
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.$route.meta.title
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      handleSelectionChange: function (e) {
        this.selectRows = e.map(v => {
          return v.id
        })
      },
      clearSearch(){
        this.search='';
        this.handleFilter()
      },
      handleAudit(tag, id){
        let ids = id ? [id] : this.ids
        if(tag == 1){
          request({
            url: this.auditApi || 'audit',
            method: 'post',
            data: {
              app_label: this.baseData.app_label,
              modelname: this.baseData.modelname,
              tag: 1,
              ids: ids.join(',')
            }
          }).then(res=>{
            this.list.map((v, index)=>{
              if(ids.includes(v.id)){
                v.audit = '审核通过'
                v.__audit__ = 1
              }
            })
            this.$notify({
              title: '成功',
              message: '审核通过',
              type: 'success',
              duration: 2000
            })
          })
        }else if(tag == -1){
          this.$prompt('请说明原因','提示').then(res=>{
            request({
              url: this.auditApi || 'audit',
              method: 'post',
              data: {
                app_label: this.baseData.app_label,
                modelname: this.baseData.modelname,
                ids: ids.join(','),
                tag: -1,
                reason: res.value
              }
            }).then(res=>{
              this.list.map((v, index)=>{
                if(ids.includes(v.id)){
                  v.audit = '申请已拒绝'
                  v.__audit__ = -1
                }
              })
              this.$notify({
                title: '提示',
                message: '审核已被拒绝',
                type: 'warning',
                duration: 2000
              })
            })
          }).catch(err=>{
            console.log(err)
          })
        }
      }
    },
    beforeMount(){
      this.baseData = {
        app_label: this.$route.meta.app_label,
        modelname: this.$route.meta.modelname,
      }
      this.editPage = this.$route.meta.editPage || ''
      this.getListFields()
    }
  }
</script>

<style lang="scss">
  .xtable{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .el-table{
      max-height: none!important;
    }
  }
  .filter-container{
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }
  .xtable{
    el-table th,.el-table td{
      .cell{
        line-height: 24px;
      }
    }
    .el-table th{
      .cell{
        line-height: 16px;
        white-space: nowrap;
      }
    }
    .pagination-container{
      padding: 10px 0 0 0;
      margin-bottom: 10px;
    }
    .el-table__footer-wrapper{
      font-weight: bolder;
      .cell{
        /*white-space: nowrap;*/
      }
    }
    .el-date-editor--daterange{
      padding: 0px 10px;
      height: 32px;
      width: auto!important;
      margin: 0 5px;
      .el-range-separator{
        width: 20px;
      }
      .el-range-input{
        width: 80px;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .label{
    color: #999;
  }
  .el-table{
    margin-top: 10px;
  }
  .filter-item{
    margin: 0 2px;
  }
  .list-image{
    width: 20px;
    height: 20px;
  }
  .table-cell{
    font-size: 13px;
  }
</style>

<template>
  <div class="app-container permissions-container">
    <el-tabs tab-position="left" v-model="tab" type="border-card" :style="'height:'+height+'px'">
      <el-tab-pane v-for="role in roles" :name="role.ename" :label="role.name" :lazy="true">
        <div class="permissions" :style="'height:'+height+'px'">
          <div class="permission-item" v-for="(item, index) in role.$permissions" :key="index">
            <el-checkbox class="title" v-model="item.isChecked" @change="titleChange(item)">{{ item.value }}</el-checkbox>
            <div class="permission-item-sub">
              <el-checkbox class="permission-subitem" v-for="(subitem, subindex) in item.children" :key="index+'-'+subindex" v-model="subitem.isChecked">{{ subitem.value }}
              </el-checkbox>
            </div>
          </div>
          <save :onSave="saveHandler" class="save"></save>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { getModelList } from '@/api/base'
  import { saveRolePermissions } from '@/api/user'
  import Save from '@/components/Save'
  import permissions from './permissions'

  export default {
    name: 'Permission',
    components: {
      'save': Save
    },
    data() {
      return {
        roles: [{
          ename: 'admin',
          name: '管理员',
          $permissions: permissions
        }],
        tab: 'admin'
      }
    },
    computed: {
      height() {
        return document.body.clientHeight - 100
      }
    },
    methods: {
      getRoles() {
        getModelList({app_label: 'xuser', modelname: 'XRole', order: 'ascending'}).then(res => {
          let self = this
          this.roles = res.data.list.map(v => {
            v.$permissions = self.permissions.map(vv => {
              const tmp = JSON.parse(JSON.stringify(vv))
              tmp.isChecked = v.ename == 'admin' ? true : v.permissions.split(',').includes(vv.key)
              tmp.children.map(sub => {
                sub.isChecked = v.ename == 'admin' ? true : v.permissions.split(',').includes(sub.key)
              })
              return tmp
            })
            return v
          })
          this.tab = this.roles.length && this.roles[0].ename
        }).catch(err => {
          this.$message.error(err)
        })
      },
      saveHandler() {
        let data = []
        this.roles.map(v => {
          let tmp = {
            'id': v.id,
            'role': v.ename
          }
          const permissions = []
          v.$permissions.filter(vv => {
            return vv.isChecked
          }).map(vv => {
            permissions.push(vv.key)
            vv.children.map(sub => {
              if(sub.isChecked){
                permissions.push(sub.key)
              }
            })
          })
          tmp.permissions = permissions.join(',')
          data.push(tmp)
        })
        saveRolePermissions({data: JSON.stringify(data)}).then(res => {
          this.$message.success('权限设置成功')
        }).catch(err => {
          this.$message.error(err)
        })
      },
      titleChange(item) {
        item.children.map(v => {
          v.isChecked = item.isChecked
        })
      }
    },
    mounted() {
      // this.getRoles()
    }
  }
</script>

<style lang="scss" scoped>
  .el-container {
    width: 100%;
    border: 1px solid #eee
  }

  .permissions {
    overflow-y: scroll;
    padding-bottom: 100px;
    .permission-item {
      margin-bottom: 20px;
      .title {
        margin: 5px 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      .permission-subitem {
        margin: 10px;
        cursor: pointer;
      }
      .permission-item-sub {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
      }
    }
  }

  .save {
    margin-top: 100px;
    width: 100%;
  }
</style>
<style lang="scss">
  .permissions-container .title .el-checkbox__label {
    font-size: 16px;
    font-weight: bolder;
  }
</style>

<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">页面设置</h3>
      <div class="drawer-item flex flex-between">
        <span>切换主题</span>
        <div style="width: 120px;height: 30px">
          <el-select v-model="theme" placeholder="请选择" popper-class="select-theme" @change="changeTheme">
            <el-option
              v-for="item in themes"
              :key="item.theme"
              :label="item.name"
              :value="item.theme">
              <div class="theme">
                <span class="theme-title">{{ item.name }}</span>
                <span class="theme-color" :style="'background-color:'+item.color.primary "></span>
                <span class="theme-color" :style="'background-color:'+item.color.success "></span>
                <span class="theme-color" :style="'background-color:'+item.color.danger "></span>
                <span class="theme-color" :style="'background-color:'+item.color.waning"></span>
              </div>
            </el-option>
          </el-select>
        </div>
      </div>

      <!--TODO: 自定义主题覆盖不了菜单背景色-->
      <div class="drawer-item hidden">
        <span>自定义主题</span>
        <theme-picker style="float: right;height: 26px;margin: -3px 8px 0 0;" :default-theme="customTheme" @change="themeChange" />
      </div>

      <div class="drawer-item">
        <span>开启标签</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>顶部固定</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>侧边栏Logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>

    </div>
  </div>
</template>

<script>

import defaultTheme from '@/styles/themes/default/colors.scss';
import Theme1 from '@/styles/themes/theme1/colors.scss';
import Theme2 from '@/styles/themes/theme2/colors.scss';
import Theme3 from '@/styles/themes/theme3/colors.scss';
import Theme4 from '@/styles/themes/theme4/colors.scss';

import Cookie from 'js-cookie';
import ThemePicker from '@/components/ThemePicker'

export default {
  components: { ThemePicker },
  data() {
    let theme = this.$store.getters.theme
    return {
      theme: theme,
      themes: [
        {name: '默认主题', theme: 'default', color: defaultTheme},
        {name: '春暖花开', theme: 'theme1', color: Theme1},
        {name: '夏日炎炎', theme: 'theme2', color: Theme2},
        {name: '秋高气爽', theme: 'theme3', color: Theme3},
        {name: '银装素裹', theme: 'theme4', color: Theme4},
      ],
      customTheme: ''
    }
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    }
  },
  methods: {
    changeTheme(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'showSettings',
        value: false
      })
      this.$confirm('确定要切换主题吗？', '提示', {type: 'warning'}).then(()=>{
        this.$store.dispatch('settings/changeSetting', {
          key: 'theme',
          value: val
        })
        Cookie.set('theme', val);
        location.reload()
      }).catch(()=>{
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: true
        })
      })
    },
    themeChange(val){
      this.customTheme = val
    }
  }
}
</script>

<style>
  .select-theme{
    z-index: 40001!important;
  }
</style>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
}

.el-dropdown-link {
  cursor: pointer;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.theme{
  display: flex;
  align-items: center;
  .theme-title{
    display: inline-block;
    width: 100px;
  }
  .theme-color{
    display: inline-block;
    width: 20px;
    height: 20px;
  }
}
</style>

<template>
  <Page auto-content-height>
    <ElTabs v-model="activeTab" type="border-card" class="h-full" @tab-click="handleTabClick">
      <ElTabPane :label="$t('setting.config.tab.site')" name="site">
        <SiteConfig />
      </ElTabPane>
      <ElTabPane :label="$t('setting.config.tab.web_site')" name="web_site">
        <WebSiteConfig />
      </ElTabPane>
      <ElTabPane :label="$t('setting.config.tab.baidu_tongji')" name="baidu_tongji">
        <BaiduTongjiConfig />
      </ElTabPane>
      <ElTabPane :label="$t('setting.config.tab.upload')" name="upload">
        <UploadConfig />
      </ElTabPane>
      <ElTabPane :label="$t('setting.config.tab.email')" name="email">
        <EmailConfig />
      </ElTabPane>
      <ElTabPane :label="$t('setting.config.tab.sms')" name="sms">
        <SmsConfig />
      </ElTabPane>
      <ElTabPane :label="$t('setting.config.tab.common')" name="common">
        <CommonConfig />
      </ElTabPane>
    </ElTabs>
  </Page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { Page } from '@vben/common-ui'
import { ElTabs, ElTabPane } from 'element-plus'
import SiteConfig from './modules/site.vue'
import WebSiteConfig from './modules/web-site.vue'
import BaiduTongjiConfig from './modules/baidu-tongji.vue'
import UploadConfig from './modules/upload.vue'
import EmailConfig from './modules/email.vue'
import SmsConfig from './modules/sms.vue'
import CommonConfig from './modules/common.vue'

const activeTab = ref('site')
const loadKey = ref(0)

function handleTabClick(tab: any) {
  if (tab.paneName === activeTab.value) {
    loadKey.value++
  }
}
</script>

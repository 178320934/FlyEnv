<template>
  <el-card class="version-manager">
    <template #header>
      <div class="card-header">
        <div class="left">
          <template v-if="brewRunning">
            <span> {{ cardHeadTitle }} </span>
          </template>
          <template v-else>
            <span> {{ title }} </span>
            <el-popover :show-after="600" placement="top" width="auto">
              <template #default>
                <span>{{ I18nT('base.customVersionDirTips') }}</span>
              </template>
              <template #reference>
                <el-button
                  class="custom-folder-add-btn"
                  :icon="FolderAdd"
                  link
                  @click.stop="showCustomDir"
                ></el-button>
              </template>
            </el-popover>
            <el-button class="button" link @click="openURL(url)">
              <yb-icon
                style="width: 20px; height: 20px"
                :svg="import('@/svg/http.svg?raw')"
              ></yb-icon>
            </el-button>
            <el-radio-group v-model="tableTab" size="small" class="ml-6">
              <el-radio-button
                class="flex-1"
                :label="I18nT('versionmanager.Local')"
                value="local"
              ></el-radio-button>
              <el-radio-button
                class="flex-1"
                :label="I18nT('versionmanager.Library')"
                value="lib"
              ></el-radio-button>
            </el-radio-group>
          </template>
        </div>
        <el-button v-if="showNextBtn" type="primary" @click="toNext">{{
          I18nT('base.confirm')
        }}</el-button>
        <el-button
          v-else
          class="button"
          link
          :disabled="fetching || brewRunning"
          @click="reGetData"
        >
          <yb-icon
            :svg="import('@/svg/icon_refresh.svg?raw')"
            class="refresh-icon"
            :class="{ 'fa-spin': fetching || brewRunning }"
          ></yb-icon>
        </el-button>
      </div>
    </template>
    <template v-if="showLog">
      <div class="log-wapper">
        <div ref="logs" class="logs"></div>
      </div>
    </template>
    <el-table
      v-else
      class="service-table"
      height="100%"
      :data="tableData"
      :border="false"
      style="width: 100%"
    >
      <template #empty>
        <template v-if="fetching">
          {{ I18nT('base.gettingVersion') }}
        </template>
        <template v-else>
          {{ I18nT('util.noVerionsFoundInLib') }}
        </template>
      </template>
      <el-table-column prop="version" width="200">
        <template #header>
          <span style="padding: 2px 12px 2px 24px; display: block">{{
            I18nT('base.version')
          }}</span>
        </template>
        <template #default="scope">
          <span
            :class="{
              current: checkEnvPath(scope.row)
            }"
            style="padding: 2px 12px 2px 24px; display: block"
            >{{ scope.row.version }}</span
          >
        </template>
      </el-table-column>
      <el-table-column :label="tableTab === 'local' ? I18nT('base.path') : null">
        <template #default="scope">
          <template v-if="scope.row?.path">
            <span
              class="path"
              :class="{
                current: checkEnvPath(scope.row)
              }"
              @click.stop="openDir(scope.row.path)"
              >{{ scope.row.path }}</span
            >
          </template>
          <template v-else>
            <div class="cell-progress">
              <el-progress v-if="scope.row.downing" :percentage="scope.row.progress"></el-progress>
            </div>
          </template>
        </template>
      </el-table-column>
      <template v-if="tableTab === 'lib'">
        <el-table-column :label="I18nT('base.source')" width="120">
          <template #default="scope">
            <span>{{ scope.row.source }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column align="center" :label="I18nT('base.isInstalled')" width="150">
        <template #default="scope">
          <div class="cell-status">
            <template v-if="scope.row.installed || scope.row?.path">
              <yb-icon :svg="import('@/svg/ok.svg?raw')" class="installed"></yb-icon>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="I18nT('base.operation')" width="150">
        <template #default="scope">
          <template v-if="scope.row?.path">
            <ExtSet :item="scope.row" type="maven" />
          </template>
          <template v-else>
            <el-button
              type="primary"
              link
              :style="{ opacity: scope.row.version !== undefined ? 1 : 0 }"
              :loading="scope.row.downing"
              :disabled="scope.row.downing"
              @click="handleEdit(scope.row)"
              >{{
                scope.row.installed ? I18nT('base.uninstall') : I18nT('base.install')
              }}</el-button
            >
          </template>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts" setup>
  import { I18nT } from '@shared/lang'
  import ExtSet from '@/components/ServiceManager/EXT/index.vue'
  import { ServiceActionStore } from '../ServiceManager/EXT/store'
  import { SetupAll } from '@/components/VersionManager/setupAll'
  import type { AllAppModule } from '@/core/type'
  import { FolderAdd } from '@element-plus/icons-vue'

  const props = defineProps<{
    typeFlag: AllAppModule
    title: string
    url: string
  }>()

  const {
    openURL,
    showNextBtn,
    toNext,
    reGetData,
    fetching,
    showLog,
    tableData,
    checkEnvPath,
    openDir,
    handleEdit,
    logs,
    brewRunning,
    cardHeadTitle,
    showCustomDir,
    tableTab
  } = SetupAll(props.typeFlag)
  ServiceActionStore.fetchPath()
</script>

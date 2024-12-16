<script setup lang="ts">
import LogoDropdown from '@/components/nav/LogoDropdown.vue'
import CreateProjectPopup from '@/components/project/CreateProjectPopup.vue'
import VTabbar from '@/components/VTabbar/index.vue'
import { ref } from 'vue'

const activeTab = ref('editor')
const hasContent = ref(false)
const showPopup = ref(false)

// 项目信息
interface ProjectContent {
  id: string
  title: string
  content: string
  createdAt: number
}

interface Project {
  name: string
  desc: string
  format: string
  contents: ProjectContent[]
}

const currentProject = ref<Project | null>(null)

// 添加内容表单数据
const newTitle = ref('')
const newContent = ref('')

// 控制表单显示
const isShowForm = ref(false)

// 图片列表
const fileList = ref<any[]>([])

// 在 script setup 中添加
const isEditingProject = ref(false)
const editProjectName = ref('')
const editProjectDesc = ref('')
const isShowContentForm = ref(false) // 控制内容输入区域显示

function handleCreateProject(data: { name: string, desc: string, format: string }) {
  currentProject.value = {
    ...data,
    contents: [], // 初始化空内容数组
  }
  hasContent.value = true
  showPopup.value = false
}

function handleShowForm() {
  isShowForm.value = true
}

function handleCancelForm() {
  isShowForm.value = false
  newTitle.value = ''
  newContent.value = ''
}

function handleAddContent() {
  if (!currentProject.value)
    return
  if (!newTitle.value && !newContent.value) {
    uni.showToast({
      title: '请填写标题或正文',
      icon: 'none',
    })
    return
  }

  // 添加新内容
  currentProject.value.contents.push({
    id: `content-${Date.now()}`,
    title: newTitle.value,
    content: newContent.value,
    createdAt: Date.now(),
  })

  // 清空表单
  newTitle.value = ''
  newContent.value = ''
}

// 导航栏右侧按钮点击
function handleExportImage() {
  uni.showToast({
    title: '导出图片',
    icon: 'none',
  })
}

// GitHub 点击处理
function handleGithubClick() {
  // 在小程序中打开网页需要使用特殊处理
  uni.setClipboardData({
    data: 'https://github.com/your-repo',
    success: () => {
      uni.showToast({
        title: '已复制 GitHub 地址',
        icon: 'none',
      })
    },
  })
}

// 处理图片上传变化
function handleUploadChange({ fileList: files }) {
  fileList.value = files
  // 如果上传成功，将图片链接插入到内容中
  const lastFile = files[files.length - 1]
  if (lastFile && lastFile.status === 'success') {
    newContent.value += `\n![图片](${lastFile.url})`
  }
}

// 编辑内容
function handleEditContent(item: ProjectContent) {
  // 设置当前编辑的内容
  newTitle.value = item.title
  newContent.value = item.content
  // TODO: 可以添加编辑状态标记，区分新增和编辑
}

// 添加子节点
function handleAddSubContent(item: ProjectContent) {
  // 清空输入框，准备添加新内容
  newTitle.value = ''
  newContent.value = ''
  // TODO: 可以添加父节点关联，实现层级结构
}

// 删除内容
function handleDeleteContent(item: ProjectContent) {
  if (!currentProject.value)
    return

  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条内容吗？',
    success: (res) => {
      if (res.confirm) {
        currentProject.value.contents = currentProject.value.contents.filter(
          content => content.id !== item.id,
        )
      }
    },
  })
}

// 编辑项目
function handleEditProject() {
  if (!currentProject.value)
    return
  editProjectName.value = currentProject.value.name
  editProjectDesc.value = currentProject.value.desc
  isEditingProject.value = true
}

// 取消编辑项目
function handleCancelEditProject() {
  isEditingProject.value = false
  editProjectName.value = ''
  editProjectDesc.value = ''
}

// 保存项目
function handleSaveProject() {
  if (!currentProject.value)
    return
  if (!editProjectName.value) {
    uni.showToast({
      title: '请输入项目名称',
      icon: 'none',
    })
    return
  }

  currentProject.value.name = editProjectName.value
  currentProject.value.desc = editProjectDesc.value
  isEditingProject.value = false
}

// 删除项目
function handleDeleteProject() {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除整个项目吗？',
    success: (res) => {
      if (res.confirm) {
        currentProject.value = null
        hasContent.value = false
      }
    },
  })
}

// 显示内容输入表单
function handleShowContentForm() {
  isShowContentForm.value = true
  newTitle.value = ''
  newContent.value = ''
}

// 取消内容输入
function handleCancelContentForm() {
  isShowContentForm.value = false
  newTitle.value = ''
  newContent.value = ''
}
</script>

<template>
  <view class="page-container">
    <!-- 自定义导航栏 -->
    <WdNavbar
      fixed
      placeholder
      safe-area-inset-top
      custom-style="background-color: #fff;"
    >
      <!-- 左侧 Logo -->
      <template #left>
        <LogoDropdown />
      </template>

      <!-- 右侧按钮 -->
      <template #right>
        <view class="nav-right">
          <view class="nav-btn github" @tap="handleGithubClick">
            <wd-icon name="github-filled" size="20px" />
          </view>
          <view class="nav-btn export" @tap="handleExportImage">
            <wd-icon name="download" size="18px" />
            <text class="btn-text">
              导出图片
            </text>
          </view>
        </view>
      </template>
    </WdNavbar>

    <!-- <PageToolbar /> -->

    <view class="content-container">
      <WdTabs v-model="activeTab" sticky>
        <WdTab name="editor" title="编辑器" />
        <WdTab name="preview" title="预览" />
      </WdTabs>

      <!-- 空状态 -->
      <view v-if="!hasContent" class="empty-container">
        <view class="empty-content">
          <text class="empty-title">
            从新建项目开始
          </text>
          <text class="empty-desc">
            您的所有数据都存储在浏览器本地。
          </text>
          <WdButton
            type="primary"
            size="large"
            class="create-btn"
            @click="() => showPopup = true"
          >
            ���建项目
          </WdButton>
        </view>
      </view>

      <!-- 编辑器内容 -->
      <view v-else class="editor-container">
        <!-- 项目信息 -->
        <view class="project-info">
          <!-- 非编辑状态 -->
          <view v-if="!isEditingProject" class="project-header">
            <view class="project-content">
              <text class="project-name">
                {{ currentProject?.name }}
              </text>
              <text class="project-desc">
                {{ currentProject?.desc }}
              </text>
            </view>
            <view class="block-actions">
              <view class="action-btn" @tap="handleEditProject">
                <wd-icon name="edit" size="20px" color="#666" />
              </view>
              <view class="action-btn" @tap="handleShowContentForm">
                <wd-icon name="add" size="20px" color="#666" />
              </view>
              <view class="action-btn" @tap="handleDeleteProject">
                <wd-icon name="delete" size="20px" color="#666" />
              </view>
            </view>
          </view>

          <!-- 编辑状态 -->
          <view v-else class="project-edit-form">
            <WdInput
              v-model="editProjectName"
              type="text"
              placeholder="项目名称"
              :border="false"
              class="project-name-input"
            />
            <WdInput
              v-model="editProjectDesc"
              type="text"
              placeholder="项目描述"
              :border="false"
              class="project-desc-input"
            />
            <view class="form-footer">
              <WdButton size="small" plain @click="handleCancelEditProject">
                取消
              </WdButton>
              <WdButton type="primary" size="small" @click="handleSaveProject">
                保存
              </WdButton>
            </view>
          </view>
        </view>

        <!-- 内容列表 -->
        <view class="content-list">
          <!-- 已保存的内容 -->
          <view
            v-for="item in currentProject?.contents"
            :key="item.id"
            class="content-block"
          >
            <view class="block-header">
              <text class="block-title">
                {{ item.title }}
              </text>
              <view class="block-actions">
                <view class="action-btn" @tap="handleEditContent(item)">
                  <wd-icon name="edit" size="20px" color="#666" />
                </view>
                <view class="action-btn" @tap="handleAddSubContent(item)">
                  <wd-icon name="add" size="20px" color="#666" />
                </view>
                <view class="action-btn" @tap="handleDeleteContent(item)">
                  <wd-icon name="delete" size="20px" color="#666" />
                </view>
              </view>
            </view>
            <text class="block-content">
              {{ item.content }}
            </text>
          </view>

          <!-- 添加内容按钮 -->
          <view v-if="!isShowContentForm" class="add-content-btn" @tap="handleShowContentForm">
            <wd-icon name="add" size="20px" color="#666" />
            <text>添加标题</text>
          </view>

          <!-- 输入区域 -->
          <view v-else class="content-block">
            <WdInput
              v-model="newTitle"
              type="text"
              placeholder="标题"
              :border="false"
              class="block-title-input"
            />
            <WdTextarea
              v-model="newContent"
              placeholder="正文"
              auto-height
              show-word-limit
              :maxlength="500"
              :rows="4"
              class="block-content-input"
            />
            <view class="block-footer">
              <view class="footer-left">
                <wd-upload
                  :file-list="fileList"
                  action="https://your-upload-api.com/upload"
                  @change="handleUploadChange"
                >
                  <view class="tool-btn">
                    <wd-icon name="picture" size="22px" color="#666" />
                  </view>
                </wd-upload>
              </view>
              <view class="footer-right">
                <WdButton
                  size="small"
                  plain
                  custom-style="margin-right: 16rpx;"
                  @click="handleCancelContentForm"
                >
                  取消
                </WdButton>
                <WdButton
                  type="primary"
                  size="small"
                  @click="handleAddContent"
                >
                  保存
                </WdButton>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <VTabbar value="article" fixed safe-area-inset-bottom placeholder />

    <CreateProjectPopup
      v-model:visible="showPopup"
      @confirm="handleCreateProject"
    />
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-top: var(--window-top);
  background-color: #f5f7fa;
}

.content-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.empty-container {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.empty-title {
  margin-bottom: 16rpx;
  font-size: 40rpx;
  font-weight: 500;
  color: var(--wot-text-color);
}

.empty-desc {
  margin-bottom: 48rpx;
  font-size: 28rpx;
  color: var(--wot-text-color-secondary);
}

.create-btn {
  width: 240rpx !important;
}

:deep(.wd-tabs__nav) {
  background-color: #fff;
}

:deep(.wd-tab) {
  font-size: 32rpx;

  &.is-active {
    font-weight: 500;
    color: var(--wot-primary);
  }
}

// 添加工具栏相关样式
:deep(.toolbar) {
  border-top: 1px solid #eaeaea;
}

.editor-container {
  flex: 1;
  padding: 32rpx;
  overflow-y: auto;
}

.project-info {
  padding: 24rpx;
  margin-bottom: 48rpx;
  background: #fff;
  border-radius: 12rpx;
}

.project-name {
  display: block;
  margin-bottom: 16rpx;
  font-size: 40rpx;
  font-weight: 500;
  color: var(--wot-text-color);
}

.project-desc {
  font-size: 28rpx;
  color: var(--wot-text-color-secondary);
}

.content-list {
  margin-top: 32rpx;
}

.content-block {
  padding: 32rpx;
  margin-bottom: 24rpx;
  background: #fff;
  border-radius: 12rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.block-title {
  display: block;
  margin-bottom: 16rpx;
  font-size: 36rpx;
  font-weight: 500;
  color: var(--wot-text-color);
}

.block-content {
  font-size: 28rpx;
  line-height: 1.6;
  color: var(--wot-text-color);
  white-space: pre-wrap;

  :deep(img) {
    max-width: 100%;
    height: auto;
    margin: 16rpx 0;
    border-radius: 8rpx;
  }
}

.block-title-input {
  margin-bottom: 16rpx;
  font-size: 36rpx;
  font-weight: 500;

  :deep(.wd-input__inner) {
    font-size: 36rpx;
    font-weight: 500;
  }
}

.block-content-input {
  padding: 24rpx;
  margin-bottom: 24rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
}

.block-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 24rpx;
  border-top: 1px solid #eee;
}

.footer-left {
  .tool-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12rpx;
    cursor: pointer;
    border-radius: 6rpx;

    &:active {
      background-color: #f5f5f5;
    }
  }
}

.footer-right {
  display: flex;
  align-items: center;
}

// 导航栏样式
.nav-right {
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.nav-btn {
  display: flex;
  gap: 8rpx;
  align-items: center;
  padding: 12rpx 20rpx;
  font-size: 26rpx;
  color: var(--wot-text-color);
  border-radius: 6rpx;
  transition: all 0.2s;

  &:active {
    background-color: #f5f5f5;
    opacity: 0.8;
  }

  &.github {
    padding: 8rpx;
    color: #24292f;
  }

  &.export {
    padding: 8rpx 16rpx;
    color: #fff;
    background-color: var(--wot-primary);

    .wd-icon {
      margin-right: 4rpx;
    }
  }
}

.btn-text {
  font-size: 26rpx;
}

.project-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.project-content {
  flex: 1;
}

.project-edit-form {
  .project-name-input {
    margin-bottom: 16rpx;
    font-size: 40rpx;
    font-weight: 500;

    :deep(.wd-input__inner) {
      font-size: 40rpx;
      font-weight: 500;
    }
  }

  .project-desc-input {
    margin-bottom: 24rpx;
    font-size: 28rpx;

    :deep(.wd-input__inner) {
      font-size: 28rpx;
    }
  }
}

.add-content-btn {
  display: flex;
  gap: 8rpx;
  align-items: center;
  justify-content: center;
  padding: 24rpx;
  margin-bottom: 24rpx;
  font-size: 28rpx;
  color: #666;
  cursor: pointer;
  background: #fff;
  border-radius: 12rpx;
  transition: all 0.2s;

  &:active {
    background-color: #f5f5f5;
  }
}

.block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.block-actions {
  display: flex;
  gap: 8rpx;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rpx;
  cursor: pointer;
  border-radius: 4rpx;
  transition: all 0.2s;

  &:active {
    background-color: #f5f5f5;
  }
}

// 添加按钮样式
.add-btn {
  display: flex;
  gap: 8rpx;
  align-items: center;
  justify-content: center;
}

:deep(.wd-upload) {
  .wd-upload__preview {
    display: none;  // 隐藏预览列表
  }
}
</style>

<route lang="yaml">
style:
  navigationBarTitleText: ""
  navigationStyle: "custom"
</route>

<script setup lang="ts">
import LogoDropdown from '@/components/nav/LogoDropdown.vue'
import CreateProjectPopup from '@/components/project/CreateProjectPopup.vue'
import RichText from '@/components/RichText.vue'
import VTabbar from '@/components/VTabbar/index.vue'
import { computed, nextTick, ref } from 'vue'

const activeTab = ref('editor')
const hasContent = ref(false)
const showPopup = ref(false)

// 项目信息
interface ProjectContent {
  id: string
  title: string
  content: string
  createdAt: number
  type: 'title' | 'subtitle' // 区分标题和子标题
  parentId?: string // 子标题关联的父标题ID
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
const isShowContentForm = ref(false) // ���制内容输入区域显示

// 编辑器实
interface EditorContext {
  setContents: (options: { html: string }) => void
  insertImage: (options: {
    src: string
    width?: string
    success?: () => void
  }) => void
}

const editorCtx = ref<EditorContext | null>(null)

// 添加新的接口和状态
interface EditingState {
  id: string | null
  title: string
  content: string
  type: 'title' | 'subtitle'
  parentId?: string
  expandedId?: string // 记录当前展开编辑的记录ID
  isEditing: boolean // 区分是编辑还是新增
}

// 修改状态管理
const editingState = ref<EditingState>({
  id: null,
  title: '',
  content: '',
  type: 'title',
  expandedId: undefined,
  isEditing: false,
})

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
  const content = editingState.value.content || newContent.value
  const title = editingState.value.title || newTitle.value

  if (!title && !content) {
    uni.showToast({
      title: '请填写标题或正文',
      icon: 'none',
    })
    return
  }

  // 添加新内容
  currentProject.value.contents.push({
    id: `content-${Date.now()}`,
    title,
    content,
    createdAt: Date.now(),
    type: editingState.value.type,
    parentId: editingState.value.parentId,
  })

  // 清空表单
  newTitle.value = ''
  newContent.value = ''
  editingState.value = {
    id: null,
    title: '',
    content: '',
    type: 'title',
    parentId: undefined,
    expandedId: undefined,
    isEditing: false,
  }
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
  // 如果上传成功，将图片链接插入内容中
  const lastFile = files[files.length - 1]
  if (lastFile && lastFile.status === 'success') {
    newContent.value += `\n![图���](${lastFile.url})`
  }
}

// 编辑内容
function handleEditContent(item: ProjectContent) {
  editingState.value = {
    id: item.id,
    title: item.title,
    content: item.content,
    type: item.type,
    parentId: item.parentId,
    expandedId: item.id,
    isEditing: true,
  }
  // 等待DOM更新后初始化编辑器
  nextTick(() => {
    onEditorReady(null)
  })
}

// 取消编辑
function handleCancelEdit() {
  editingState.value = {
    id: null,
    title: '',
    content: '',
    type: 'title',
    expandedId: undefined,
    isEditing: false,
  }
}

// 保存编辑
function handleSaveEdit() {
  if (!currentProject.value || !editingState.value.id)
    return

  const index = currentProject.value.contents.findIndex(
    content => content.id === editingState.value.id,
  )

  if (index > -1) {
    currentProject.value.contents[index] = {
      ...currentProject.value.contents[index],
      title: editingState.value.title,
      content: editingState.value.content,
    }
  }

  // 重置编辑状态
  handleCancelEdit()
}

// 添加子节点
function handleAddSubContent(parentItem: ProjectContent) {
  editingState.value = {
    id: null,
    title: '',
    content: '',
    type: 'subtitle',
    parentId: parentItem.id,
    expandedId: parentItem.id,
    isEditing: false,
  }
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

  // 等待DOM更新后初始化编辑器
  nextTick(() => {
    const query = uni.createSelectorQuery()
    query
      .select('#project-editor')
      .context((res: any) => {
        if (res?.context) {
          editorCtx.value = res.context
          // 回填项目描述
          editorCtx.value.setContents({
            html: currentProject.value.desc || '',
          })
        }
      })
      .exec()
  })
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
  currentProject.value.desc = editProjectDesc.value || ''
  isEditingProject.value = false
  editProjectName.value = ''
  editProjectDesc.value = ''
}

// 删除项目
function handleDeleteProject() {
  uni.showModal({
    title: '确认删除',
    content: '确定删除整个项目吗？',
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

// 编辑器准备就绪回调
function onEditorReady(e: any) {
  // 使用 nextTick 确保 DOM 已更新
  nextTick(() => {
    // 获取当前编辑器的ID
    const editorId = editingState.value.expandedId
      ? `editor-${editingState.value.expandedId}`
      : 'editor'

    const query = uni.createSelectorQuery()
    query
      .select(`#${editorId}`)
      .context((res: any) => {
        if (!res || !res.context) {
          console.warn(`Editor not found: ${editorId}`)
          return
        }

        editorCtx.value = res.context

        // 如果是编辑状态，回填内容
        if (editingState.value.isEditing) {
          res.context.setContents({
            html: editingState.value.content || '',
          })
        }
        else if (newContent.value) {
          res.context.setContents({
            html: newContent.value,
          })
        }
      })
      .exec()
  })
}

// 编辑器输入回调
function onEditorInput(e: any) {
  const content = e.detail.html || e.detail.text || ''
  if (editingState.value.isEditing) {
    editingState.value.content = content
  }
  else {
    newContent.value = content
  }
}

// 编辑器状态变化
function onStatusChange(e: any) {
  console.log('editor status change:', e)
}

// 插入图片
async function handleUploadImage() {
  if (!editorCtx.value) {
    uni.showToast({
      title: '编辑器未准备好',
      icon: 'none',
    })
    return
  }

  try {
    const [error, res] = await uni.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
    })

    if (error || !res?.tempFilePaths?.length) {
      throw new Error('选择图片失败')
    }

    editorCtx.value.insertImage({
      src: res.tempFilePaths[0],
      width: '100%',
      success() {
        console.log('insert image success')
      },
    })
  }
  catch (err) {
    uni.showToast({
      title: err.message || '插入图片失败',
      icon: 'none',
    })
  }
}

// 添加计��属性获取标题列表
const titleContents = computed(() =>
  currentProject.value?.contents.filter(item => item.type === 'title') || [],
)

// 添加获取子标题的方法
function getSubtitles(parentId: string) {
  return currentProject.value?.contents.filter(
    item => item.type === 'subtitle' && item.parentId === parentId,
  ) || []
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

      <!-- 右侧按��� -->
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
            新建项目
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
              <RichText class="block-content" :content="currentProject?.desc" />
            </view>
            <view class="block-actions">
              <view class="action-btn" @tap="handleEditProject">
                <wd-icon name="edit" size="20px" color="#666" />
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
            <editor
              id="project-editor"
              class="editor"
              placeholder="项目描述"
              show-img-size
              show-img-toolbar
              show-img-resize
              @ready="onEditorReady"
              @input="onEditorInput"
              @statuschange="onStatusChange"
            />
            <view class="form-footer">
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
                  @click="handleCancelEditProject"
                >
                  取消
                </WdButton>
                <WdButton
                  type="primary"
                  size="small"
                  @click="handleSaveProject"
                >
                  保存
                </WdButton>
              </view>
            </view>
          </view>
        </view>

        <!-- 内容列表 -->
        <view class="content-list">
          <!-- 渲染标题 -->
          <template v-for="item in titleContents" :key="item.id">
            <view class="content-block">
              <!-- 标题内容 -->
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
              <RichText class="block-content" :content="item.content" />

              <!-- 子标题列表 -->
              <view class="subtitle-list">
                <template v-for="subtitle in getSubtitles(item.id)" :key="subtitle.id">
                  <view class="subtitle-block">
                    <view class="block-header">
                      <text class="block-title">
                        {{ subtitle.title }}
                      </text>
                      <view class="block-actions">
                        <view class="action-btn" @tap="handleEditContent(subtitle)">
                          <wd-icon name="edit" size="20px" color="#666" />
                        </view>
                        <view class="action-btn" @tap="handleDeleteContent(subtitle)">
                          <wd-icon name="delete" size="20px" color="#666" />
                        </view>
                      </view>
                    </view>
                    <RichText class="block-content" :content="subtitle.content" />

                    <!-- 子标题编辑区域 -->
                    <view v-if="editingState.expandedId === subtitle.id" class="edit-area">
                      <WdInput
                        v-model="editingState.title"
                        type="text"
                        :placeholder="editingState.isEditing ? '编辑子标题' : '新建子标题'"
                        :border="false"
                        class="block-title-input"
                      />
                      <editor
                        :id="`editor-${subtitle.id}`"
                        class="editor"
                        :placeholder="editingState.isEditing ? '编辑正文' : '新建正文'"
                        :show-img-size="true"
                        :show-img-toolbar="true"
                        :show-img-resize="true"
                        @ready="onEditorReady"
                        @input="onEditorInput"
                        @statuschange="onStatusChange"
                      />
                      <view class="edit-footer">
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
                            @click="handleCancelEdit"
                          >
                            取消
                          </WdButton>
                          <WdButton
                            type="primary"
                            size="small"
                            @click="editingState.isEditing ? handleSaveEdit() : handleAddContent()"
                          >
                            {{ editingState.isEditing ? '保存' : '添加' }}
                          </WdButton>
                        </view>
                      </view>
                    </view>
                  </view>
                </template>
              </view>

              <!-- 编辑区域 -->
              <view v-if="editingState.expandedId === item.id" class="edit-area">
                <WdInput
                  v-model="editingState.title"
                  type="text"
                  :placeholder="editingState.isEditing ? '编辑标题' : '新建标题'"
                  :border="false"
                  class="block-title-input"
                />
                <editor
                  :id="`editor-${editingState.expandedId}`"
                  class="editor"
                  :placeholder="editingState.isEditing ? '编辑正文' : '新建正文'"
                  :show-img-size="true"
                  :show-img-toolbar="true"
                  :show-img-resize="true"
                  @ready="onEditorReady"
                  @input="onEditorInput"
                  @statuschange="onStatusChange"
                />
                <view class="edit-footer">
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
                      @click="handleCancelEdit"
                    >
                      取消
                    </WdButton>
                    <WdButton
                      type="primary"
                      size="small"
                      @click="editingState.isEditing ? handleSaveEdit() : handleAddContent()"
                    >
                      {{ editingState.isEditing ? '保存' : '添加' }}
                    </WdButton>
                  </view>
                </view>
              </view>
            </view>
          </template>

          <!-- 添加新内容按钮和表单 -->
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
            <editor
              id="editor"
              class="editor"
              placeholder="正文"
              :show-img-size="true"
              :show-img-toolbar="true"
              :show-img-resize="true"
              @ready="onEditorReady"
              @input="onEditorInput"
              @statuschange="onStatusChange"
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
  gap: 16rpx;
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

  .editor {
    min-height: 240rpx;
    max-height: 480rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
    font-size: 28rpx;
    line-height: 1.6;
    background-color: #f8f8f8;
    border-radius: 8rpx;
  }

  .form-footer {
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
    gap: 16rpx;
    align-items: center;
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

.editor {
  min-height: 240rpx;
  max-height: 480rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  font-size: 28rpx;
  line-height: 1.6;
  background-color: #f8f8f8;
  border-radius: 8rpx;
}

.subtitle-list {
  padding-left: 32rpx;
  margin-top: 16rpx;
}

.subtitle-block {
  padding: 24rpx;
  margin-bottom: 16rpx;
  background: #f8f8f8;
  border-left: 4rpx solid var(--wot-primary);
  border-radius: 8rpx;
}

.edit-area {
  padding: 24rpx;
  margin-top: 16rpx;
  background: #fff;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 12rpx rgb(0 0 0 / 10%);
}

.edit-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16rpx;
  margin-top: 16rpx;
  border-top: 1rpx solid #eee;
}
</style>

<route lang="yaml">
style:
  navigationBarTitleText: ""
  navigationStyle: "custom"
</route>

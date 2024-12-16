<script setup lang="ts">
import { computed, ref } from 'vue'
import CustomSelect from '../common/CustomSelect.vue'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', data: { name: string, desc: string, format: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const projectName = ref('')
const projectDesc = ref('')
const formatValue = ref('')

const options = [
  { value: '简约科技风格', text: '简约科技风格' },
  { value: '简约黑白风格', text: '简约黑白风格' },
  { value: '简约卡通风格', text: '简约卡通风格' },
  { value: '更多模版及格式敬请期待', text: '更多模版及格式敬请期待' },
]

// 添加计算属性来处理 visible
const modelVisible = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val),
})

function handleClose() {
  emit('update:visible', false)
}

function handleConfirm() {
  emit('confirm', {
    name: projectName.value,
    desc: projectDesc.value,
    format: formatValue.value,
  })
  handleClose()
}

function handleFormatChange(e: string) {
  console.log('选择的格式：', e)
  formatValue.value = e
}
</script>

<template>
  <WdPopup
    v-model="modelVisible"
    position="center"
    custom-style="width: 680rpx; border-radius: 16rpx;"
    @close="handleClose"
  >
    <view class="popup-container">
      <view class="popup-header">
        <text class="popup-title">
          新建项目
        </text>
        <WdIcon name="close" @click="handleClose" />
      </view>

      <view class="popup-content">
        <view class="form-item">
          <WdInput v-model="projectName" placeholder="项目名称" />
        </view>

        <view class="form-item">
          <WdInput v-model="projectDesc" type="textarea" placeholder="描述" />
        </view>

        <view class="form-item">
          <CustomSelect
            v-model="formatValue"
            :options="options"
            placeholder="请选择模板风格"
            @change="handleFormatChange"
          />
        </view>
      </view>

      <view class="popup-footer">
        <WdButton block type="primary" @click="handleConfirm">
          确定
        </WdButton>
      </view>
    </view>
  </WdPopup>
</template>

<style lang="scss" scoped>
.popup-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 80vh;
}

.popup-header {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx 40rpx 24rpx;
  border-bottom: 2rpx solid #f5f5f5;

  .popup-title {
    font-size: 36rpx;
    font-weight: 500;
    color: var(--wot-text-color);
  }
}

.popup-content {
  flex: 1;
  padding: 32rpx 40rpx;
  overflow: hidden;
}

.popup-footer {
  flex: none;
  padding: 24rpx 40rpx 40rpx;
  border-top: 2rpx solid #f5f5f5;
}

.form-item {
  margin-bottom: 32rpx;

  &:last-child {
    margin-bottom: 0;
  }

  :deep(.wd-textarea) {
    height: 160rpx;
  }
}

:deep(.wd-popup__container) {
  overflow: visible !important;
}
</style>

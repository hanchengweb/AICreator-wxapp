<script setup lang="ts">
import { ref } from 'vue'

interface ToolbarOption {
  icon: string
  label: string
  shortcut?: string
  action: () => void
}

const templateValue = ref(0)
const templateOptions = [
  { label: '简约科技风格', value: 0 },
  { label: '商务专业风格', value: 1 },
  { label: '创意设计风格', value: 2 },
]

const toolbarOptions: ToolbarOption[] = [
  {
    icon: '📄',
    label: '打开文件',
    shortcut: '⌘+O',
    action: () => {
      uni.showToast({ title: '打开文件', icon: 'none' })
    },
  },
  {
    icon: '💾',
    label: '保存到...',
    shortcut: '⌘+S',
    action: () => {
      uni.showToast({ title: '保存到...', icon: 'none' })
    },
  },
  {
    icon: '🔄',
    label: '重置项目',
    action: () => {
      uni.showToast({ title: '重置项目', icon: 'none' })
    },
  },
  {
    icon: '🖼️',
    label: '导出图片',
    shortcut: '⌘+Shift+E',
    action: () => {
      uni.showToast({ title: '导出图片', icon: 'none' })
    },
  },
]

function handleTemplateChange({ value }) {
  console.log('模板切换:', value)
}
</script>

<template>
  <view class="toolbar">
    <view class="toolbar-left">
      <view class="logo">
        <image src="/static/logo.png" mode="aspectFit" class="logo-image" />
      </view>

      <view class="toolbar-actions">
        <view
          v-for="option in toolbarOptions"
          :key="option.label"
          class="toolbar-item"
          @tap="option.action"
        >
          <text class="icon">
            {{ option.icon }}
          </text>
          <text class="label">
            {{ option.label }}
          </text>
          <text v-if="option.shortcut" class="shortcut">
            {{ option.shortcut }}
          </text>
        </view>
      </view>
    </view>

    <view class="toolbar-right">
      <wd-drop-menu>
        <wd-drop-menu-item
          v-model="templateValue"
          :options="templateOptions"
          title="模板"
          @change="handleTemplateChange"
        />
      </wd-drop-menu>

      <view class="theme-colors">
        <view class="color-dot blue" />
        <view class="color-dot orange" />
        <view class="color-dot red" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 32rpx;
  background: #fff;
}

.toolbar-left {
  display: flex;
  gap: 48rpx;
  align-items: center;
}

.logo-image {
  width: 60rpx;
  height: 60rpx;
}

.toolbar-actions {
  display: flex;
  gap: 32rpx;
}

.toolbar-item {
  display: flex;
  gap: 16rpx;
  align-items: center;
  padding: 12rpx 24rpx;
  font-size: 28rpx;
  border-radius: 8rpx;

  &:active {
    background-color: #f5f5f5;
  }
}

.icon {
  font-size: 32rpx;
}

.shortcut {
  margin-left: 16rpx;
  font-size: 24rpx;
  color: #999;
}

.toolbar-right {
  display: flex;
  gap: 48rpx;
  align-items: center;
}

// 自定义下拉菜单样式
:deep(.wd-drop-menu) {
  --dropdown-menu-background: transparent;
  --dropdown-menu-title-padding: 0;
  --dropdown-menu-border: none;

  height: auto;

  .wd-drop-menu-item {
    &::after {
      display: none;
    }
  }
}

.theme-colors {
  display: flex;
  gap: 16rpx;
}

.color-dot {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;

  &.blue {
    background-color: #4080ff;
  }

  &.orange {
    background-color: #ff6b00;
  }

  &.red {
    background-color: #ff4d4f;
  }
}
</style>

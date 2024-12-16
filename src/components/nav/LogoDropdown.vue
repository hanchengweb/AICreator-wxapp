<script setup lang="ts">
import { ref } from 'vue'

interface MenuItem {
  icon: string
  label: string
  shortcut?: string
  action: () => void
}

const isVisible = ref(false)

const menuItems: MenuItem[] = [
  {
    icon: 'file',
    label: '打开文件',
    shortcut: '⌘+O',
    action: () => {
      uni.showToast({ title: '打开文件', icon: 'none' })
    },
  },
  {
    icon: 'download',
    label: '保存到...',
    shortcut: '⌘+S',
    action: () => {
      uni.showToast({ title: '保存到...', icon: 'none' })
    },
  },
  {
    icon: 'refresh',
    label: '重置项目',
    action: () => {
      uni.showToast({ title: '重置项目', icon: 'none' })
    },
  },
  {
    icon: 'picture-outline',
    label: '导出图片',
    shortcut: '⌘+Shift+E',
    action: () => {
      uni.showToast({ title: '导出图片', icon: 'none' })
    },
  },
]

const socialItems: MenuItem[] = [
  {
    icon: 'github-filled',
    label: 'Github',
    action: () => {
      uni.setClipboardData({
        data: 'https://github.com/your-repo',
        success: () => {
          uni.showToast({ title: '已复制 GitHub 地址', icon: 'none' })
        },
      })
    },
  },
  {
    icon: 'chat',
    label: 'TG 交流群',
    action: () => {
      uni.setClipboardData({
        data: 'https://t.me/your-group',
        success: () => {
          uni.showToast({ title: '已复制 TG 群链接', icon: 'none' })
        },
      })
    },
  },
]

function handleToggle() {
  isVisible.value = !isVisible.value
}

function handleClose() {
  isVisible.value = false
}

function handleItemClick(item: MenuItem) {
  item.action()
  handleClose()
}
</script>

<template>
  <view class="logo-dropdown">
    <!-- Logo 触发区域 -->
    <view class="trigger" @tap="handleToggle">
      <view class="nav-left">
        <image
          src="/static/logo.png"
          mode="aspectFit"
          class="nav-logo"
        />
        <text class="nav-title">
          OMGIMG
        </text>
        <wd-icon
          :name="isVisible ? 'up' : 'down'"
          size="12px"
          color="#666"
          custom-style="margin-left: 4px;"
        />
      </view>
    </view>

    <!-- 下拉菜单 -->
    <WdPopup
      v-model="isVisible"
      position="left"
      :close-on-click-overlay="true"
      custom-style="width: 280rpx; height: 100vh; top: var(--window-top);"
      @click-overlay="handleClose"
    >
      <view class="dropdown-content">
        <!-- 主要功能菜单 -->
        <view class="menu-section">
          <view
            v-for="item in menuItems"
            :key="item.label"
            class="menu-item"
            @tap="handleItemClick(item)"
          >
            <view class="item-left">
              <wd-icon :name="item.icon" size="16px" color="#666" />
              <text class="item-label">
                {{ item.label }}
              </text>
            </view>
            <text v-if="item.shortcut" class="item-shortcut">
              {{ item.shortcut }}
            </text>
          </view>
        </view>

        <!-- 分割线 -->
        <view class="divider" />

        <!-- 社交链接菜单 -->
        <view class="menu-section">
          <view
            v-for="item in socialItems"
            :key="item.label"
            class="menu-item"
            @tap="handleItemClick(item)"
          >
            <view class="item-left">
              <wd-icon :name="item.icon" size="16px" color="#666" />
              <text class="item-label">
                {{ item.label }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </WdPopup>
  </view>
</template>

<style lang="scss" scoped>
.logo-dropdown {
  position: relative;
}

.trigger {
  padding: 12rpx 0;
  cursor: pointer;
}

.nav-left {
  display: flex;
  gap: 12rpx;
  align-items: center;
}

.nav-logo {
  width: 48rpx;
  height: 48rpx;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--wot-text-color);
}

.dropdown-content {
  height: 100%;
  padding: 16rpx 0;
  background-color: #fff;
  box-shadow: 0 2rpx 12rpx rgb(0 0 0 / 10%);
}

.menu-section {
  padding: 8rpx 0;

  &:not(:last-child) {
    margin-bottom: 8rpx;
  }
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  transition: background-color 0.2s;

  &:active {
    background-color: #f5f5f5;
  }
}

.item-left {
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.item-label {
  font-size: 28rpx;
  color: var(--wot-text-color);
}

.item-shortcut {
  font-size: 24rpx;
  color: #999;
}

.divider {
  height: 1px;
  margin: 8rpx 0;
  background-color: #eee;
}
</style>

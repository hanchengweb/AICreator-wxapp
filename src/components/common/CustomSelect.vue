<script setup lang="ts">
import { ref, watch } from 'vue'

interface Option {
  value: string
  text: string
}

interface Props {
  modelValue: string
  options: Option[]
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = ref(false)
const selectedText = ref('')

watch(
  () => props.modelValue,
  (newVal) => {
    const option = props.options.find(opt => opt.value === newVal)
    selectedText.value = option?.text || ''
  },
  { immediate: true },
)

function handleSelect(option: Option) {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
}

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function handleClickOutside() {
  isOpen.value = false
}
</script>

<template>
  <view class="custom-select" @click.stop>
    <view
      class="select-input"
      :class="{ active: isOpen }"
      @click="toggleDropdown"
    >
      <text class="select-text" :class="{ placeholder: !selectedText }">
        {{ selectedText || placeholder }}
      </text>
      <WdIcon
        :name="isOpen ? 'up' : 'down'"
        class="select-arrow"
      />
    </view>
    <view
      v-if="isOpen"
      class="select-dropdown"
    >
      <scroll-view
        scroll-y
        class="select-scroll"
      >
        <view
          v-for="option in options"
          :key="option.value"
          class="select-option"
          :class="{ active: modelValue === option.value }"
          @click="handleSelect(option)"
        >
          {{ option.text }}
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.custom-select {
  position: relative;
  width: 100%;
}

.select-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  padding: 0 24rpx;
  background-color: #fff;
  border: 2rpx solid #dcdfe6;
  border-radius: 8rpx;
  transition: all 0.2s ease;

  &.active {
    border-color: var(--wot-primary);
  }
}

.select-text {
  flex: 1;
  font-size: 28rpx;
  color: var(--wot-text-color);

  &.placeholder {
    color: #999;
  }
}

.select-arrow {
  margin-left: 16rpx;
  color: #999;
  transition: transform 0.2s ease;
}

.select-dropdown {
  position: relative;
  top: calc(100% + 4rpx);
  left: 0;
  z-index: 100;
  width: 100%;
  background-color: #fff;
  border: 1rpx solid #ebeef5;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 12rpx 0 rgb(0 0 0 / 10%);
}

.select-scroll {
  max-height: 320rpx;
}

.select-option {
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  color: var(--wot-text-color);
  transition: background-color 0.2s ease;

  &.active {
    color: var(--wot-primary);
    background-color: var(--wot-primary-light);
  }

  &:active {
    background-color: #f5f7fa;
  }
}
</style>

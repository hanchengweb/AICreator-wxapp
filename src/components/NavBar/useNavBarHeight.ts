import { computed, type CSSProperties, unref } from 'vue'

export function useNavBarHeight() {
  const statusBarHeight = computed(() => {
    const { statusBarHeight: _statusBarHeight } = uni.getWindowInfo()

    return _statusBarHeight ?? 0
  })

  const navBarHeight = computed(() => {
    // 获取系统信息
    const { screenWidth = 0 } = uni.getWindowInfo()

    try {
      // 胶囊按钮位置信息
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect()

      return {
      // 导航栏高度
        height: menuButtonInfo.height,
        minHeight: menuButtonInfo.height,
        lineHeight: menuButtonInfo.height,
        // 导航栏距离顶部距离
        paddingTop: menuButtonInfo.top - unref(statusBarHeight),
        paddingBottom: menuButtonInfo.top - unref(statusBarHeight),
        // 胶囊距右方间距（方保持左、右间距一致）
        paddingLeft: screenWidth - menuButtonInfo.right,
      }
    }
    catch (error) {
      return {
        height: 32,
        minHeight: 32,
        lineHeight: 32,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 7,
      }
    }
  })

  const mainHeight = computed(() => {
    const { height, paddingTop, paddingBottom } = unref(navBarHeight)

    // 状态栏高度 + 顶栏内容高度 + 顶栏上边距 + 顶栏下边距
    return height + unref(statusBarHeight) + paddingTop + paddingBottom
  })

  const navBarStyleVars = computed<CSSProperties>(() => {
    const _styles: CSSProperties = {
      // 导航栏高度
      '--navbar-height': `${unref(mainHeight)}px`,
    }

    return _styles
  })

  return {
    statusBarHeight,
    navBarHeight,
    mainHeight,
    navBarStyleVars,
  }
}

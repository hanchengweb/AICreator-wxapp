import type { App } from 'vue'
import devalue from '@nuxt/devalue'
import * as Pinia from 'pinia'
import { createPinia as _createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

// uniapp 目前依赖 vue3.2+，需要锁定 pinia 版本为 2.0.36
export const pinia = _createPinia()

export function createPinia(app: App) {
  pinia.use(
    createPersistedState({
      storage: {
        getItem: uni.getStorageSync,
        setItem: uni.setStorageSync,
      },
    }),
  )
  app.use(pinia)

  devalue(pinia.state.value)
}

export { Pinia }

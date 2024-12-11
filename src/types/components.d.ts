declare module '@/components/VTabbar/index.vue' {
  import { DefineComponent } from 'vue'
  
  interface Props {
    value: 'home' | 'article' | 'video' | 'optimize' | 'my'
    fixed?: boolean
    safeAreaInsetBottom?: boolean
    placeholder?: boolean
  }

  const component: DefineComponent<Props>
  export default component
} 
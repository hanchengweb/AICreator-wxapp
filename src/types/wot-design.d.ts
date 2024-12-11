declare module 'wot-design-uni' {
  export function useMessage(): {
    confirm: (options: { msg: string, title?: string }) => Promise<void>
  }

  export function useNotify(): {
    showNotify: (options: { type: string, message: string }) => void
  }

  export function useToast(): {
    show: (message: string) => void
  }
}

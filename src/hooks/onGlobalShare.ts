import { shareImg } from '@/static'

const APP_NAME = import.meta.env.VITE_APP_NAME

export default function onGlobalShare(options: Page.ShareAppMessageOption): Page.CustomShareContent {
  const shareOptions: Page.CustomShareContent = {
    title: `好友邀你使用 ${APP_NAME}`,
    path: 'pages/welcome/welcome',
    imageUrl: shareImg,
  }

  return shareOptions
}

import { yikoyu } from '@yikoyu/stylelint-config'

export default yikoyu({
  plugins: ['stylelint-scss'],
  rules: {
    ...yikoyu().rules,
    'scss/at-mixin-pattern': null,
    'selector-type-no-unknown': null,
  },
})

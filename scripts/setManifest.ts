import fs from 'node:fs'
import path from 'node:path'
import { createLogger } from 'vite'

/**
 * @description 动态修改 manifest.json
 * @return {*}
 */

export class SetManifest {
  private static manifestPath: string = '../src/manifest.json'
  private static manifest: string = fs.readFileSync(path.join(__dirname, this.manifestPath), {
    encoding: 'utf-8',
  })

  static replace(path: string, value: string) {
    const arr = path.split('.')

    const len = arr.length

    const lastItem = arr[len - 1]

    let i = 0

    const ManifestArr = this.manifest.split(/\n/)

    for (let index = 0, _len = ManifestArr.length; index < _len; index++) {
      const item = ManifestArr[index]

      if (new RegExp(`"${arr[i]}"`).test(item))
        ++i

      if (i === len) {
        const hasComma = /,/.test(item)

        ManifestArr[index] = item.replace(
          new RegExp(`"${lastItem}"[\\s\\S]*:[\\s\\S]*`),
          `"${lastItem}": ${value}${hasComma ? ',' : ''}`,
        )

        break
      }
    }

    this.manifest = ManifestArr.join('\n')

    createLogger().info(`[manifest] set ${path} = ${value}`)
  }

  static write() {
    fs.writeFileSync(path.join(__dirname, this.manifestPath), this.manifest, {
      flag: 'w',
    })

    createLogger().info('[manifest] write config success !')
  }
}

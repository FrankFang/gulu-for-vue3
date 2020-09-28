// @ts-nocheck
import path from 'path'
import fs from 'fs'
import marked from 'marked'



// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// 请注意，当前文件的后缀从 .js 改为了 .ts
// 如果你看到这行注释，请确认文件后缀是 .ts
// 然后就可以删掉本注释了!!!!!!!!!!!!!!!!







const mdToJs = str => {
  const content = JSON.stringify(marked(str))
  return `export default ${content}`
}

export function md() {
  return {
    configureServer: [ // 用于开发
      async ({ app }) => {
        app.use(async (ctx, next) => { // koa
          if (ctx.path.endsWith('.md')) {
            ctx.type = 'js'
            const filePath = path.join(process.cwd(), ctx.path)
            ctx.body = mdToJs(fs.readFileSync(filePath).toString())
          } else {
            await next()
          }
        })
      },
    ],
    transforms: [{  // 用于 rollup // 插件
      test: context => context.path.endsWith('.md'),
      transform: ({ code }) => mdToJs(code) 
    }]
  }
}
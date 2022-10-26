import mdItCustomAttrs from 'markdown-it-custom-attrs'

module.exports = {
  title: 'LowCode',
  description: 'LowCode document',
  dest: './dist', // 打包目录
  // 使用插件
  plugins: [
    '@vuepress/active-header-links',   // 页面滚动时自动激活侧边栏链接的插件
    '@vuepress/back-to-top',          // 返回顶部插件
    '@vuepress/medium-zoom',          // 图片预览插件
    '@vuepress/nprogress',        //页面顶部进度条
  ],
  lastUpdated: true, // 获取每个文件最后一次 git 提交的 UNIX 时间戳(ms)，同时它将以合适的日期格式显示在每一页的底部
  // 主题配置
  themeConfig: {
    // lastUpdatedText:'最后更新',
    smoothScroll: true, // 启动页面丝滑滚动
    logo: '/favicon.ico',
    sidebar: {
      '/': getSidebar()
    }
  },
  head: [
    [
      'link', {rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css'},
    ],
    [
      'script', {src: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js'}
    ],
  ],
  markdown: {
    lineNumbers: true, // 代码块添加行标识
    config: (md) => {
      md.use(mdItCustomAttrs, 'image', { // 点击图片可放大
        'data-fancybox': 'gallery'
      })
    } 
  }
}

function getSidebar() {
  return [
      {
          text: '介绍',
          items: [
              { text: '介绍', link: '/index.md' },
              { text: '说明', link: '/instruction.md' },
          ],
          collapsible: true, // 配置可折叠侧边栏
      },
      {
          text: '应用示例',
          items:[
              { text: '一个简单的表单', link: '/examples/example1.md' },
              { text: '交互事件', link: '/examples/example2.md' },
              { text: '下拉组件选择联动', link: '/examples/example3.md' },
          ],
          collapsible: true,
      },
      {
        text: '使用手册',
        items:[
            { text: '表单及组件属性设置', link: '/userGuide/guide1.md' },
            { text: '栅格布局使用', link: '/userGuide/guide2.md' },
            { text: '数据流转', link: '/userGuide/guide3.md' },
            { text: '表单状态控制', link: '/userGuide/guide4.md' },
            { text: '选择项设置与加载', link: '/userGuide/guide5.md' },
            { text: '数据源管理', link: '/userGuide/guide8.md' },
        ],
        collapsible: true,
    },
  ]
}
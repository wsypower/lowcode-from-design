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
  // 主题配置
  themeConfig: {
    lastUpdated: true, // 获取每个文件最后一次 git 提交的 UNIX 时间戳(ms)，同时它将以合适的日期格式显示在每一页的底部
    smoothScroll: true, // 启动页面丝滑滚动
    logo: '/favicon.ico',
    // 导航栏配置
    nav: [
      // {text: '我的个人网站', link: 'https://www.cooldream.fun/home' },
      // {text: '掘金', link: 'https://juejin.cn/user/1855631359481847/posts'},
      // {text: 'Github', link: 'https://github.com/Jack-Star-T'}
    ],
    sidebar: {
      '/': getSidebar()
    }
  },
  markdown: {
    lineNumbers: true, // 代码块添加行标识 
  }
}

function getSidebar() {
  return [
      {
          text: '介绍',
          items: [
              { text: '基础', link: '/index.md' },
          ],
          collapsible: true, // 配置可折叠侧边栏
          // sidebarDepth:3
      },
      {
          text: '应用示例',
          items:[
              { text: '基础', link: '/demo/demo.md' },
              { text: '基础1', link: '/demo/demo1.md' },
              { text: '基础2', link: '/demo/demo2.md' },
          ],
          collapsible: true,
      },
  ]
}
export default defineAppConfig({
  pages: [
    'pages/pending/index',
    'pages/decisions/index',
    'pages/mine/index',
    'pages/preview/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1E5AE8',
    navigationBarTitleText: '密级审批',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F7FA'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#1E5AE8',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/pending/index',
        text: '待审批'
      },
      {
        pagePath: 'pages/decisions/index',
        text: '我的决策'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})

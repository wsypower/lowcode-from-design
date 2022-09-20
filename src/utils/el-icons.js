import * as ElIcons from '@element-plus/icons-vue'

export function registerIcon(app) {
  for (const iconName in ElIcons) {
    app.component(iconName, ElIcons[iconName])
  }
}

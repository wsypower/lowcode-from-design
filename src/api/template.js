import request from './request'

// 获取表单详情信息
export function getForm(formId) {
  return request({
    url: `/design/detail/${formId}`,
    method: 'GET',
  })
}

// 保存模板信息
export function saveForm(data = {}) {
  return request({
    url: '/design/draft',
    method: 'POST',
    data,
  })
}


// 获取模板信息
export function getTemplate(templateId) {
  return request({
    url: `/template/detail/${templateId}`,
    method: 'GET',
  })
}

// 保存模板
export function saveTemplate(data = {}) {
  return request({
    url: '/template/formSave',
    method: 'POST',
    data,
  })
}



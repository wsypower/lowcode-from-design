import request from './request'

// 获取字段组全量列表
export function getFieldGroupList(params = {}) {
  return request({
    url: '/template/category/list',
    method: 'GET',
    params: {
      type: 'FIELD',
      ...params,
    },
  })
}

// 获取字段全量列表
export function getFieldList(params = {}) {
  return request({
    url: '/template/fieldList',
    method: 'GET',
    params,
  })
}

// 获取字段配置项json
export function getFieldJson(params = {}) {
  return request({
    url: `/template/viewMeta/${params.id}`,
    method: 'GET',
  })
}

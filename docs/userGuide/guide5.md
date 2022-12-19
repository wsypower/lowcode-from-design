# 选择项设置与加载

>此处的选择项是指radio单选项、checkbox多选项、select下拉选项组件的可选择项目。

选择项支持3种设置方法：

## 1.使用表单设计器管理选择项
表单设计阶段，可通过组件属性设置面板操作：
<ImagesVue :img-src="'/images/guide5/guide5-1.png'" />
>可以批量导入选择项，每一行以英文逗号分隔，如不包含英文逗号，则选择项的value和label同值：
<ImagesVue :img-src="'/images/guide5/guide5-2.png'" />

## 2. 使用API方法动态加载选择项
表单运行阶段，可调用组件自身的API方法<b>loadOptions(options)</b>动态加载选择项，选择项格式为：
```JS
[
  {label: '选项1', value: '1'},
  {label: '选项2', value: '2'},
  {label: '选项3', value: '3'}
]
```
>示例：
在表单的 <b>onFormMounted</b> 事件中通过axios调用后端接口，动态加载产品类型，代码如下图：
<ImagesVue :img-src="'/images/guide5/guide5-3.png'" />
运行后如下图：
<ImagesVue :img-src="'/images/guide5/guide5-4.png'" />
表单JSON如下，复制JSON，在表单设计器（[点此进入](http://120.92.142.115:81/vform3/)）中选择“导入JSON”即可看到效果：
```JSON
{
  "widgetList": [
    {
      "type": "select",
      "icon": "select-field",
      "formItemFlag": true,
      "options": {
        "name": "productType",
        "label": "产品类型",
        "labelAlign": "",
        "defaultValue": "",
        "placeholder": "",
        "columnWidth": "200px",
        "size": "",
        "labelWidth": null,
        "labelHidden": false,
        "disabled": false,
        "hidden": false,
        "clearable": true,
        "filterable": false,
        "allowCreate": false,
        "remote": false,
        "automaticDropdown": false,
        "multiple": false,
        "multipleLimit": 0,
        "optionItems": [],
        "required": false,
        "validation": "",
        "validationHint": "",
        "customClass": "",
        "labelIconClass": null,
        "labelIconPosition": "rear",
        "labelTooltip": null,
        "onCreated": "",
        "onMounted": "",
        "onRemoteQuery": "",
        "onChange": "",
        "onFocus": "",
        "onBlur": "",
        "onValidate": ""
      },
      "id": "select87612"
    }
  ],
  "formConfig": {
    "modelName": "formData",
    "refName": "vForm",
    "rulesName": "rules",
    "labelWidth": 80,
    "labelPosition": "left",
    "size": "",
    "labelAlign": "label-left-align",
    "cssCode": "",
    "customClass": "",
    "functions": "",
    "layoutType": "PC",
    "onFormCreated": "",
    "onFormMounted": "  let productTypeR = this.getWidgetRef('productType')\n  \n  axios.get(\"https://www.fastmock.site/mock/2de212e0dc4b8e0885fea44ab9f2e1d0/vform/getOptions\").then(function(res) {\n    //console.log(res.data)\n    productTypeR.loadOptions(res.data)\n  }).catch(function(error) {\n    console.log(error)\n  })",
    "onFormDataChange": "",
    "dataSources": [],
    "onFormValidate": "",
    "jsonVersion": 3
  }
}
```

## 3. 使用表单option-data属性导入选择项
表单运行阶段，即已经完成设计之后的渲染表单阶段，通过VFormRender的option-data属性一次性导入多个组件的选择项，属性值格式为：
```JS
{
  'gender': [
    {label: '男', value: '1'},
    {label: '女', value: '2'}
  ],
  'paymentType': [
    {label: '支付宝', value: 'alipay'},
    {label: '微信', value: 'wechat'}
  ]
}
// gender与paymentType表示选择项的唯一名称
```
>需要注意的是，option-data属性加载的选择项不是响应式更新的，仅在表单初始化时被组件加载，因此当option-data属性指向的选择项数据有更新后，应该手动调用reloadOptionData方法刷新。

## 4. 使用数据源加载选择项
选项的数据源配置功能：[数据源管理](./guide7.md)
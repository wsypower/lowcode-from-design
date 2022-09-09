# 效果演示
一个简单的表单：
<ImagesVue :img-src="'../public/images/demo1/demo1.png'" :tipsText="'(点击图片可放大查看，以下所有图片同)'"></ImagesVue>

<p></p>

# 在线体验


表单 JSON 如下，复制 JSON，在表单设计器（[点此进入](http://120.92.142.115:81/vform3/)）中选择‘导入 JSON’即可看到效果
ps：鼠标移至代码块中，右上角出现小图标，点击即可复制

```JSON
{
  "widgetList": [
    {
      "key": 63946,
      "type": "grid",
      "category": "container",
      "icon": "widget-grid",
      "cols": [
        {
          "type": "grid-col",
          "category": "container",
          "icon": "grid-col",
          "internal": true,
          "widgetList": [
            {
              "key": 42299,
              "type": "input",
              "icon": "widget-input",
              "formItemFlag": true,
              "options": {
                "name": "name",
                "label": "姓名",
                "labelAlign": "",
                "type": "text",
                "defaultValue": "",
                "placeholder": "",
                "columnWidth": "200px",
                "size": "",
                "labelWidth": null,
                "labelHidden": false,
                "readonly": false,
                "disabled": false,
                "hidden": false,
                "clearable": true,
                "showPassword": false,
                "required": true,
                "requiredHint": "",
                "validation": "",
                "validationHint": "",
                "customClass": [],
                "labelIconClass": null,
                "labelIconPosition": "rear",
                "labelTooltip": null,
                "minLength": null,
                "maxLength": null,
                "showWordLimit": false,
                "prefixIcon": "",
                "suffixIcon": "",
                "appendButton": false,
                "appendButtonDisabled": false,
                "buttonIcon": "custom-search",
                "onCreated": "",
                "onMounted": "",
                "onInput": "",
                "onChange": "",
                "onFocus": "",
                "onBlur": "",
                "onValidate": "",
                "onAppendButtonClick": ""
              },
              "id": "input31369"
            }
          ],
          "options": {
            "name": "gridCol75467",
            "hidden": false,
            "span": 12,
            "offset": 0,
            "push": 0,
            "pull": 0,
            "responsive": false,
            "md": 12,
            "sm": 12,
            "xs": 12,
            "customClass": []
          },
          "id": "grid-col-75467"
        },
        {
          "type": "grid-col",
          "category": "container",
          "icon": "grid-col",
          "internal": true,
          "widgetList": [
            {
              "key": 63410,
              "type": "radio",
              "icon": "widget-radio",
              "formItemFlag": true,
              "options": {
                "name": "sex",
                "label": "性别",
                "labelAlign": "",
                "defaultValue": 1,
                "columnWidth": "200px",
                "size": "",
                "displayStyle": "inline",
                "buttonStyle": false,
                "border": false,
                "labelWidth": null,
                "labelHidden": false,
                "disabled": false,
                "hidden": false,
                "dsEnabled": false,
                "dsName": "",
                "labelKey": "label",
                "valueKey": "value",
                "optionItems": [
                  {
                    "label": "女士",
                    "value": 1
                  },
                  {
                    "label": "先生",
                    "value": 2
                  }
                ],
                "required": true,
                "requiredHint": "",
                "validation": "",
                "validationHint": "",
                "customClass": [],
                "labelIconClass": null,
                "labelIconPosition": "rear",
                "labelTooltip": null,
                "onCreated": "",
                "onMounted": "",
                "onChange": "",
                "onValidate": ""
              },
              "id": "radio16927"
            }
          ],
          "options": {
            "name": "gridCol80928",
            "hidden": false,
            "span": 12,
            "offset": 0,
            "push": 0,
            "pull": 0,
            "responsive": false,
            "md": 12,
            "sm": 12,
            "xs": 12,
            "customClass": []
          },
          "id": "grid-col-80928"
        }
      ],
      "options": {
        "name": "grid104391",
        "hidden": false,
        "gutter": 12,
        "colHeight": null,
        "customClass": []
      },
      "id": "grid104391"
    },
    {
      "key": 66662,
      "type": "grid",
      "category": "container",
      "icon": "widget-grid",
      "cols": [
        {
          "type": "grid-col",
          "category": "container",
          "icon": "grid-col",
          "internal": true,
          "widgetList": [
            {
              "key": 82823,
              "type": "number",
              "icon": "widget-calc",
              "formItemFlag": true,
              "options": {
                "name": "age",
                "label": "年龄",
                "labelAlign": "",
                "defaultValue": 18,
                "placeholder": "",
                "columnWidth": "200px",
                "size": "",
                "labelWidth": null,
                "labelHidden": false,
                "disabled": false,
                "hidden": false,
                "required": true,
                "requiredHint": "",
                "validation": "",
                "validationHint": "",
                "customClass": [],
                "labelIconClass": null,
                "labelIconPosition": "rear",
                "labelTooltip": null,
                "min": -100000000000,
                "max": 100000000000,
                "precision": 0,
                "step": 1,
                "controlsPosition": "right",
                "onCreated": "",
                "onMounted": "",
                "onChange": "",
                "onFocus": "",
                "onBlur": "",
                "onValidate": ""
              },
              "id": "number77098"
            }
          ],
          "options": {
            "name": "gridCol112344",
            "hidden": false,
            "span": 12,
            "offset": 0,
            "push": 0,
            "pull": 0,
            "responsive": false,
            "md": 12,
            "sm": 12,
            "xs": 12,
            "customClass": ""
          },
          "id": "grid-col-112344"
        },
        {
          "type": "grid-col",
          "category": "container",
          "icon": "grid-col",
          "internal": true,
          "widgetList": [
            {
              "key": 94620,
              "type": "select",
              "icon": "widget-select",
              "formItemFlag": true,
              "options": {
                "name": "educational",
                "label": "教育程度",
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
                "dsEnabled": false,
                "dsName": "",
                "labelKey": "label",
                "valueKey": "value",
                "optionItems": [
                  {
                    "label": "本科",
                    "value": 1
                  },
                  {
                    "label": "专科",
                    "value": 2
                  },
                  {
                    "label": "硕士",
                    "value": 3
                  }
                ],
                "required": false,
                "requiredHint": "",
                "validation": "",
                "validationHint": "",
                "customClass": [],
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
              "id": "select94106"
            }
          ],
          "options": {
            "name": "gridCol72376",
            "hidden": false,
            "span": 12,
            "offset": 0,
            "push": 0,
            "pull": 0,
            "responsive": false,
            "md": 12,
            "sm": 12,
            "xs": 12,
            "customClass": []
          },
          "id": "grid-col-72376"
        }
      ],
      "options": {
        "name": "grid89340",
        "hidden": false,
        "gutter": 12,
        "colHeight": null,
        "customClass": []
      },
      "id": "grid89340"
    },
    {
      "key": 63946,
      "type": "grid",
      "category": "container",
      "icon": "widget-grid",
      "cols": [
        {
          "type": "grid-col",
          "category": "container",
          "icon": "grid-col",
          "internal": true,
          "widgetList": [
            {
              "key": 86518,
              "type": "textarea",
              "icon": "widget-textarea",
              "formItemFlag": true,
              "options": {
                "name": "other",
                "label": "其他",
                "labelAlign": "",
                "rows": 3,
                "defaultValue": "",
                "placeholder": "",
                "columnWidth": "200px",
                "size": "",
                "labelWidth": null,
                "labelHidden": false,
                "readonly": false,
                "disabled": false,
                "hidden": false,
                "required": false,
                "requiredHint": "",
                "validation": "",
                "validationHint": "",
                "customClass": [],
                "labelIconClass": null,
                "labelIconPosition": "rear",
                "labelTooltip": null,
                "minLength": null,
                "maxLength": null,
                "showWordLimit": false,
                "onCreated": "",
                "onMounted": "",
                "onInput": "",
                "onChange": "",
                "onFocus": "",
                "onBlur": "",
                "onValidate": ""
              },
              "id": "textarea103774"
            }
          ],
          "options": {
            "name": "gridCol45422",
            "hidden": false,
            "span": 24,
            "offset": 0,
            "push": 0,
            "pull": 0,
            "responsive": false,
            "md": 12,
            "sm": 12,
            "xs": 12,
            "customClass": ""
          },
          "id": "grid-col-45422"
        }
      ],
      "options": {
        "name": "grid36078",
        "hidden": false,
        "gutter": 12,
        "colHeight": null,
        "customClass": []
      },
      "id": "grid36078"
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
    "cssCode": ".bold-title {\n  font-weight: 700;\n}",
    "customClass": [],
    "functions": "",
    "layoutType": "PC",
    "jsonVersion": 3,
    "onFormCreated": "",
    "onFormMounted": "",
    "onFormDataChange": "",
    "dataSources": [
      {
        "dataSourceId": "ds56718",
        "uniqueName": "22",
        "requestURL": "223333",
        "requestURLType": "String",
        "requestMethod": "get",
        "description": "",
        "headers": [],
        "params": [],
        "data": [],
        "configHandlerCode": "  return config",
        "dataHandlerCode": "  return result.data.data;",
        "errorHandlerCode": "  $message.error(error.message);"
      }
    ],
    "onFormValidate": ""
  }
}
```

<p></p>

# 如何生成
### 1. 选择容器
<ImagesVue :img-src="'../public/images/demo1/step1.png'" ></ImagesVue>
从左侧组件库中选中栅格组件拖拽至中间后放开即可，此时右侧的组件设置tab即为对拖拽选中组件（栅格组件）的属性设置

### 2. 拖拽设置表单项
<ImagesVue :img-src="'../public/images/demo1/step2.png'"></ImagesVue>
字段组件的唯一名称属性为提交给后端的字段名，同一表单中唯一名称不可重复。标签属性为左侧label名。勾选必填字段属性则提交表单时会自动校验是否有值。
<ImagesVue :img-src="'../public/images/demo1/step3.png'"></ImagesVue>
单选项的选项设置可直接在右侧属性设置，并选好默认选中项（也可以不选）
<ImagesVue :img-src="'../public/images/demo1/step4.png'"></ImagesVue>
<ImagesVue :img-src="'../public/images/demo1/step5.png'"></ImagesVue>
<ImagesVue :img-src="'../public/images/demo1/step6.png'"></ImagesVue>
重新拖拽个栅格组件并选中右边栅格列，点击删除按钮
<ImagesVue :img-src="'../public/images/demo1/step7.png'"></ImagesVue>
栅格宽度设置为24，占满一行
<ImagesVue :img-src="'../public/images/demo1/step8.png'"></ImagesVue>
完成 ！<br />
点击右上方预览按钮即可预览表单

<style lang="scss" scoped>
  .language-JSON.line-numbers-mode {
    max-height: 500px;
  }
</style>

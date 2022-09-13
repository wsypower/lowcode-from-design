# 交互事件
## 效果演示
点击喝酒或者喝饮料，下方对应出现不同的选择列表
<ImagesVue :img-src="'/images/example2/example2-1.png'" />
<ImagesVue :img-src="'/images/example2/example2-2.png'" />

## 在线体验
表单 JSON 如下，复制 JSON，在表单设计器（[点此进入](http://120.92.142.115:81/vform3/)）中选择‘导入 JSON’即可看到效果
ps：鼠标移至代码块中，右上角出现小图标，点击即可复制
```JSON
{
  "widgetList": [
    {
      "type": "grid",
      "category": "container",
      "icon": "grid",
      "cols": [
        {
          "type": "grid-col",
          "category": "container",
          "icon": "grid-col",
          "internal": true,
          "widgetList": [
            {
              "type": "radio",
              "icon": "radio-field",
              "formItemFlag": true,
              "options": {
                "name": "drinkRadio",
                "label": "喜欢喝酒还是饮料？",
                "labelAlign": "",
                "defaultValue": null,
                "columnWidth": "200px",
                "size": "",
                "displayStyle": "inline",
                "labelWidth": null,
                "labelHidden": false,
                "disabled": false,
                "hidden": false,
                "optionItems": [
                  {
                    "label": "喝酒",
                    "value": 1
                  },
                  {
                    "label": "喝饮料",
                    "value": 2
                  }
                ],
                "required": false,
                "validation": "",
                "validationHint": "",
                "customClass": [],
                "labelIconClass": null,
                "labelIconPosition": "rear",
                "labelTooltip": null,
                "onCreated": "",
                "onMounted": "",
                "onChange": "var alcoholChkWidget = this.getWidgetRef('alcoholChk')\nvar drinkChkWidget = this.getWidgetRef('drinkChk')\n\nif (value === 1) {\n  alcoholChkWidget.setHidden(false)\n  drinkChkWidget.setHidden(true)\n} else {\n  alcoholChkWidget.setHidden(true)\n  drinkChkWidget.setHidden(false)\n}",
                "onValidate": ""
              },
              "displayName": "单选项",
              "id": "radio98420"
            }
          ],
          "options": {
            "name": "gridCol89539",
            "hidden": false,
            "span": 24
          },
          "id": "grid-col-89539"
        },
        {
          "type": "grid-col",
          "category": "container",
          "icon": "grid-col",
          "internal": true,
          "widgetList": [
            {
              "type": "checkbox",
              "icon": "checkbox-field",
              "formItemFlag": true,
              "options": {
                "name": "alcoholChk",
                "label": "喝什么酒",
                "labelAlign": "",
                "defaultValue": [],
                "columnWidth": "200px",
                "size": "",
                "displayStyle": "inline",
                "labelWidth": null,
                "labelHidden": false,
                "readonly": false,
                "disabled": false,
                "hidden": true,
                "optionItems": [
                  {
                    "label": "茅台",
                    "value": 1
                  },
                  {
                    "label": "二锅头",
                    "value": 2
                  },
                  {
                    "label": "伏尔加",
                    "value": 3
                  }
                ],
                "required": false,
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
              "displayName": "多选项",
              "id": "checkbox46135"
            }
          ],
          "options": {
            "name": "gridCol76644",
            "hidden": false,
            "span": 24,
            "customClass": []
          },
          "id": "grid-col-76644"
        },
        {
          "type": "grid-col",
          "category": "container",
          "icon": "grid-col",
          "internal": true,
          "widgetList": [
            {
              "type": "checkbox",
              "icon": "checkbox-field",
              "formItemFlag": true,
              "options": {
                "name": "drinkChk",
                "label": "喝啥子饮料",
                "labelAlign": "",
                "defaultValue": [],
                "columnWidth": "200px",
                "size": "",
                "displayStyle": "inline",
                "labelWidth": null,
                "labelHidden": false,
                "readonly": false,
                "disabled": false,
                "hidden": true,
                "optionItems": [
                  {
                    "label": "肥宅水",
                    "value": 1
                  },
                  {
                    "label": "白花蛇草水",
                    "value": 2
                  },
                  {
                    "label": "农夫山泉有点田",
                    "value": 3
                  }
                ],
                "required": false,
                "validation": "",
                "validationHint": "",
                "customClass": "",
                "labelIconClass": null,
                "labelIconPosition": "rear",
                "labelTooltip": null,
                "onCreated": "",
                "onMounted": "",
                "onChange": "",
                "onValidate": ""
              },
              "displayName": "多选项",
              "id": "checkbox48765"
            }
          ],
          "options": {
            "name": "gridCol17019",
            "hidden": false,
            "span": 24
          },
          "id": "grid-col-17019"
        }
      ],
      "options": {
        "name": "grid85701",
        "hidden": false,
        "gutter": 12,
        "customClass": []
      },
      "displayName": "栅格",
      "id": "grid85701"
    }
  ],
  "formConfig": {
    "modelName": "formData",
    "refName": "vForm",
    "rulesName": "rules",
    "labelWidth": 200,
    "labelPosition": "left",
    "size": "",
    "labelAlign": "label-left-align",
    "cssCode": "",
    "customClass": [],
    "functions": "",
    "layoutType": "PC",
    "jsonVersion": 3,
    "dataSources": [],
    "onFormCreated": "",
    "onFormMounted": "",
    "onFormDataChange": "",
    "onFormValidate": ""
  }
}
```

## 如何生成
### 1. 完成静态表单
<ImagesVue :img-src="'/images/example2/step1.png'" />

### 2. 编写交互代码
在单选项组件的事件属性中选择onChange事件，编写处理代码
<ImagesVue :img-src="'/images/example2/step2.png'" />

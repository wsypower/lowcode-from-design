# 下拉组件选择联动
## 效果演示
当地区选项改变后，安装地址的选项联动变化
<ImagesVue :img-src="'/images/example3/example3-1.png'" />
<ImagesVue :img-src="'/images/example3/example3-2.png'" />
<ImagesVue :img-src="'/images/example3/example3-3.png'" />

## 在线体验
表单 JSON 如下，复制 JSON，在表单设计器（[点此进入](http://120.92.142.115:81/vform3/)）中选择‘导入 JSON’即可看到效果
ps：鼠标移至代码块中，右上角出现小图标，点击即可复制
```JSON
{
  "widgetList": [
    {
      "type": "select",
      "icon": "select-field",
      "formItemFlag": true,
      "options": {
        "name": "citySelect",
        "label": "地区",
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
        "customClass": [],
        "labelIconClass": null,
        "labelIconPosition": "rear",
        "labelTooltip": null,
        "onCreated": "",
        "onMounted": "",
        "onRemoteQuery": "",
        "onChange": "var addressAPI = 'https://www.fastmock.site/mock/2de212e0dc4b8e0885fea44ab9f2e1d0/vform/getAddress?cityId='\nvar addressSelectR = this.getWidgetRef('addressSelect')\n\naxios.get(addressAPI + value).then(function(res) {\n  addressSelectR.loadOptions(res.data.data)\n  \n  //if (!value) {\n  //  addressSelectR.setValue(null)\n  //}\n}).catch(function(error) {\n  console.error(error)\n})\n\naddressSelectR.setValue(null)\n",
        "onFocus": "",
        "onBlur": "",
        "onValidate": ""
      },
      "id": "select78413"
    },
    {
      "type": "select",
      "icon": "select-field",
      "formItemFlag": true,
      "options": {
        "name": "addressSelect",
        "label": "安装地址",
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
      "id": "select90599"
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
    "jsonVersion": 3,
    "dataSources": [],
    "onFormCreated": "",
    "onFormMounted": "var citySelectR = this.getWidgetRef('citySelect')\n\naxios.get('https://www.fastmock.site/mock/2de212e0dc4b8e0885fea44ab9f2e1d0/vform/getCity').then(function(res) {\n  citySelectR.loadOptions(res.data.data)\n}).catch(function(error) {\n  console.error(error)\n})",
    "onFormDataChange": "",
    "onFormValidate": ""
  }
}
```

## 如何生成
### 1. 完成静态表单
删除所有默认的下拉选项
<ImagesVue :img-src="'/images/example3/step1.png'" />

### 2. 编写交互代码
（1）在表单的onFormMounted事件中加载地区选项，如下图所示：
<ImagesVue :img-src="'/images/example3/step2.png'" />
>提示：也可在地区选择组件的onMounted事件中编写加载选项代码，效果一样。

（2）在地区选择组件的onChange事件中加载安装地址组件的选项，并清空其对应的表单数据值，如下图所示：
<ImagesVue :img-src="'/images/example3/step3.png'" />
>提示：也可在地区选择组件的onMounted事件中编写加载选项代码，效果一样。

（3）点击表单设计器的预览按钮，即可测试选择联动效果。
>同理可推，按照上述交互处理方式，可以实现三级、四级、五级等多级组件联动效果。


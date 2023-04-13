export const customFields = [
  {
    typeValue: '111',
    typeLabel: '人',
    list: [
      {
        type: 'input',
        options: {
          label: '姓名',
          name: 'name',
        },
      },

      {
        type: 'textarea',
        options: {
          label: '简介',
          name: 'intro',
        },
      },

      {
        type: 'number',
        options: {
          label: '年龄',
          name: 'age',
          max: 100,
          min: 0,
        },
      },

      {
        type: 'radio',
        options: {
          label: '性别',
          name: 'gender',
          // labelKey: 'label',
          // valueKey: 'value',
          optionItems: [
            { label: '男', value: '1' },
            { label: '女', value: '2' },
          ],
        },
      },

      {
        type: 'checkbox',
        options: {
          label: '爱好',
          name: 'hobbies',
          optionItems: [
            { label: '游泳', value: '1' },
            { label: '阅读', value: '2' },
            { label: '绘画', value: '3' },
            { label: '听音乐', value: '4' },
            { label: '户外运动', value: '5' },
          ],
        },
      },

      {
        type: 'select',
        options: {
          label: '家乡',
          name: 'hometown',
          optionItems: [
            { label: '河北', value: '1' },
            { label: '浙江', value: '2' },
            { label: '北京', value: '3' },
            { label: '东北', value: '4' },
          ],
        },
      },

      {
        type: 'date',
        options: {
          label: '出生日期',
          name: 'birthday',
        },
      },

      // {
      //   type: 'date-range',
      // options: {
      //   label: '',
      // }
      // },

      {
        type: 'switch',
        options: {
          name: 'isMarried',
          label: '是否已婚',
        },
      },

      {
        type: 'slider',
        options: {
          name: 'salary',
          label: '年收入水平(万元)',
          labelWidth: 130,
          min: 5,
          max: 100,
          step: 1,
        },
      },

      {
        type: 'button',
        options: {
          label: '提交',
        },
      },

      {
        type: 'divider',
        options: {
          label: '我是分隔线',
        },
      },
    ],
  },
  {
    typeValue: '222',
    typeLabel: '部门',
    list: [
      {
        type: 'input',
        options: {
          name: 'deptName',
          label: '部门名称',
        },
      },

      {
        type: 'textarea',
        options: {
          name: 'deptDesc',
          label: '部门职能',
        },
      },
    ],
  },
]

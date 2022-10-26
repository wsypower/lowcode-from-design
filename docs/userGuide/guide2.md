# 栅格布局使用

通过标准的24分栏，可以简单快捷地创建表单布局，轻松实现单列、两列、三列、四列排版布局。
栅格分栏之间可以设置间隔，栅格宽度根据父容器宽度自适应。
>左侧间隔格数设置为2，两列栅格宽度设置为11，总共24分栏，正好占满一整行
<ImagesVue :img-src="'/images/guide2/guide2-1.png'" />
栅格布局可以嵌入字段组件或其他容器组件。
>在栅格列中嵌入了card容器，又在card容易中嵌入了input字段组件
<ImagesVue :img-src="'/images/guide2/guide2-2.png'" />
栅格内嵌套另一个栅格，可以实现类似于表格的合并行效果。
<ImagesVue :img-src="'/images/guide2/guide2-3.png'" />

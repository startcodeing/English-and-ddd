# 页面目录结构

这个目录包含应用的所有页面组件。每个功能模块都有自己的子目录，遵循以下结构：

```
pages/
├── vocabulary/           # 词汇相关页面
│   ├── PartOfSpeech/     # 词性管理页面
│   ├── Word/             # 单词管理页面
│   └── WordBook/         # 单词本管理页面
├── content/              # 内容相关页面
│   ├── Sentence/         # 句子管理页面
│   └── Article/          # 文章管理页面
├── practice/             # 练习相关页面
│   ├── Dictation/        # 听写练习页面
│   └── Writing/          # 写作练习页面
├── test/                 # 测试相关页面
│   └── Comprehensive/    # 综合测试页面
├── auth/                 # 认证相关页面
│   ├── Login/            # 登录页面
│   └── Register/         # 注册页面
├── dashboard/            # 仪表盘页面
└── error/                # 错误页面
    ├── 404.tsx           # 404页面
    └── 500.tsx           # 500页面
```

## 页面组件结构

每个页面组件目录应包含以下文件：

```
ComponentName/
├── index.tsx             # 页面主组件
├── components/           # 页面特定组件
│   └── SomeComponent.tsx # 某个页面特定组件
├── hooks/                # 页面特定hooks
│   └── useSomeHook.ts    # 某个页面特定hook
└── style.css             # 页面样式（如果需要）
```

## 页面路由

页面路由定义在 `src/routes` 目录中，请确保为每个新页面添加相应的路由配置。
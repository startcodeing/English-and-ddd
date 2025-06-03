# 组件库

这个目录包含了项目中使用的可复用UI组件。这些组件基于Ant Design进行了封装，添加了自定义样式和额外功能。

## 组件列表

### Button 按钮

基于Ant Design的Button组件封装，添加了自定义样式。

```tsx
import { Button } from '@/components';

<Button type="primary">点击我</Button>
```

### Input 输入框

基于Ant Design的Input组件封装，添加了标签和错误状态。

```tsx
import { Input } from '@/components';

<Input 
  label="用户名" 
  placeholder="请输入用户名" 
  error={true} 
  errorMessage="用户名不能为空" 
/>
```

### Card 卡片

基于Ant Design的Card组件封装，添加了自定义样式。

```tsx
import { Card } from '@/components';

<Card title="标题" shadow={true} hoverable={true}>
  卡片内容
</Card>
```

### Loading 加载

基于Ant Design的Spin组件封装，支持全屏加载。

```tsx
import { Loading } from '@/components';

// 普通加载
<Loading />

// 全屏加载
<Loading fullScreen={true} text="加载中..." />
```

### Modal 对话框

基于Ant Design的Modal组件封装，添加了自定义样式。

```tsx
import { Modal } from '@/components';

<Modal 
  title="确认" 
  visible={true} 
  onOk={() => console.log('确认')} 
  onCancel={() => console.log('取消')}
>
  确认要删除吗？
</Modal>
```

## 使用说明

所有组件都可以通过 `@/components` 路径导入：

```tsx
import { Button, Input, Card, Loading, Modal } from '@/components';
```

组件的类型定义也可以通过相同的路径导入：

```tsx
import { ButtonProps, InputProps, CardProps, LoadingProps, ModalProps } from '@/components';
```
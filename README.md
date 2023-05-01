
为了测试 Yjs 的协同能力，我实现了支持协同简单的 TODO 应用。

## 支持的功能

1. 创建房间；
2. 新增、删除、完成、清空所有待办；
3. 撤销重做；
4. 显示其他用户的光标位置；

## 技术栈

列一下用到的技术：

1. Vite + React + TypeScript + React Router；
2. Yjs、y-websocket：实现协同编辑；

## 源码

源码放 Github 上了。因为花了一天写的简易 Demo，没有太分模块，代码很稀烂，仅供参考。

https://github.com/F-star/yjs-react-todo-app

## 运行方式

先安装依赖：

```sh
pnpm install
```

然后两个终端分别启动服务端和客户端：

```sh
pnpm run server
```

```sh
pnpm run dev
```

## 演示

简单看看效果。

创建一个房间

![create-room](https://user-images.githubusercontent.com/18698939/235437857-162ad643-b9aa-4827-9ece-9d237d85caca.gif)


复制这个房间链接，在另一个浏览器里打开。

然后就是一顿操作。

![测试](https://user-images.githubusercontent.com/18698939/235437864-9cc97f38-0508-4908-b9a6-23ea1620e584.gif)



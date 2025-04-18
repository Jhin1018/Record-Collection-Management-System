# 项目开发指南

## 开发环境设置

1. 克隆仓库:
```bash
git clone <repository-url>
cd Record-Collection-Management-System/frontend
```

2. 安装依赖:
```bash
npm install
```

3. 创建环境变量文件:
```bash
cp .env.example .env.local
```
然后编辑 `.env.local` 文件，填入相应的API端点和Discogs API凭证。

4. 启动开发服务器:
```bash
npm run dev
```

## 项目结构

项目按照功能模块组织:

- `components/` - 包含可重用的UI组件
  - `charts/` - 图表和数据可视化组件
  - `forms/` - 表单控件
  - `navigation/` - 导航相关组件
- `features/` - 应用的主要功能模块
  - `auth/` - 身份验证逻辑
  - `collection/` - 收藏管理
  - `market/` - 市场数据集成
- `styles/` - 全局样式
- `utils/` - 工具函数

## 编码规范

- 使用函数组件和React Hooks
- 使用ESLint进行代码质量检查
- 组件文件使用PascalCase命名
- 工具函数使用camelCase命名
- 使用Material-UI组件库进行UI开发
- 使用React Query进行服务器状态管理

## API集成

后端API文档位于 `api_documentation.md`，请参考该文档了解可用的端点和请求/响应格式。

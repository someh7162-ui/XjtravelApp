# PostgreSQL 认证表结构

> 旧版说明：本文档只覆盖最早的账号认证子集。
> 当前“账号 + 内容”数据库初始化请优先使用 `docs/postgresql-app-schema.sql`
> 和 `docs/postgresql-app-seed.sql`。

## 用途

本项目计划将 uni-app 账号系统连接到服务端 PostgreSQL 数据库。
前端已预留以下接口：

- `POST /auth/register`
- `POST /auth/login`

当前前端占位实现位于：

- `config/auth.js`
- `services/auth.js`
- `common/auth-storage.js`
- `pages/auth/index.vue`

## 推荐数据表

### `users`

用于邮箱 + 密码注册登录的主账号表。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `uuid` | 是 | 主键 |
| `email` | `varchar(120)` | 是 | 登录邮箱，唯一 |
| `password_hash` | `text` | 是 | 密码哈希，不能存明文密码 |
| `nickname` | `varchar(60)` | 是 | 账号页展示昵称 |
| `avatar_url` | `text` | 否 | 头像地址 |
| `status` | `varchar(20)` | 是 | 建议值：`active`、`disabled`、`pending` |
| `created_at` | `timestamptz` | 是 | 记录创建时间 |
| `updated_at` | `timestamptz` | 是 | 最后更新时间 |
| `last_login_at` | `timestamptz` | 否 | 最近一次成功登录时间 |

### `user_sessions`

可选会话表，用于 refresh token、设备追踪或强制退出登录。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `uuid` | 是 | 主键 |
| `user_id` | `uuid` | 是 | 关联 `users.id` |
| `token_id` | `varchar(120)` | 是 | 会话或 refresh token 标识 |
| `device_name` | `varchar(120)` | 否 | 设备名称 |
| `ip_address` | `inet` | 否 | 登录 IP |
| `user_agent` | `text` | 否 | 请求 User-Agent |
| `expires_at` | `timestamptz` | 是 | 过期时间 |
| `revoked_at` | `timestamptz` | 否 | 会话撤销时间 |
| `created_at` | `timestamptz` | 是 | 记录创建时间 |

## 接口契约建议

### `POST /auth/register`

请求体：

```json
{
  "nickname": "丝路旅人",
  "email": "demo@example.com",
  "password": "123456"
}
```

建议成功响应：

```json
{
  "token": "jwt-or-session-token",
  "user": {
    "id": "uuid",
    "nickname": "丝路旅人",
    "email": "demo@example.com",
    "avatar_url": "",
    "status": "active"
  }
}
```

### `POST /auth/login`

请求体：

```json
{
  "email": "demo@example.com",
  "password": "123456"
}
```

建议成功响应与注册接口一致。

## 后端注意事项

- 使用 `bcrypt`、`argon2` 或其他经过验证的密码哈希算法处理密码。
- 为 `users.email` 添加唯一索引。
- 永远不要把 `password_hash` 返回给客户端。
- 如果使用 JWT，签名密钥只保存在服务端。
- 如果使用 refresh token，PostgreSQL 中只保存 token 标识或 token 哈希。

## 后续需要填写的前端配置

认证服务准备好后，更新 `config/auth.js`：

```js
export const AUTH_API_BASE_URL = 'https://your-domain-or-server/api'
```

## 当前接入状态

- `pages/auth/index.vue` 已支持登录/注册表单切换。
- `pages/account/index.vue` 已读取本地登录态。
- `common/auth-storage.js` 会在本地保存 token 和用户信息。
- 前端尚未连接真实认证服务。

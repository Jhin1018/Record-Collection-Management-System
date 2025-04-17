
# API 文档

## 1. 根据用户 ID 修改用户名

### 简要描述
- 无

### 请求 URL
```
PUT http://127.0.0.1:8000/api/v1/user
```

### 请求参数示例（JSON）
```json
{
  "user_id": 1,
  "username": "new_user1"
}
```

### 成功返回示例
```json
{
  "code": 200,
  "message": "Username updated successfully",
  "data": {
    "id": 1,
    "username": "new_user1",
    "email": "test1@example.com"
  }
}
```

### 失败返回示例
```json
{
  "code": 12001,
  "error": "Username already exists!"
}
```

---

## 2. 统计指定用户 release 价格变化

### 简要描述
- 获得用户 release 购买价格和当前市场价格对比

### 请求 URL
```
GET http://127.0.0.1:8000/api/v1/data/price-comparison
```

### 请求参数（Query）
- `user_id`（string，必选）

### 成功返回示例
```json
{
  "code": 200,
  "data": [
    {
      "release_id": 249504,
      "title": "Never Gonna Give You Up",
      "purchase_price": 39.99,
      "quantity": 2,
      "purchase_date": "2025-03-30 03:19:03",
      "market_price_cad": 0.76,
      "estimated_value": 1.52,
      "total_spent": 79.98,
      "gain_loss": -78.46,
      "request_time": "2025-04-16 12:18:15",
      "num_for_sale": 107,
      "community_have": 3636,
      "community_want": 558
    },
    {
      "release_id": 249508,
      "title": "Heaven ‎– Deep Trance Essentials 2",
      "purchase_price": 29.99,
      "quantity": 1,
      "purchase_date": "2025-03-30 05:19:03",
      "market_price_cad": 21.33,
      "estimated_value": 21.33,
      "total_spent": 29.99,
      "gain_loss": -8.66,
      "request_time": "2025-04-16 12:18:15",
      "num_for_sale": 11,
      "community_have": 346,
      "community_want": 166
    },
    {
      "release_id": 249509,
      "title": "Home For Christmas Day",
      "purchase_price": 49.99,
      "quantity": 1,
      "purchase_date": "2025-03-30 06:09:16",
      "market_price_cad": 4.57,
      "estimated_value": 4.57,
      "total_spent": 49.99,
      "gain_loss": -45.42,
      "request_time": "2025-04-16 12:18:15",
      "num_for_sale": 1,
      "community_have": 7,
      "community_want": 4
    },
    {
      "release_id": 249302,
      "title": "Casinò",
      "purchase_price": 29.99,
      "quantity": 1,
      "purchase_date": "2025-03-30 07:34:53",
      "market_price_cad": 34.08,
      "estimated_value": 34.08,
      "total_spent": 29.99,
      "gain_loss": 4.09,
      "request_time": "2025-04-16 12:18:15",
      "num_for_sale": 2,
      "community_have": 14,
      "community_want": 117
    },
    {
      "release_id": 249309,
      "title": "Joy Shapes",
      "purchase_price": 29.99,
      "quantity": 1,
      "purchase_date": "2025-04-01 08:27:59",
      "market_price_cad": 2.84,
      "estimated_value": 2.84,
      "total_spent": 29.99,
      "gain_loss": -27.15,
      "request_time": "2025-04-16 12:18:15",
      "num_for_sale": 8,
      "community_have": 294,
      "community_want": 47
    },
    {
      "release_id": 249378,
      "title": "Voices",
      "purchase_price": 29.99,
      "quantity": 10,
      "purchase_date": "2023-03-28 18:30:00",
      "market_price_cad": 1.7,
      "estimated_value": 17,
      "total_spent": 299.9,
      "gain_loss": -282.9,
      "request_time": "2025-04-16 12:18:15",
      "num_for_sale": 15,
      "community_have": 109,
      "community_want": 44
    },
    {
      "release_id": 249387,
      "title": "Passion Factory",
      "purchase_price": 29.99,
      "quantity": 4,
      "purchase_date": "2023-03-28 18:30:00",
      "market_price_cad": 7.39,
      "estimated_value": 29.56,
      "total_spent": 119.96,
      "gain_loss": -90.4,
      "request_time": "2025-04-16 12:18:15",
      "num_for_sale": 10,
      "community_have": 381,
      "community_want": 168
    },
    {
      "release_id": 249388,
      "title": "Livin' It Up",
      "purchase_price": 29.99,
      "quantity": 4,
      "purchase_date": "2025-04-01 08:42:02",
      "market_price_cad": 1.38,
      "estimated_value": 5.52,
      "total_spent": 119.96,
      "gain_loss": -114.44,
      "request_time": "2025-04-16 12:18:15",
      "num_for_sale": 13,
      "community_have": 71,
      "community_want": 26
    },
    {
      "release_id": 249389,
      "title": "Mono Culture",
      "purchase_price": 29.99,
      "quantity": 2,
      "purchase_date": "2025-04-01 08:42:17",
      "market_price_cad": 0,
      "estimated_value": 0,
      "total_spent": 59.98,
      "gain_loss": -59.98,
      "request_time": "2025-04-16 12:18:15",
      "num_for_sale": 0,
      "community_have": 141,
      "community_want": 135
    }
  ]
}
```

---

## 3. 统计指定用户每月消费总额

### 简要描述
- 获取用户消费过的每个月的消费总额数据（CAD）

### 请求 URL
```
GET http://127.0.0.1:8000/api/v1/data/monthly-spending
```

### 请求参数（Query）
- `user_id`（string，必选）

### 成功返回示例
```json
{
  "code": 200,
  "data": {
    "labels": [
      "2023-03",
      "2025-03",
      "2025-04"
    ],
    "data": [
      419.86,
      189.95,
      209.93
    ]
  }
}
```

---

## 4. 获取 wantlist 记录（含市场价格）

### 简要描述
- 无

### 请求 URL
```
GET http://127.0.0.1:8000/api/v1/release/wantlist
```

### 请求参数（Query）
- `user_id`（string，必选）

### 成功返回示例
```json
{
  "code": 200,
  "data": [
    {
      "wantlist_id": 1,
      "release": {
        "id": 249508,
        "title": "Heaven ‎– Deep Trance Essentials 2",
        "artist": "Various",
        "year": 2004,
        "format": "Vinyl"
      },
      "note": "like",
      "added_date": "2025-03-30 05:58:51",
      "market_price_cad": 21.33,
      "num_for_sale": 11,
      "community_have": 346,
      "community_want": 166,
      "request_time": "2025-04-16 12:24:24"
    }
  ]
}
```

### 失败返回示例
```json
{
  "code": 404,
  "error": "User not found"
}
```

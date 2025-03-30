# API Documentation

## Print

## 1.1、创建新用户（注册）

**URL:** `http://127.0.0.1:8000/api/v1/user`

**Method:** `post`

**Request Example:**
```json
{
    "username": "testuser2",
    "password": "123456"
}
```

**Success Response Example:**
```json
{
    "code": 200,
    "userid": 1
}
```

**Failure Response Example:**
```json
{
    "code": 12001,
    "error": "Username already exists!"
}
```

## 1.2、获取用户信息

**URL:** `http://127.0.0.1:8000/api/v1/user`

**Success Response Example:**
```json
{
    "code": 200,
    "data": [
        {
            "id": 1,
            "username": "testuser1",
            "email": "test1@example.com"
        }
```

## 1.3、用户登录

**URL:** `http://127.0.0.1:8000/api/v1/user/userlogin`

**Method:** `post`

**Request Example:**
```json
{
    "username": "testuser2",
    "password": "123456"
}
```

**Success Response Example:**
```json
{
    "code": 200,
    "username": "testuser2",
    "id": 2,
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyMiIsInJvbGUiOm51bGwsImlkIjoyLCJleHAiOjE3NDMzNTYwNDcuNjU3NjM5M30.esO_JG0bib2a6k2IVM86cSkmphynUwLihLE3wKTunjw"
    }
```

**Failure Response Example:**
```json
{
    "code": 10202,
    "error": "Invalid username or password, please try again!"
}
```

## 1.4、用户登录状态校验

**URL:** `http://127.0.0.1:8000/api/v1/user/userlogin`

**Success Response Example:**
```json
{
    "code": 200,
    "message": "Login successful!",
    "res": {
        "username": "testuser2",
        "id": 2,
        "exp": 1743356299.5004866
    }
```

**Failure Response Example:**
```json
{
    "code": 1403,
    "error": "Please login"
}
```

## 2.1、获取ReleaseGenre表信息

**URL:** `http://127.0.0.1:8000/api/v1/artist/release-genre`

**Success Response Example:**
```json
{
    "code": 200,
    "data": [
        {
            "id": 1,
            "release_id": 249505,
            "release_title": "Sweet Harmony",
            "genre_id": 1,
            "genre_name": "Electronic"
        }
```

## 2.2、获取指定release_id的ReleaseGenre表信息

**URL:** `http://127.0.0.1:8000/api/v1/artist/release-genre`

**Success Response Example:**
```json
{
    "code": 200,
    "data": [
        {
            "id": 1,
            "release_id": 249505,
            "genre_id": 1,
            "genre_name": "Electronic"
        }
```

## 2.3、获取Genre表信息

**URL:** `http://127.0.0.1:8000/api/v1/artist/genre`

**Success Response Example:**
```json
{
    "code": 200,
    "data": [
        {
            "id": 1,
            "genre_name": "Electronic"
        }
```

## 3.1、估算用户收藏总价值

**URL:** `http://127.0.0.1:8000/api/v1/data/collection-value`

**Success Response Example:**
```json
{
    "code": 200,
    "data": {
        "labels": [
            "Electronic"
        ],
        "data": [
            2
        ]
    }
```

## 3.2、按流派统计用户收藏分布

**URL:** `http://127.0.0.1:8000/api/v1/data/genre-distribution`

**Success Response Example:**
```json
{
    "code": 200,
    "data": {
        "labels": [
            "Electronic"
        ],
        "data": [
            2
        ]
    }
```

## 4.1、创建wantlist记录

**URL:** `http://127.0.0.1:8000/api/v1/release/wantlist`

**Method:** `post`

**Request Example:**
```json
{
    "user_id": 2,
    "release_id": 249509,
    "note": "like"
}
```

**Success Response Example:**
```json
{
    "code": 200,
    "data": {
        "wantlist_id": 1,
        "release": {
            "id": 249508,
            "title": "Heaven ‎– Deep Trance Essentials 2",
            "artist": "Various",
            "year": 2004,
            "format": "Vinyl",
            "genres": [
                "Electronic"
            ]
        }
```

**Failure Response Example:**
```json
{
    "code": 404,
    "error": "User not found"
}
```

## 4.2、删除wantlist记录

**URL:** `http://127.0.0.1:8000/api/v1/release/wantlist`

**Method:** `delete`

**Request Example:**
```json
{
    "user_id": 2,
    "wantlist_id": 3
}
```

**Success Response Example:**
```json
{
    "code": 200,
    "message": "Wantlist item removed successfully",
    "data": {
        "wantlist_id": 3,
        "release": {
            "id": 249509,
            "title": "Home For Christmas Day",
            "artist": "The Red Car And The Blue Car",
            "year": 1991,
            "format": "Cassette"
        }
```

**Failure Response Example:**
```json
{
    "code": 404,
    "error": "Wantlist item not found or does not belong to this user"
}
```

## 4.3、获取wantlist记录

**URL:** `http://127.0.0.1:8000/api/v1/release/wantlist`

**Success Response Example:**
```json
{
    "code": 200,
    "data": [
        {
            "wantlist_id": 2,
            "user": {
                "id": 1,
                "username": "testuser1",
                "email": "test1@example.com"
            }
```

**Failure Response Example:**
```json
{
    "code": 404,
    "error": "User not found"
}
```

## 4.4、转移wantlist到collection

**URL:** `http://127.0.0.1:8000/api/v1/release/wantlist`

**Method:** `put`

**Request Example:**
```json
{
    "wantlist_id": 2,
    "user_id": 1,
    "quantity": 1,
    "purchase_price": "49.99",
    "purchase_date": "2024-03-30 17:30:00",
    "description": "like"
}
```

**Success Response Example:**
```json
{
    "code": 200,
    "message": "Release moved from wantlist to collection successfully",
    "data": {
        "collection_id": 4,
        "release": {
            "id": 249509,
            "title": "Home For Christmas Day",
            "artist": "The Red Car And The Blue Car",
            "year": 1991,
            "format": "Cassette"
        }
```

**Failure Response Example:**
```json
{
    "code": 404,
    "error": "Wantlist item not found or does not belong to this user"
}
```

## 5.1、根据id获取release信息

**URL:** `http://127.0.0.1:8000/api/v1/release/release01`

**Method:** `post`

**Request Example:**
```json
{
    "release_id": "249504"
}
```

**Success Response Example:**
```json
{
    "code": 200,
    "data": {
        "id": 249504,
        "status": "Accepted",
        "year": 1987,
        "resource_url": "https:\/\/api.discogs.com\/releases\/249504",
        "uri": "https:\/\/www.discogs.com\/release\/249504-Rick-Astley-Never-Gonna-Give-You-Up",
        "artists": [
            {
                "name": "Rick Astley",
                "anv": "",
                "join": "",
                "role": "",
                "tracks": "",
                "id": 72872,
                "resource_url": "https:\/\/api.discogs.com\/artists\/72872",
                "thumbnail_url": "https:\/\/i.discogs.com\/ahwL3DczlaHszbvIzuakpnFM_WiXwxLWH_cute-nWiQ\/rs:fit\/g:sm\/q:90\/h:512\/w:512\/czM6Ly9kaXNjb2dz\/LWRhdGFiYXNlLWlt\/YWdlcy9BLTcyODcy\/LTE0NTg5NTg4Mjgt\/OTgzMi5qcGVn.jpeg"
            }
```

## 5.2、根据id获取并创建release基本信息

**URL:** `http://127.0.0.1:8000/api/v1/release/release02`

**Method:** `post`

**Request Example:**
```json
{
    "release_id": "249505"
}
```

**Success Response Example:**
```json
{
    "code": 200,
    "data": {
        "release_id": 249505,
        "title": "Sweet Harmony",
        "artist": "The Beloved",
        "year": 1993,
        "format": "Vinyl",
        "master_id": 10484,
        "genres": [
            "Electronic",
            "Pop"
        ]
    }
```

## 5.3、收藏并创建release记录

**URL:** `http://127.0.0.1:8000/api/v1/release/collection`

**Method:** `post`

**Request Example:**
```json
{
    "release_id": 249302,
    "user_id": 1,
    "quantity": 1,
    "purchase_price": 29.99,
    "description": "like",
    "purchase_date": "2023-03-29 18:30:00"
}
```

**Success Response Example:**
```json
{
    "code": 200,
    "data": {
        "collection_id": 2,
        "release": {
            "id": 249508,
            "title": "Heaven ‎– Deep Trance Essentials 2",
            "artist": "Various",
            "year": 2004,
            "format": "Vinyl",
            "genres": [
                "Electronic"
            ]
        }
```

**Failure Response Example:**
```json
{
    "code": 404,
    "error": "User not found"
}
```

## 5.4、根据用户id查询用户收藏记录

**URL:** `http://127.0.0.1:8000/api/v1/release/collection`

**Success Response Example:**
```json
{
    "code": 200,
    "data": [
        {
            "collection_id": 2,
            "release": {
                "id": 249508,
                "title": "Heaven ‎– Deep Trance Essentials 2",
                "artist": "Various",
                "year": 2004,
                "format": "Vinyl",
                "cover_url": "https:\/\/i.discogs.com\/dPPiKLJSiwRN4Chh1mQoUDAo_uF09VTGhanZ30GyeKQ\/rs:fit\/g:sm\/q:40\/h:150\/w:150\/czM6Ly9kaXNjb2dz\/LWRhdGFiYXNlLWlt\/YWdlcy9SLTI0OTUw\/OC0xMTkwMzIwNTY5\/LmpwZWc.jpeg",
                "genres": [
                    "Electronic"
                ]
            }
```

**Failure Response Example:**
```json
{
    "code": 404,
    "error": "User not found"
}
```

## 5.5、删除用户收藏记录

**URL:** `http://127.0.0.1:8000/api/v1/release/collection`

**Method:** `delete




请求Query参数






参数名


示例值


必选


类型


说明










user_id


1


是


string


无`

**Request Example:**
```json
{
    "user_id": 11,
    "collection_id": 3
}
```

**Success Response Example:**
```json
{
    "code": 200,
    "message": "Collection removed successfully",
    "data": {
        "collection_id": 3,
        "release": {
            "id": 249502,
            "title": "Demulcent Sessions Volume 1",
            "artist": "Various",
            "year": 2003,
            "format": "CD"
        }
```

**Failure Response Example:**
```json
{
    "code": 404,
    "error": "User not found"
}
```

## 5.6、修改用户收藏记录信息

**URL:** `http://127.0.0.1:8000/api/v1/release/collection`

**Method:** `put`

**Request Example:**
```json
{
    "user_id": 1,
    "collection_id": 11,
    "quantity": 2,
    "purchase_price": "39.99",
    "purchase_date": "2025-03-30 03:19:03",
    "description": "like"
}
```

**Success Response Example:**
```json
{
    "code": 200,
    "message": "Collection updated successfully",
    "data": {
        "collection_id": 1,
        "release": {
            "id": 249504,
            "title": "Never Gonna Give You Up",
            "artist": "Rick Astley",
            "year": 1987,
            "format": "Vinyl"
        }
```

**Failure Response Example:**
```json
{
    "code": 404,
    "error": "Collection not found or does not belong to this user"
}
```


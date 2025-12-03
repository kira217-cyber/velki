# API Documentation

### Get All Categories

- **GET** `/api/categories`
- **Headers:** `x-api-key: <apiKey>`
- **Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    { "_id": "64f1...", "name": "Action", "image": "uploads/images/123.png" },
    { "_id": "64f2...", "name": "Adventure", "image": "uploads/images/456.png" }
  ]
}
```

## Categories

### Get All Categories

### Get All Providers

- **GET** `/api/providers`
- **Headers:** `x-api-key: <apiKey>`
- **Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    { "_id": "64f3...", "name": "DSTPLAY", "image": "uploads/images/789.png" },
    { "_id": "64f4...", "name": "Joyhobe", "image": "uploads/images/101.png" }
  ]
}
```

---

## Providers

### Get All Games (Paginated)

- **GET** `/api/games/pagination?page=1&limit=50&provider=<providerId>`
- **Headers:** `x-api-key: <apiKey>`
- **Response:**

```json
{
  "success": true,
  "count": 2,
  "total": 100,
  "page": 1,
  "totalPages": 50,
  "data": [
    {
      "_id": "64f5...",
      "name": "Super Game",
      "provider": {
        "_id": "64f3...",
        "name": "DSTPLAY",
        "image": "uploads/images/789.png"
      },
      "category": {
        "_id": "64f1...",
        "name": "Action",
        "image": "uploads/images/123.png"
      },
      "releaseDate": "2025-09-01T00:00:00.000Z",
      "game_uuid": "abc123",
      "image": "uploads/images/game1.png",
      "projectImageDocs": [
        {
          "_id": "692bea...",
          "projectName": {
            "_id": "692bd6...",
            "title": "Babu88"
          },
          "image": "uploads/images/projectImage1.png",
          "gameId": "64f5...",
          "createdAt": "2025-11-30T06:56:41.171Z",
          "updatedAt": "2025-11-30T06:57:15.265Z",
          "__v": 0
        },
        {
          "_id": "692beab...",
          "projectName": {
            "_id": "692be12...",
            "title": "Tk999"
          },
          "image": "uploads/images/projectImage2.png",
          "gameId": "64f5...",
          "createdAt": "2025-11-30T06:56:51.672Z",
          "updatedAt": "2025-11-30T06:56:51.672Z",
          "__v": 0
        }
      ]
    }
  ]
}
```

- **GET** `/api/providers`
- **Headers:** `x-api-key: <apiKey>`

## Games

### Get Game By ID

- **GET** `/api/games/:id`
- **Headers:** `x-api-key: <apiKey>`
- **Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64f5...",
    "name": "Super Game",
    "provider": {
      "_id": "64f3...",
      "name": "DSTPLAY",
      "image": "uploads/images/789.png"
    },
    "category": {
      "_id": "64f1...",
      "name": "Action",
      "image": "uploads/images/123.png"
    },
    "releaseDate": "2025-09-01T00:00:00.000Z",
    "game_uuid": "abc123",
    "image": "uploads/images/game1.png",
    "projectImageDocs": [
      {
        "_id": "692bea...",
        "projectName": {
          "_id": "692bd6...",
          "title": "Babu88"
        },
        "image": "uploads/images/projectImage1.png",
        "gameId": "64f5...",
        "createdAt": "2025-11-30T06:56:41.171Z",
        "updatedAt": "2025-11-30T06:57:15.265Z",
        "__v": 0
      },
      {
        "_id": "692beab...",
        "projectName": {
          "_id": "692be12...",
          "title": "Tk999"
        },
        "image": "uploads/images/projectImage2.png",
        "gameId": "64f5...",
        "createdAt": "2025-11-30T06:56:51.672Z",
        "updatedAt": "2025-11-30T06:56:51.672Z",
        "__v": 0
      }
    ]
  }
}
```

- **GET** `/api/games/pagination?page=1&limit=50&provider=<providerId>`
- **Headers:** `x-api-key: <apiKey>`

Note:
- `projectImageDocs` is an array of project image documents linked to the game via `gameId`. Each item contains `projectName` (with `_id` and `title`) and the `image` path. The array can be empty when no images are linked.

### Get Games By Array of IDs

- **POST** `/api/games/by-ids`
- **Headers:** `x-api-key: <apiKey>`
- **Body:**

```json
{ "ids": ["64f5...", "64f6..."] }
```

- **Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64f5...",
      "name": "Super Game",
      "provider": {
        "_id": "64f3...",
        "name": "DSTPLAY",
        "image": "uploads/images/789.png"
      },
      "category": {
        "_id": "64f1...",
        "name": "Action",
        "image": "uploads/images/123.png"
      },
      "releaseDate": "2025-09-01T00:00:00.000Z",
      "game_uuid": "abc123",
      "image": "uploads/images/game1.png",
      "projectImageDocs": [
        {
          "_id": "692bea...",
          "projectName": {
            "_id": "692bd6...",
            "title": "Babu88"
          },
          "image": "uploads/images/projectImage1.png",
          "gameId": "64f5...",
          "createdAt": "2025-11-30T06:56:41.171Z",
          "updatedAt": "2025-11-30T06:57:15.265Z",
          "__v": 0
        },
        {
          "_id": "692beab...",
          "projectName": {
            "_id": "692be12...",
            "title": "Tk999"
          },
          "image": "uploads/images/projectImage2.png",
          "gameId": "64f5...",
          "createdAt": "2025-11-30T06:56:51.672Z",
          "updatedAt": "2025-11-30T06:56:51.672Z",
          "__v": 0
        }
      ]
    }
  ]
}
```

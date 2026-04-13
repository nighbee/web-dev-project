# Backend API Test Suite

## 1. Startup
```bash
cd backend
python manage.py seed_mathway 
python manage.py runserver 8080 
```

---

## 2. Authentication
### Register
```bash
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
     -H "Content-Type: application/json" \
     -d '{"username": "almaz", "password": "password123", "email": "almaz@example.com"}'
```

### Login
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
     -H "Content-Type: application/json" \
     -d '{"username": "almaz", "password": "password123"}'
```

---

## 3. Videos (Public)
### List All Videos
```bash
curl -X GET http://127.0.0.1:8000/api/videos/
```

---

## 4. Protected Routes


### Favorites
**Add to Favorites:**
```bash
curl -X POST http://127.0.0.1:8000/api/favorites/ \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"video": 1}'
```

**List My Favorites:**
```bash
curl -X GET http://127.0.0.1:8000/api/favorites/ \
     -H "Authorization: Bearer <TOKEN>"
```

### Notes
**Create a Note:**
```bash
curl -X POST http://127.0.0.1:8000/api/notes/ \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"video": 1, "content": "This is my first note!"}'
```

**Get Notes for Video #1:**
```bash
curl -X GET "http://127.0.0.1:8000/api/notes/?video_id=1" \
     -H "Authorization: Bearer <TOKEN>"
```

**Update Note #1:**
```bash
curl -X PUT http://127.0.0.1:8000/api/notes/1/ \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"content": "Updated content here"}'
```

**Delete Note #1:**
```bash
curl -X DELETE http://127.0.0.1:8000/api/notes/1/ \
     -H "Authorization: Bearer <TOKEN>"
```

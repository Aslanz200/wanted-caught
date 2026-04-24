# Структура проекта Criminal Database

```
criminals-database/
│
├── 📁 backend/                           # Backend (Python Flask)
│   ├── app.py                           # Главное приложение Flask
│   ├── init_db.py                       # Скрипт инициализации БД
│   ├── requirements.txt                 # Зависимости Python
│   └── criminals.db                     # SQLite база данных
│
├── 📁 frontend/                          # Frontend (HTML/CSS/JavaScript)
│   ├── index.html                       # Главная HTML страница
│   ├── app.js                           # Логика приложения
│   └── style.css                        # Стили и анимации
│
├── 📄 README.md                         # Полная документация
├── 📄 QUICK_START.md                    # Быстрый старт
├── 📄 config.json                       # Конфигурация проекта
└── 📄 STRUCTURE.md                      # Этот файл

```

## 📦 Компоненты проекта

### Backend (`backend/app.py`)

- **Framework**: Flask + SQLAlchemy
- **Database**: SQLite
- **CORS**: Включен для фронтенда
- **Port**: 5000

**Основные модули:**
```python
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
```

**Модель:**
```python
class Criminal(db.Model):
    - id (Integer, Primary Key)
    - name (String)
    - category (String)
    - crime_type (String)
    - country (String)
    - year (Integer)
    - image (Text)
    - charges (Text)
    - biography (Text)
    - captured_location (String)
    - capture_method (Text)
    - victims (Text - JSON)
    - created_at (DateTime)
```

**API Routes:**
```
GET    /api/criminals              - получить всех (с фильтрами)
GET    /api/criminals/{id}         - получить одного
POST   /api/criminals              - создать
PUT    /api/criminals/{id}         - обновить
DELETE /api/criminals/{id}         - удалить
GET    /api/stats                  - статистика
GET    /api/filters                - доступные фильтры
GET    /api/health                 - проверка здоровья
```

### Frontend (`frontend/`)

- **index.html**: Структура страницы
- **app.js**: Логика приложения
  - Загрузка данных с backend
  - Фильтрация и поиск
  - Работа с модальными окнами
  - Fallback на локальные данные
- **style.css**: Стили
  - Адаптивный дизайн
  - Анимации (slideDown, fadeIn, scaleIn)
  - Mobile-friendly

**Основные функции:**
```javascript
loadInitialData()          // Загрузка данных с backend
applyFilters()             // Применение фильтров
resetFilters()             // Сброс фильтров
openProfile(id)            // Открыть модальное окно
closeProfile()             // Закрыть модальное окно
renderResults()            // Отрисовка результатов
```

## 🗄️ База данных

**Файл:** `backend/criminals.db` (SQLite)

**Таблица:** criminals

**Примеры данных:**
1. Луи Гастон Шевалье - Франция, 1890
2. Джон Кристи - Великобритания, 1953
3. Петр Кюлосов - Россия, 1898
4. Карлос Маригелла - Бразилия, 1969
5. Иди Амин Дада - Уганда, 1979
6. Бернард Мейдофф - США, 2008
7. Виктор Люстиг - Франция, 1923

## 🔄 Поток данных

```
Frontend (Браузер)
    ↓
    ├─ Запрос данных
    │  (GET /api/criminals)
    ↓
Backend (Flask)
    ├─ Получение запроса
    ├─ Обработка фильтров
    ├─ Запрос к БД
    ↓
Database (SQLite)
    ├─ Выполнение запроса
    ├─ Возврат данных
    ↓
Backend
    ├─ Сериализация JSON
    ├─ CORS заголовки
    ↓
Frontend
    ├─ Получение JSON
    ├─ Отрисовка HTML
    ├─ Обновление DOM
```

## 🚀 Установка и запуск

### Системные требования
- Python 3.8+
- Браузер (Chrome, Firefox, Safari, Edge)
- Интернет соединение (для CDN, если нужно)

### Установка

```bash
# 1. Установка зависимостей
cd backend
pip install Flask Flask-SQLAlchemy Flask-CORS

# 2. Инициализация БД
python init_db.py

# 3. Запуск backend
python app.py
```

### Разработка

```bash
# Frontend (открыть в браузере)
file:///path/to/criminals-database/frontend/index.html

# Frontend с Live Server
Правая кнопка → Open with Live Server

# Backend (на порту 5000)
http://localhost:5000
```

## 🎯 Основные особенности

### ✓ Поиск и фильтрация
- Полнотекстовый поиск (имя, обвинения, биография)
- Фильтр по стране
- Фильтр по году
- Фильтр по типу преступления

### ✓ Интерфейс
- Адаптивный дизайн (мобильные, планшеты, ПК)
- Плавные анимации
- Интерактивные модальные окна
- Красивые карточки

### ✓ Функциональность
- Подробные профили преступников
- Информация о жертвах
- История задержания
- Биографическая информация

### ✓ Технические особенности
- REST API
- SQLite база данных
- CORS поддержка
- JSON сериализация
- Fallback на локальные данные

## 📊 Статистика

- **Общее количество:** 7 преступников
- **Стран:** 5 (Франция, Великобритания, Россия, Бразилия, Уганда, США)
- **Категорий:** 3 (Убийцы, Террористы, Мошенники)
- **Типов преступлений:** 6
- **Лет охвачено:** 1890-2008

## 🔐 Безопасность

- Образовательный проект
- Все данные из открытых источников
- Для научных и исторических целей
- SQL Injection защита (ORM)
- CORS настроен

## 📝 Дальнейшее развитие

Возможные улучшения:
1. Добавить админ-панель
2. Добавить возможность конкомента
3. Добавить маркеры на карте
4. Добавить временную шкалу
5. Добавить связанные статьи
6. Добавить рейтинги
7. Добавить экспорт в PDF/Excel
8. Добавить аутентификацию

## 🤝 Контрибуция

Проект открыт для улучшений и дополнений.

## 📄 Лицензия

Образовательный проект. Используется в исторических и научных целях.

---

**Создано:** April 2026
**Версия:** 1.0.0

# Gatherly

Мобилна апликация (React Native + Expo) за управление на резервации и събития.

## Технологии
- Expo SDK 54 / React Native 0.81
- React Navigation (stack + bottom tabs)
- react-native-calendars
- AsyncStorage за JWT токен
- TypeScript

## Инсталация и стартиране

```bash
npm install
npm start
```

След това сканирайте QR кода с приложението **Expo Go** (iOS/Android) или натиснете `a` / `i` за симулатор.

## Конфигурация

В `src/api/client.ts` променете `API_URL` да сочи към адреса на бекенда в локалната мрежа, например:

```ts
export const API_URL = 'http://192.168.0.100:4000/api';
```

Бекендът трябва да е стартиран на същата мрежа (виж `gatherly-backend/README.md`).

## Демо акаунти

| Роля        | Имейл               | Парола     |
|-------------|---------------------|------------|
| Организатор | organizer@demo.bg   | demo1234   |
| Потребител  | user@demo.bg        | demo1234   |

## Структура

```
src/
├── api/            HTTP клиент и API обвивки
├── context/        AuthContext (JWT + състояние на потребителя)
├── navigation/     Стекова и таб навигация
└── screens/        10 екрана – вход, списъци, детайли, календар, създаване
```

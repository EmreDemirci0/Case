// Route path'lerini merkezi olarak yönetmek için
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    GAME: '/game',
} as const;

// Type safety için route path'lerinin tipini tanımlayalım
export type RoutePath = typeof ROUTES[keyof typeof ROUTES]; 
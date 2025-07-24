export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    GAME: '/game',
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES]; 
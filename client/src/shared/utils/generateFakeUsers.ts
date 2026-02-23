import { faker } from '@faker-js/faker';

interface Program {
    id: number;
    title: string;
    short_title: string;
    progress: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    number: string;
    organization: string;
    createdAt: string;
    graduation_date?: string | null;
    programs: Program[];
}

// Генерация 50 пользователей
const TOTAL_USERS = 50;
const USERS_PER_PAGE = 20;

const generateUsers = (count = 50): User[] => {
    return Array.from({ length: count }, (_, idx) => {

        const progress = faker.number.int({ min: 0, max: 100 });

        return {
            id: idx + 1,
            name: faker.name.fullName(),
            email: faker.internet.email(),
            number: faker.phone.number({style: 'human'}),
            role: 'USER',
            organization: faker.company.name(),
            createdAt: faker.date.past({years: 1}).toISOString(),
            graduation_date: faker.datatype.boolean()
                ? faker.date.future().toISOString()
                : null,
            programs: [
                {
                    id: 39,
                    title: 'Основы системного мышления',
                    short_title: 'Тестовая программа основы мышления',
                    progress,
                },
            ],
            statistic: faker.number.int({ min: 0, max: 100 }),
        } as User;
    });
};

const allUsers = generateUsers(500);

// Функция для получения страницы
export const getUsersPage = (page: number) => {
    const start = (page - 1) * USERS_PER_PAGE;
    const end = start + USERS_PER_PAGE;

    return {
        count: allUsers.length,
        page,
        totalPages: Math.ceil(allUsers.length / USERS_PER_PAGE),
        rows: allUsers.slice(start, end),
    };
};

// Пример использования
console.log(getUsersPage(1));

import prisma from "config/database";
import { faker } from '@faker-js/faker';

export async function inputConsole() {
    return await prisma.console.create({
        data: {
            name: faker.name.fullName()
        }
    })
}


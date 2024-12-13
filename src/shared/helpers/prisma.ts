import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const hashPassword = (password: string): string => {
    return bcrypt.hashSync(password, 10);
};

const prisma = new PrismaClient({
    errorFormat: 'minimal',
}).$extends({
    query: {
        gettingStartedUser: {
            async $allOperations({ args, operation, query }) {
                if ((operation === 'create' || operation === 'update') && 'data' in args) {
                    const data = args.data as
                        | Prisma.GettingStartedUserCreateInput
                        | Prisma.GettingStartedUserUpdateInput;

                    if (data.password) {
                        data.password = hashPassword(data.password as string);
                    }
                }

                return query(args);
            },
        },
    },
    model: {
        user: {
            async validatePassword(savedPassword: string, givenPassword: string): Promise<boolean> {
                return bcrypt.compare(givenPassword, savedPassword);
            },
        },
    },
    result: {
        user: {
            save: {
                needs: { id: true },
                compute(user) {
                    return () => prisma.user.update({ where: { id: user.id }, data: user });
                },
            },
        },
    },
});

const resetDatabase = async () => {
    // Example of how you might clear data from all tables
    await prisma.$executeRaw`TRUNCATE TABLE "GettingStartedUser" RESTART IDENTITY CASCADE;`;

    // If you need to reset the database schema, you could also run migrations or other setup tasks here
    // await prisma.$executeRaw`your-schema-reset-sql`;
};

export { prisma, resetDatabase };

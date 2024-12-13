// const userSpec = yaml.load('../../app/user.yaml');

const options = {
    swaggerDefinition: {
        openapi: '3.0.3',
        info: {
            title: 'Swagger pro_cleaner-server - OpenAPI 3.0.3',
            version: '1.0.0',
            description: `You can find out more about pro cleaner at [github](https://github.com/webreality-org/pro-cleaner-client).`,

            termsOfService: 'https://www.linkedin.com/company/webreality-01101/?viewAsMember=true',
            contact: {
                name: 'web reality team',
                email: 'webreality.01101@gmail.com',
            },
            license: {
                name: 'pcw 2.0',
                url: 'n/a',
            },
        },
        externalDocs: {
            description: 'Find out more about PCW',
            url: 'https://github.com/webreality-org/pro-cleaner-client',
        },
        servers: [
            {
                description: 'Development server',
                url: 'http://localhost:8080/api/v1',
            },
            {
                description: 'Production server',
                url: 'https://pilla-be.vercel.app/api/v1',
            },
        ],
        tags: [
            {
                name: 'Auth',
                description: 'Authentications endpoints',
            },
        ],
    },

    apis: ['./src/**/*.yaml'],
};

export const swaggerConfigs = { options };

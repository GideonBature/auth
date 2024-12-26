module.exports = {
    // extends: ['@commitlint/config-conventional'],
    extends: [],
    rules: {
        'subject-min-length': [2, 'always', 10],
        'subject-max-length': [2, 'always', 100],
        'header-end-period': [2, 'always'],
        'type-enum': [
            2,
            'always',
            [
                'ADDED',
                'MODIFIED',
                'UPDATED',
                'DELETED',
                'FIXED',
                'CHECKED',
                'REFACTORED',
                'INITIALIZED',
            ],
        ],
        'type-case': [2, 'always', 'upper-case'],
        'subject-case': [2, 'always', ['lower-case', 'upper-case']],
        // 'type-ends-with': [2, 'always', ': '],
    },
    plugins: [
        {
            rules: {
                'header-end-period': ({ header }) => {
                    return [/\.$/.test(header), 'Commit message must end with a period'];
                },
                // 'type-ends-with': ({ header }) => {
                //   return [
                //     /: $/.test(header),
                //     'Type should end with ":" and be followed by a blank space',
                //   ];
                // },
                'subject-min-length': ({ subject }) => {
                    return [
                        subject.length >= 10,
                        'Commit message must be at least 10 characters long',
                    ];
                },
                'subject-max-length': ({ subject }) => {
                    return [
                        subject.length <= 100,
                        'Commit message cant be more than 100 characters long',
                    ];
                },
                // 'type-case': ({ type}) => {

                //   return [header.length <= 100, 'Commit message cant be more than 100 characters long'];
                // },
                'type-enum': ({ type }) => {
                    return [
                        [
                            'ADDED',
                            'MODIFIED',
                            'UPDATED',
                            'DELETED',
                            'FIXED',
                            'CHECKED',
                            'REFACTORED',
                            'INITIALIZED',
                        ].includes(type),
                        `Commit message must be started with one of [ADDED, MODIFIED, UPDATED, DELETED, FIXED, 'CHECKED', 'REFACTORED', 'INITIALIZED'] and followed by a colon and a blank space`,
                    ];
                },
            },
        },
    ],
};

// ADDED: when added a complete new feature
// MODIFIED: when any change in an existing feature
// UPDATED: when additional feature/code added to an existing feature

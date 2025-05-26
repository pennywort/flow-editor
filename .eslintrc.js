module.exports = {
    'root': true,
    'env': { browser: true, es2021: true },
    'parser': '@typescript-eslint/parser',
    'parserOptions': { ecmaVersion: 2021, sourceType: 'module', project: ['./tsconfig.json'] },
    'plugins': ['@typescript-eslint'],
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
    ],
    'rules': {
        'indent': ['error', 'tab'],
        'curly': ['error', 'all'],
        'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
        'import/order': ['error', {
            'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
            'newlines-between': 'always'
        }],
    },
}

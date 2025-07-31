module.exports = {
   root: true,
   extends: [
      '@react-native', 
      'plugin:@typescript-eslint/recommended', 
      'plugin:prettier/recommended'
   ],
   parser: '@typescript-eslint/parser',
   plugins: [
      '@typescript-eslint',
      'eslint-plugin-import-helpers',
      'prettier',
      'import-helpers',
      'react',
      'jest'
   ],  
   rules: {
      // Global
      'no-new': 'off',
      'no-console': 'warn',
      'no-shadow': 'off',
      'prettier/prettier': 'error',

      // Styles
      'quotes': 'off',
      '@typescript-eslint/quotes': ['error', 'single'],
      'semi': 'off',
      '@typescript-eslint/semi': ['error', 'never'],

      // React
      'react/jsx-uses-react': 'error',   
      'react/jsx-uses-vars': 'error',

      // Typescript
      "@typescript-eslint/no-namespace": "off",
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      "@typescript-eslint/no-shadow": "off",
      '@typescript-eslint/no-unused-vars': ['warn', {
         argsIgnorePattern: '^_',
         varsIgnorePattern: '^_'
      }],
      '@typescript-eslint/naming-convention': [
         'error',
         {
         selector: 'interface',
         format: ['PascalCase'],
         custom: {
            regex: '^I[A-Z]',
            match: true
         }
         },
         {
         selector: 'typeParameter',
         format: ['PascalCase'],
         prefix: ['T']
         },
         {
         selector: 'typeAlias',
         format: ['PascalCase'],
         custom: {
            regex: '^T[A-Z]',
            match: true
         }
         },
         {
         selector: 'enum',
         format: ['PascalCase'],
         custom: {
            regex: '^E[A-Z]',
            match: true
         }
         }
      ],

      // Import Helpers
      'import-helpers/order-imports': [
         'warn',
         {
         newlinesBetween: 'always',
         groups: [
            '/^react/',
            'module',
            '/^@[a-zA-Z0-9-]+\\//',
            '/@src/components/',
            '/@src/hooks/',
            '/@src/navigation/',
            '/@src/screens/',
            '/@src/services/',
            '/@src/theme/',
            '/@src/types/',
            '/^@/',
            '/^@\\//',
            ['parent', 'sibling', 'index'],
         ],
         alphabetize: { order: 'asc', ignoreCase: true },
         }
      ]
   }
}

import { RuleTester as ESLintTesterV8 } from 'eslint-v8'
import { RuleTester as ESLintTesterV9 } from 'eslint'
import { rules } from '@next/eslint-plugin-next'

const NextESLintRule = rules['no-async-client-component']

const message =
  'Prevent client components from being async functions. See: https://nextjs.org/docs/messages/no-async-client-component'

const tests = {
  valid: [
    `
    export default async function MyComponent() {
      return <></>
    }
    `,
    `
    "use client"

    export default async function myFunction() {
      return ''
    }
    `,
    `
    async function MyComponent() {
      return <></>
    }

    export default MyComponent
    `,
    `
    "use client"

    async function myFunction() {
      return ''
    }

    export default myFunction
    `,
    `
    "use client"

    const myFunction = () => {
      return ''
    }

    export default myFunction
    `,
  ],
  invalid: [
    {
      code: `
      "use client"

      export default async function MyComponent() {
        return <></>
      }
      `,
      errors: [{ message }],
    },
    {
      code: `
      "use client"

      export default async function MyFunction() {
        return ''
      }
      `,
      errors: [{ message }],
    },
    {
      code: `
      "use client"

      async function MyComponent() {
        return <></>
      }

      export default MyComponent
      `,
      errors: [{ message }],
    },
    {
      code: `
      "use client"

      async function MyFunction() {
        return ''
      }

      export default MyFunction
      `,
      errors: [{ message }],
    },
    {
      code: `
      "use client"

      const MyFunction = async () => {
        return '123'
      }

      export default MyFunction
      `,
      errors: [{ message }],
    },
  ],
}

describe('no-async-client-component single line', () => {
  new ESLintTesterV8({
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: {
        modules: true,
        jsx: true,
      },
    },
  }).run('eslint-v8', NextESLintRule, tests)

  new ESLintTesterV9({
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          modules: true,
          jsx: true,
        },
      },
    },
  }).run('eslint-v9', NextESLintRule, tests)
})

import yaml from '@rollup/plugin-yaml'
import { sveltekit } from '@sveltejs/kit/vite'
import type { UserConfig } from 'vite'
import {
  action_types,
  fetch_github_metadata,
  make_screenshots,
  update_readme,
  type Action,
} from './src/tasks'

const action = (process.env?.ACTION ?? `add-missing`) as Action
if (!action_types.includes(action)) {
  const types_str = action_types.join(`|`)
  throw new Error(
    `Correct usage: ACTION=${types_str} vite dev, got ACTION=${action}\n`,
  )
}

if (!process.env.CI) {
  update_readme()
  fetch_github_metadata({ action })
  setTimeout(() => make_screenshots({ action }), 1000)
}

export default {
  plugins: [sveltekit(), yaml()],

  server: {
    fs: { allow: [`../..`] }, // needed to import from $root
    port: 3000,
  },

  preview: {
    port: 3000,
  },
} satisfies UserConfig

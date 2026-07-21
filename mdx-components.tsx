import type { MDXComponents } from 'mdx/types'
import { mdxComponents } from '@/components/mdx'

// Required at the project root by @next/mdx in the App Router.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components }
}

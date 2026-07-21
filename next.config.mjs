import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

// Plugins are named as strings rather than imported functions: Turbopack serialises
// the loader config across a process boundary and cannot carry a function through.
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      ['remark-frontmatter', ['yaml']],
      'remark-gfm',
      'remark-math',
    ],
    rehypePlugins: [
      'rehype-slug',
      ['rehype-katex', { strict: false, output: 'html' }],
    ],
  },
})

export default withMDX(nextConfig)

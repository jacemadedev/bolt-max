export const config = {
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    apiUrl: '/.netlify/functions',
  },
  api: {
    baseUrl: import.meta.env.PROD 
      ? 'https://your-netlify-site.netlify.app'
      : 'http://localhost:8888'
  }
} as const;
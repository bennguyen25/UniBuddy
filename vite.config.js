import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = (env.VITE_ANTHROPIC_KEY || '').trim()

  return {
    plugins: [
      react(),
      {
        name: 'anthropic-proxy',
        configureServer(server) {
          server.middlewares.use('/api/claude', async (req, res) => {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(body)
                const response = await fetch('https://api.anthropic.com/v1/messages', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                  },
                  body: JSON.stringify(parsed),
                })
                const data = await response.json()
                if (response.status !== 200) console.log('[claude proxy] error:', response.status, JSON.stringify(data))
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = response.status
                res.end(JSON.stringify(data))
              } catch (err) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: err.message }))
              }
            })
          })
        },
      },
    ],
  }
})

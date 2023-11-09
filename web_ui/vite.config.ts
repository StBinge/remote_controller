import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    host:'0.0.0.0',
    proxy:{
      '/api':{
        target:'http://localhost:9191',
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api/, ''),
      },
      '/move':{
        target:'ws://localhost:9191',
        changeOrigin:true,
        ws:true,
        // rewrite: (path)=> path.replace(/^\/wsapi/,""), 
      }

    }
  }
})

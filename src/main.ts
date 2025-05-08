import { createApp } from 'vue'
import './styles/index.scss'
import router from './router/index';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue'

// 开发环境下引入 Mock
if (import.meta.env.DEV) {
  import('./mock/index');
}

const app = createApp(App)

app.use(router);
app.use(Antd);
app.mount('#app')

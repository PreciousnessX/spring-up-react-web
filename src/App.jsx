import { Layout } from 'antd'
import './App.scss'
import './styles/layout.scss'

const { Header, Content, Footer } = Layout

function App() {
  return (
    <Layout className="layout">
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="logo" />
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <div className="site-layout-content">
          欢迎使用 React + Vite 项目
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Spring Up React Web ©2024 Created by Spring Up Team
      </Footer>
    </Layout>
  )
}

export default App

import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/home/HomePage'
import TeamsPage from './pages/teams/TeamsPage'
import PlanPage from './pages/plan/PlanPage'
import MissionsPage from './pages/missions/MissionsPage'
import MissionDetailPage from './pages/missions/MissionDetailPage'
import RankingPage from './pages/ranking/RankingPage'
import AdminPage from './pages/admin/AdminPage'

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/missions/:missionId" element={<MissionDetailPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}

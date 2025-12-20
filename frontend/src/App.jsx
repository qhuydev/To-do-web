import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login, Register } from './pages/Auth'
import BoardList from './pages/BoardList'
import Board from './pages/Boards/Board'
import PremiumPage from './pages/Premium/PremiumPage'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import { useAuthStore } from './stores'
import IdeasPage from './pages/navitems/IdeasPage'
import MyTasks from './pages/navitems/MyTask'
function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <BoardList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/boards/:boardId"
          element={
            <ProtectedRoute>
              <Board />
            </ProtectedRoute>
          }
        />
        <Route
          path="/premium"
          element={
            <ProtectedRoute>
              <PremiumPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/ideas" element={<IdeasPage />} />
        <Route path="/switch" element={<MyTasks />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App

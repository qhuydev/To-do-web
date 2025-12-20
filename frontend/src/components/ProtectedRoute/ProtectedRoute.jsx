import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '~/stores'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute

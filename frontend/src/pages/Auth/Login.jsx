import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import { useAuthStore } from '~/stores'

function Login() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const validateForm = () => {
    const errors = {}
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format'
    }
    if (!formData.password) {
      errors.password = 'Password is required'
    }
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (error) clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const result = await login(formData)
    if (result.success) {
      navigate('/')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0052cc',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', borderRadius: '12px' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight={700} 
              sx={{ 
                color: '#0052cc',
                letterSpacing: '-0.5px',
              }}
            >
              ToDoList
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Sign in to manage your tasks
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>

            <Typography variant="body2" textAlign="center">
              Don&apos;t have an account?{' '}
              <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login

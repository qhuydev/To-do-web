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
import PersonIcon from '@mui/icons-material/Person'
import { useAuthStore } from '~/stores'

function Register() {
  const navigate = useNavigate()
  const { register, isLoading, error, clearError } = useAuthStore()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const validateForm = () => {
    const errors = {}
    if (!formData.displayName) {
      errors.displayName = 'Display name is required'
    }
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format'
    }
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
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

    const { confirmPassword, ...registerData } = formData
    const result = await register(registerData)
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
        bgcolor: '#f5f6f8',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" textAlign="center" fontWeight="bold" mb={1}>
            To-Do List
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            Create your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="displayName"
              label="Display Name"
              value={formData.displayName}
              onChange={handleChange}
              error={!!validationErrors.displayName}
              helperText={validationErrors.displayName}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

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

            <TextField
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
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
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
            </Button>

            <Typography variant="body2" textAlign="center">
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Register

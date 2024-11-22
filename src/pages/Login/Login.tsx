import {
  Button,
  Grid2 as Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { FormContainer, formContainer, loginContainer } from './styles'

export const Login = () => {
  return (
    <Grid sx={loginContainer}>
      <Paper elevation={0} variant="elevation" sx={formContainer}>
        <Grid display="flex" gap={1} flexDirection="column">
          <Typography variant="h5" align="center">
            Sign in to your account
          </Typography>
          <Typography variant="body1" align="center">
            Don’t have an account? Get started
          </Typography>
        </Grid>
        <FormContainer>
          <Grid display="flex" gap={2} flexDirection="column">
            <TextField
              autoComplete="username"
              label="Email"
              variant="outlined"
              type="email"
            />
            <TextField
              autoComplete="current-password"
              label="Password"
              variant="outlined"
              type="password"
            />
            <Button variant="contained" color="primary" type="submit">
              Sign in
            </Button>
          </Grid>
        </FormContainer>
      </Paper>
    </Grid>
  )
}

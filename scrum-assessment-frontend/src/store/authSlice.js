import { createSlice } from '@reduxjs/toolkit'
import { getCurrentUser } from '../api/user'

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  accessToken: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
// Registration actions
    registerStart(state) {
      state.loading = true;
      state.error = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.error = null;
    },
    registerFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Login actions (keep existing ones)
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    setUser(state, action) {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  setUser,
} = authSlice.actions

// Thunk for initial authentication check
export const checkAuth = () => async (dispatch) => {
  try {
    const user = await getCurrentUser()
    console.log('user', user)
    if (user) {
      dispatch(setUser(user))
    }
  } catch (error) {
    console.error('Auth check failed:', error)
  }
}

export default authSlice.reducer
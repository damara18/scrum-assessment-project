import api from './api'

export const login = async (credentials) => {
    const formData = new FormData()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)
    
    try {
        // Get access token
        const tokenResponse = await api.post('/api/v1/auth/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        const { access_token } = tokenResponse.data
        
        // Store token
        localStorage.setItem('access_token', access_token)
        
        // Get user details using the token
        const userResponse = await api.get('/api/v1/user/profile', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        
        return { ...userResponse.data, access_token }
    } catch (error) {
        throw error
    }
}
export const register = async (userData) => {
    try {
        const response = await api.post('/api/v1/auth/register', userData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const logout = () => {
    localStorage.removeItem('access_token')
}

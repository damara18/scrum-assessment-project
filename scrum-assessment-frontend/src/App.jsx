import {CssBaseline, ThemeProvider, createTheme} from '@mui/material'
import {useSelector} from 'react-redux'
import {Navigate, Route, Routes} from 'react-router-dom'
import Navbar from './components/Navbar'
import Admin from './pages/Admin'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import UserListPage from "./pages/UserListPage.jsx";
import UserDetailPage from "./pages/UserDetailPage.jsx";
import UserEditPage from "./pages/UserEditPage.jsx";
import CreateUserPage from "./pages/CreateUserPage.jsx";
import ProjectListPage from "./pages/ProjectListPage.jsx";
import CreateProjectPage from "./pages/CreateProjectPage.jsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";
import ProjectEditPage from "./pages/ProjectEditPage.jsx";
import SheetListPage from "./pages/SheetListPage.jsx";
import CreateSheetPage from "./pages/CreateSheetPage.jsx";
import SheetEditPage from "./pages/SheetEditPage.jsx";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

function App() {
  const {isAuthenticated, user} = useSelector((state) => state.auth)
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/"/> : <Register/>}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/"/> : <Login/>}
        />
        <Route
          path="/admin"
          element={
            isAuthenticated && user?.role?.role_name === 'ADMIN' ? (
              <Admin/>
            ) : (
              <Navigate to="/"/>
            )
          }
        />
        <Route
          path="/admin/users"
          element={
            isAuthenticated && user?.role?.role_name === 'ADMIN' ? (
              <UserListPage/>
            ) : (
              <Navigate to="/"/>
            )
          }
        />
        <Route 
          path="/admin/users/:userId" 
          element={
            isAuthenticated && user?.role?.role_name === 'ADMIN' ? (
              <UserDetailPage />
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        <Route 
          path="/admin/edit-user/:userId" 
          element={
            isAuthenticated && user?.role?.role_name === 'ADMIN' ? (
              <UserEditPage />
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        <Route 
          path="/admin/create-user" 
          element={
            isAuthenticated && user?.role?.role_name === 'ADMIN' ? (
              <CreateUserPage />
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        <Route 
          path="/admin/projects" 
          element={
              isAuthenticated && user?.role?.role_name === 'ADMIN' ? (
              <ProjectListPage />
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        <Route 
          path="/admin/projects/:projectId" 
          element={
            isAuthenticated && user?.role?.role_name === 'ADMIN' ? (
              <ProjectDetailPage />
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        <Route 
          path="/admin/edit-project/:projectId" 
          element={
            isAuthenticated && user?.role?.role_name === 'ADMIN' ? (
              <ProjectEditPage />
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        <Route 
          path="/admin/create-project" 
          element={
            isAuthenticated && user?.role?.role_name === 'ADMIN' ? (
              <CreateProjectPage />
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        <Route 
          path="/admin/sheets" 
          element={
            isAuthenticated && user?.role?.role_name === 'ADMIN' ? (
              <SheetListPage />
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        <Route 
          path="/admin/create-sheet" 
          element={
            isAuthenticated && user?.role?.role_name === 'ADMIN' ? (
              <CreateSheetPage />
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        <Route 
          path="/admin/edit-sheet/:sheetId" 
          element={
            isAuthenticated && user?.role?.role_name === 'ADMIN' ? (
              <SheetEditPage />
            ) : (
              <Navigate to="/" />
            )
          } 
        />
      </Routes>
    </ThemeProvider>
  )
}

export default App
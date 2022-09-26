import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import NavBar from './components/NavBar'
import PrivateRoute from './components/PrivateRoute'
import {
  baseUrl,
  signupUrl,
  loginUrl,
  homeUrl,
  profileUrl,
} from './utils/routeConstants'

// temp test page, pls delete after actual question page is up
import RenderPage from './pages/RenderPage'

const App = () => {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path={'/test'} element={<RenderPage />}/>
          <Route exact path={baseUrl} element={<LandingPage />} />
          <Route path={signupUrl} element={<SignupPage />} />
          <Route path={loginUrl} element={<LoginPage />} />
          <Route
            path={homeUrl}
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path={profileUrl}
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App

import { Router , Routes, Route} from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar'
import ComplimentPage from './Pages/ComplimentPage'
import DrinkVotePage from './Pages/DrinkVotePage'
import JukeboxPage from './Pages/JukeboxPage'
import GamesPage from './Pages/GamesPage'
import FeedbackPage from './Pages/FeedbackPage'


function App() {
 
  return (
    <div className='h-full'>

   
      <Navbar />
      <Routes>
        <Route path="/" element={<ComplimentPage />} />
        <Route path="/drink-vote" element={<DrinkVotePage />} />
        <Route path="/jukebox" element={<JukeboxPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
    </div>
  )
}

export default App

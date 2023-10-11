import { Component, createEffect} from 'solid-js';
import { Route, Routes, useNavigate } from '@solidjs/router';
import { useJournalContext, pb } from "./context/JournalContext";
import Home from './pages/Home';
import Header from './components/Header';
import FoodJournal from './pages/FoodJournal';
import WorkoutJournal from './pages/WorkoutJournal';
import Day from './pages/Day';
import Exercise from './pages/Exercise';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';


const App: Component = () => {

  const {isAuth} = useJournalContext();
  const navigate = useNavigate();

  createEffect(() => {
    // navigate("/food-journal", {replace: true});
    if (isAuth() === false) {
      navigate("/", {replace: true});
    }
  })

  return (
    <div>
      <Header/>
      <Routes>
        <Route path={"/"} component={Home}/>
        <Route path={"/signin"} component={SignIn}/>
        <Route path={"/signup"} component={SignUp}/>
        <Route path={"/food-journal"} component={FoodJournal}/>
        <Route path={"/food-journal/:id"} component={Day}/>
        <Route path={"/workout-journal"} component={WorkoutJournal}/>
        <Route path={"/workout-journal/:id"} component={Exercise}/>
      </Routes>
    </div>
  );
};

export default App;

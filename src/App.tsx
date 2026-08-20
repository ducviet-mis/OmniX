import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Grades } from './pages/Grades';
import { Tasks } from './pages/Tasks';
import { Schedule } from './pages/Schedule';
import { Tools } from './pages/Tools';
import { Pomodoro } from './pages/Pomodoro';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="grades" element={<Grades />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="tools" element={<Tools />} />
          <Route path="pomodoro" element={<Pomodoro />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

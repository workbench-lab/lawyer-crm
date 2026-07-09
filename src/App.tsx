import { useState } from 'react';
import { isAuthed } from './auth';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './Dashboard';

export default function App() {
  const [authed, setAuthed] = useState(isAuthed);

  if (!authed) {
    return <LoginPage onSuccess={() => setAuthed(true)} />;
  }
  return <Dashboard onLogout={() => setAuthed(false)} />;
}

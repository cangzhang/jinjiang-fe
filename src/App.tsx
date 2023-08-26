import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import { NovelList } from './components/Novels.tsx';
import { Home } from './components/Home.tsx';
import { NavBar } from './components/NavBar.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NovelStats } from './components/NovelStats.tsx';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NavBar/>
        <main className="md:container md:mx-auto">
          <Routes>
            <Route path="/novel/:novelID" element={<NovelStats/>}/>
            <Route path="/novels" element={<NovelList/>}/>
            <Route path="/" element={<Home/>}/>
          </Routes>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

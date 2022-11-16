import { useEffect, useState } from 'react';
import DelayTables from './components/DelayTables/DelayTables';
import LoginAlert from './components/LoginAlert/LoginAlert';
import Main from './components/Main/Main';
import StopsTable from './components/StopsTable/StopsTable';
import useLocalStorage from './hooks/useLocalStorage';
import useStops from './hooks/useStops';

function App() {
  const [isLogged, setIsLogged] = useLocalStorage('logged', false);
  const { stops, state } = useStops();
  const [selectedStopsIds, setSelectedStopsIds] = useState<number[]>([]);

  const selectedStops = stops.filter((stop) =>
    selectedStopsIds.includes(stop.stopId)
  );

  useEffect(() => {
    if (!isLogged) return setSelectedStopsIds([]);

    fetch('http://localhost:3000/selection', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setSelectedStopsIds(data));
  }, [isLogged]);

  const handleSelectStop = async (id: number) => {
    if (isLogged) {
      try {
        const res = await fetch('http://localhost:3000/selection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            selectId: id,
          }),
        });

        const newSelections = await res.json();

        setSelectedStopsIds(newSelections);
      } catch (e) {
        console.log(e);
      }
    } else {
      if (!selectedStopsIds.includes(id)) {
        setSelectedStopsIds((prev) => [...prev, id]);
      }
    }
  };

  const handleUnselectStop = async (id: number) => {
    if (isLogged) {
      try {
        const res = await fetch('http://localhost:3000/selection', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            selectId: id,
          }),
        });

        const newSelections = await res.json();

        setSelectedStopsIds(newSelections);
      } catch (e) {
        console.log(e);
      }
    } else {
      setSelectedStopsIds((prev) => prev.filter((stopId) => stopId !== id));
    }
  };

  const handleLogin = () => {
    setIsLogged(true);
  };

  const handleLogout = () => {
    setIsLogged(false);
  };

  // TODO: Zrobić logowanie, Context dla autentykacji, dokument z ID wybranych przystanków

  return (
    <div>
      <LoginAlert
        isLogged={isLogged}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <Main heading='Timetable'>
        <DelayTables onClick={handleUnselectStop} stops={selectedStops} />
        <StopsTable
          onClick={handleSelectStop}
          stops={stops}
          selected={selectedStopsIds}
        />
      </Main>
    </div>
  );
}

export default App;

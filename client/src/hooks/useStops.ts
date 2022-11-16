import { useEffect, useState } from 'react';
import Stop from '../models/Stop';

export default function useStops() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'success'>(
    'loading'
  );

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchStops = async () => {
      setState('loading');
      try {
        const stops = await fetch('http://localhost:3000/stops', {
          signal,
        }).then((res) => res.json());
        setStops(stops);
        setState('success');
      } catch (e) {
        setState('error');
      }
    };

    fetchStops();

    return () => {
      abortController.abort();
    };
  }, []);

  return { stops, state };
}

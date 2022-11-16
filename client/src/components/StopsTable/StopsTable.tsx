import { useMemo, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import Stop from '../../models/Stop';
import styles from './StopsTable.module.css';

interface StopsTableProps {
  stops: Stop[];
  onClick: (id: number) => void;
}

export default function StopsTable(props: StopsTableProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const filteredStops = useMemo(
    () =>
      props.stops.filter(
        (stop) =>
          stop.stopName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          debouncedQuery.length < 3
      ),
    [debouncedQuery, props.stops]
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Stops</h1>
      <input
        className={styles.search}
        type='text'
        placeholder='Search...'
        value={query}
        onChange={handleChange}
      />
      {filteredStops.map((stop) => (
        <div
          key={stop.stopId}
          className={styles.stop}
          onClick={() => props.onClick(stop.stopId)}
        >
          <div>{stop.stopName}</div>
          <div>{stop.stopCode}</div>
          <div>{stop.zoneName}</div>
        </div>
      ))}
    </div>
  );
}

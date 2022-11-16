import { useEffect } from 'react';
import Stop from '../../models/Stop';
import DelayCard from '../DelayCard/DelayCard';
import styles from './DelayTables.module.css';

interface DelayTablesProps {
  stops: Stop[];
  onClick: (id: number) => void;
}

export default function DelayTables(props: DelayTablesProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Buses</h1>
      <div className={styles.delays}>
        {props.stops.map((stop) => (
          <DelayCard onClick={props.onClick} key={stop.stopId} stop={stop} />
        ))}
      </div>
    </div>
  );
}

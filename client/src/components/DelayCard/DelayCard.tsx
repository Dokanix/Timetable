import { useEffect, useState } from 'react';
import Delay from '../../models/Delay';
import Stop from '../../models/Stop';
import styles from './DelayCard.module.css';

interface DelayCardProps {
  stop: Stop;
  onClick: (id: number) => void;
}

export default function DelayCard(props: DelayCardProps) {
  const [delays, setDelays] = useState<Delay[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3000/stops/${props.stop.stopId}`)
      .then((res) => res.json())
      .then(setDelays);
  }, []);

  return (
    <div
      className={styles.card}
      onClick={() => props.onClick(props.stop.stopId)}
    >
      <div className={styles.heading}>{props.stop.stopName}</div>
      <div className={styles.content}>
        {delays.map((delay, index) => (
          <div key={index} className={styles.delay}>
            <div>{delay.routeId}</div>
            <div>{delay.headsign}</div>
            <div>{delay.estimatedTime}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

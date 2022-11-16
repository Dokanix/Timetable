import styles from './Main.module.css';

interface MainProps {
  children: React.ReactNode;
  heading?: string;
}

export default function Main(props: MainProps) {
  return (
    <main className={styles.main}>
      {props.heading && <h1 className={styles.heading}>{props.heading}</h1>}
      <div className={styles.container}>{props.children}</div>
    </main>
  );
}

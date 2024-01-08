import styles from './page.module.scss';

export default function Home() {

  return (
    <div className={styles.todoWelcomePage}>
      <h1>Todo welcome page</h1>
      <p>Useful payload</p>
    </div>
  );
}

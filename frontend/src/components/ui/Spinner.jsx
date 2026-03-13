import styles from './Spinner.module.css'

export function Spinner({ size = 'md' }) {
  return <span className={`${styles.spinner} ${styles[size]}`} />
}

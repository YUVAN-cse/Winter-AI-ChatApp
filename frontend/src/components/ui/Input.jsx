import styles from './Input.module.css'
import { clsx } from 'clsx'
import { forwardRef } from 'react'

export const Input = forwardRef(function Input({ label, error, className, ...props }, ref) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        ref={ref}
        className={clsx(styles.input, error && styles.hasError, className)}
        {...props}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
})

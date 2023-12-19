import styles from './Radio.module.css'

type RadioProps = {
  text: string
  checked: boolean
  onClick: (e) => void
}

const Radio = (props: RadioProps) => {
  const { text, checked, onClick } = props

  return (
    <div className={styles.itemsToFilterContainer}>
      <div onClick={onClick} className={styles.dateItem}>
        <span>{text}</span>

        <input
          type="radio"
          className={styles.radio}
          onChange={() => null}
          name="date-time"
          checked={checked}
        />

        <div className={styles.check}></div>
      </div>
    </div>
  )
}

export default Radio

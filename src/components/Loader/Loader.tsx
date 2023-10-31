import styles from './Loader.module.css'

export const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <span className={styles.loader}></span>
    </div>
  )
}

export const MainLoader = () => <Loader />
export const BtnLoader = () => {
  return <span className={styles.buttonLoader}></span>
}

export const ModalLoader = () => {
  return <span className={styles.modalLoader}></span>
}

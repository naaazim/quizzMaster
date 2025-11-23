import styles from "../style/ConfirmationModal.module.css";
import Modal from "./Modal";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  const footer = (
    <>
      <button className={styles.cancel} onClick={onCancel}>Annuler</button>
      <button className={styles.confirm} onClick={onConfirm}>Confirmer</button>
    </>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title="Confirmation"
      footer={footer}
    >
      <p className={styles.message}>{message}</p>
    </Modal>
  );
};

export default ConfirmationModal;
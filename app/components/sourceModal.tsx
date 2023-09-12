import React, { useState, useEffect } from "react";
import styles from "./sourceModal.module.scss";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function SourceModal({
  title,
  isOpen,
  onClose,
  children,
}: ModalProps) {
  const [modalOpen, setModalOpen] = useState(isOpen);

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setModalOpen(false);
    onClose();
  };

  return modalOpen ? (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-Inner"]}>
        <div className={styles["modal-header"]}>
          <span className={styles["modal-title"]}>{title}</span>
          <button className={styles["modal-close"]} onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className={styles["modal-content"]}>{children}</div>
      </div>
    </div>
  ) : null;
}

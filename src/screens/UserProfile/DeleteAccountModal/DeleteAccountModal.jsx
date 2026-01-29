import React, { useState } from 'react';
import Modal from 'react-modal';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import styles from './DeleteAccountModal.module.css';
import { toast } from 'react-hot-toast';
import { deleteUserAccount } from '../../../services/apis/profile.service';
import { logout } from '../../../store/auth/auth.slice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const DeleteAccountModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            const res = await deleteUserAccount();

            if (res.status === 1) {
                toast.success("Account deleted successfully");

                dispatch(logout());
                navigate("/login");
            } else {
                toast.error(res.message || "Failed to delete account");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsDeleting(false);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className={styles.DeleteAccountModalContent}
            overlayClassName={styles.DeleteAccountOverlay}
            closeTimeoutMS={300}
        >
            <div className={styles.DeleteAccountHeader}>
                <div className={styles.DeleteAccountWarningIcon}>
                    <AlertTriangle color="#ef4444" size={32} />
                </div>
                <button className={styles.DeleteAccountCloseBtn} onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            <div className={styles.DeleteAccountBody}>
                <h2 className={styles.DeleteAccountTitle}>Delete Account?</h2>
                <p className={styles.DeleteAccountDescription}>
                    This action is permanent. You will lose all your data, wallet balance,
                    and history. This cannot be undone.
                </p>
            </div>

            <div className={styles.DeleteAccountFooter}>
                <button
                    className={styles.DeleteAccountCancelBtn}
                    onClick={onClose}
                    disabled={isDeleting}
                >
                    Keep Account
                </button>
                <button
                    className={styles.DeleteAccountConfirmBtn}
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
            </div>
        </Modal>
    );
};

export default DeleteAccountModal;
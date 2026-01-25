import React, { useState, useEffect } from 'react';
import styles from './WalletBalance.module.css';
import backFaq from '../../../assets/images/backIcon.svg';
import { Landmark, Plus, Wallet, X, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatINR } from "../../../utils/currency";
import { fetchWalletBalanceWithBankDetails, fetchWalletHistory, walletAddBank, walletWithdrawBalance } from '../../../services/apis/wallet.service';
import LoadingDots from '../../../components/LoadingDots/LoadingDots';
import DesktopOrderSkeleton from '../../../components/SkeletonLoading/GoldOrdersSkeleton/DesktopOrderSkeleton';
import toast from 'react-hot-toast';

const WalletBalance = ({
    isOpen,
    onClose,
    showBackButton = true,
}) => {
    const [view, setView] = useState('balance'); // 'balance', 'selectBank', 'addBank'
    const [isProcessing, setIsProcessing] = useState(false);
    const [isFetchingWalletData, setIsFetchingWalletData] = useState(false);
    const [walletData, setWalletData] = useState({ balance: 0, banks: [] });
    const [historyData, setHistoryData] = useState([])
    const [isFetchingHistory, setIsFetchingHistory] = useState(false)

    const [apiMessage, setApiMessage] = useState('');

    const [selectedBank, setSelectedBank] = useState(null);
    const [amount, setAmount] = useState("");

    const [bankForm, setBankForm] = useState({ name: '', accNo: '', ifsc: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            fetchWalletData();
            fetchHistory()
        }
    }, [isOpen]);

    const fetchWalletData = async () => {
        setIsFetchingWalletData(true)
        setApiMessage('');
        try {
            const res = await fetchWalletBalanceWithBankDetails()
            if (res.status === 1) {
                setWalletData({
                    balance: res.walletBalance ?? 0,
                    banks: res.banks ?? []
                })
            } else {
                setWalletData({
                    balance: res.walletBalance ?? 0,
                    banks: res.banks ?? []
                })
            }
        } catch (err) {
            console.error(err)
            setWalletData({
                balance: 0,
                banks: []
            })
        } finally {
            setIsFetchingWalletData(false)
        }
    }

    const fetchHistory = async () => {
        setIsFetchingHistory(true)
        try {
            const res = await fetchWalletHistory()
            if (res?.status === 1 && Array.isArray(res.history)) {
                setHistoryData(res.history)
            } else {
                setHistoryData([])
            }
        } catch (err) {
            setHistoryData([])
        } finally {
            setIsFetchingHistory(false)
        }
    }




    const handleAddBank = async () => {
        const newErrors = {};

        if (!bankForm.name) newErrors.name = "Bank name required";
        if (bankForm.accNo.length < 10) newErrors.accNo = "Invalid account number";
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankForm.ifsc)) newErrors.ifsc = "Invalid IFSC code";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setApiMessage('');
        setIsProcessing(true);

        try {
            const res = await walletAddBank({
                accountNumber: bankForm.accNo,
                bankName: bankForm.name,
                ifscCode: bankForm.ifsc
            });

            if (res.status === 1) {
                setApiMessage('');
                await fetchWalletData();
                setBankForm({ name: '', accNo: '', ifsc: '' });
                setTimeout(() => setView('selectBank'), 800);
            } else {
                // setApiMessage(res.message);
                toast.error(res.message, {
                    style: {
                        zIndex: 99999999
                    }
                })
            }
        } catch (e) {
            setApiMessage('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };


    const handleWithdraw = async () => {
        if (!amount || Number(amount) <= 0) {
            setApiMessage('Enter valid amount');
            return;
        }

        if (Number(amount) > walletData.balance) {
            setApiMessage('Insufficient balance');
            return;
        }

        if (!selectedBank) {
            setApiMessage('Select a bank account');
            return;
        }

        setIsProcessing(true);
        setApiMessage('');

        try {
            const res = await walletWithdrawBalance({
                bankId: selectedBank,
                amount: Number(amount)
            });

            if (res.status === 1) {
                setAmount('');
                setSelectedBank(null);
                await fetchWalletData();
                await fetchHistory();
                setTimeout(() => setView('balance'), 800);
            } else {
                toast.error(res.message, {
                    style: {
                        zIndex: 99999999
                    }
                })
            }
        } catch (e) {
            setApiMessage('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };



    const resetForm = () => {
        setApiMessage('')
        setBankForm({ name: '', accNo: '', ifsc: '' });
        setAmount("")
    }

    if (!isOpen) return null;

    return (
        <div className={`${styles.WalletBalanceModalOverlay} ${isOpen ? styles.WalletBalanceOpen : ''}`}>
            <div className={styles.WalletBalanceModalContainer}>
                <div className={styles.WalletBalanceModalHeader}>
                    <div className={styles.WalletBalanceComponentParent}>
                        <img
                            className={styles.WalletBalanceBackIcon}
                            alt="Back"
                            src={backFaq}
                            onClick={view === 'balance' ? onClose : () => setView('balance')}
                            style={{ cursor: 'pointer' }}
                        />
                        <div className={styles.WalletBalanceHeaderTitleWrapper}>
                            <h2 className={styles.WalletBalanceHeading}>Wallet</h2>
                            <span className={styles.WalletBalanceSubHeaderText}>Manage your wallet balance</span>
                        </div>
                    </div>
                </div>

                <div className={styles.WalletBalanceMainContentScroll}>
                    <div className={styles.WalletBalanceInnerBody}>

                        {view === 'balance' && (
                            <>
                                <div className={styles.WalletBalancePremiumCard}>
                                    <div className={styles.WalletBalanceCardCircle} />
                                    <div className={styles.WalletBalanceCardHeader}>
                                        <span className={styles.WalletBalanceCardTitle}>Total Balance</span>
                                        <Wallet size={18} opacity={0.7} />
                                    </div>
                                    <h2 className={styles.WalletBalanceCardBalance}>
                                        {isFetchingWalletData ? <LoadingDots /> : formatINR(walletData.balance)}

                                    </h2>
                                    <div className={styles.WalletBalanceCardFooter}>
                                        <span className={styles.WalletBalanceCardNumber}>**** **** **** ****</span>
                                        <span
                                            className={styles.WalletBalanceCardWithdrawLabel}
                                            onClick={() => setView('selectBank')}
                                        >
                                            Withdraw to Bank
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.WalletBalanceHistorySection}>
                                    <h3 className={styles.WalletBalanceSectionTitle}>Wallet History</h3>
                                    <div className={styles.WalletBalanceHistoryList}>
                                        {isFetchingHistory ? (
                                            <DesktopOrderSkeleton count={10} />
                                        ) : historyData.length === 0 ? (
                                            <div className={styles.NoTransactionText}>
                                                No Transactions found
                                            </div>
                                        ) : (
                                            historyData.map((item) => (
                                                <div key={item.id} className={styles.WalletBalanceHistoryItem}>


                                                    <div className={styles.WalletBalanceHistoryRow}>
                                                        <div className={styles.WalletBalanceTypeWrapper}>
                                                            <div className={`${styles.WalletBalanceFlowIcon} ${styles['WalletBalance' + item.flow]}`}>
                                                                {item.flow === 'CREDIT' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                                                            </div>
                                                            <span className={styles.WalletBalanceTransactionType}>
                                                                {item.transactionType}
                                                            </span>
                                                        </div>
                                                        <span className={`${styles.WalletBalanceHistoryAmount} ${styles['WalletBalance' + item.flow + 'Amount']}`}>
                                                            {item.flow === 'CREDIT' ? '+' : '-'} {formatINR(item.amount)}
                                                        </span>
                                                    </div>


                                                    <div className={styles.WalletBalanceHistoryRow}>
                                                        <p className={styles.WalletBalanceHistoryDateTime}>
                                                            {item.date} • {item.time}
                                                        </p>
                                                        <span className={`${styles.WalletBalanceStatusBadge} ${styles['status' + item.status]}`}>
                                                            {item.status}
                                                        </span>
                                                    </div>

                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {view === 'selectBank' && (
                            <div className={styles.WalletBalanceBankListContainer}>
                                <div className={styles.WalletBalanceSectionHeader}>
                                    <h3 className={styles.WalletBalanceSectionTitle}>Withdraw Funds</h3>
                                    <X
                                        size={18}
                                        className={styles.WalletBalanceCloseIcon}
                                        onClick={() => {
                                            setView('balance')
                                        }}
                                    />
                                </div>

                                <div className={styles.WalletBalanceCompactAmountBox}>
                                    <div className={styles.WalletBalanceAmountHeader}>
                                        <span className={styles.WalletBalanceInputLabel}>Enter Amount</span>
                                        <button
                                            className={styles.WalletBalanceMaxBadge}
                                            onClick={() => setAmount(walletData.balance.toString())}
                                        >
                                            MAX
                                        </button>
                                    </div>

                                    <div className={styles.WalletBalanceInputRow}>
                                        <span className={styles.WalletBalanceCurrencyPrefix}>₹</span>
                                        <input
                                            type="number"
                                            className={styles.WalletBalancePremiumAmountInput}
                                            value={amount}
                                            onChange={e => {
                                                const val = e.target.value
                                                if (val === '' || Number(val) <= walletData.balance) {
                                                    setAmount(val)
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className={styles.WalletBalanceBalanceInfo}>
                                        Available: {formatINR(walletData.balance)}
                                    </div>
                                </div>

                                <h3 className={styles.WalletBalanceSectionTitle}>Select Bank Account</h3>

                                <div className={styles.WalletBalanceBankListScroll}>
                                    {walletData.banks.map(bank => (
                                        <div
                                            key={bank.bankId}
                                            className={`${styles.WalletBalanceBankItem} ${selectedBank === bank.bankId ? styles.WalletBalanceSelectedBank : ''}`}
                                            onClick={() => setSelectedBank(bank.bankId)}
                                        >
                                            <Landmark size={20} className={styles.WalletBalanceBankIcon} />
                                            <div className={styles.WalletBalanceBankDetails}>
                                                <p className={styles.WalletBalanceBankName}>{bank.bankName}</p>
                                                <p className={styles.WalletBalanceBankAcc}>{bank.accountNumber}</p>
                                            </div>
                                            <div className={styles.WalletBalanceRadioCircle}>
                                                {selectedBank === bank.bankId && (
                                                    <div className={styles.WalletBalanceRadioInner} />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className={styles.WalletBalanceAddBankBtn}
                                    onClick={() => setView('addBank')}
                                >
                                    <Plus size={16} /> Add New Bank
                                </button>
                            </div>
                        )}

                        {view === 'addBank' && (
                            <div className={styles.WalletBalanceBankForm}>
                                <div className={styles.WalletBalanceSectionHeader}>
                                    <h3 className={styles.WalletBalanceSectionTitle}>Link Bank Account</h3>
                                    <X
                                        size={18}
                                        className={styles.WalletBalanceCloseIcon}
                                        onClick={() => setView('selectBank')}
                                    />
                                </div>

                                <div className={styles.WalletBalanceInputGroup}>
                                    <label>Bank Name</label>
                                    <input
                                        type="text"
                                        value={bankForm.name}
                                        onChange={e => setBankForm({ ...bankForm, name: e.target.value })}
                                    />
                                    {errors.name && (
                                        <span className={styles.WalletBalanceError}>{errors.name}</span>
                                    )}
                                </div>

                                <div className={styles.WalletBalanceInputGroup}>
                                    <label>Account Number</label>
                                    <input
                                        type="tel"
                                        value={bankForm.accNo}
                                        onChange={e => setBankForm({ ...bankForm, accNo: e.target.value })}
                                    />
                                    {errors.accNo && (
                                        <span className={styles.WalletBalanceError}>{errors.accNo}</span>
                                    )}
                                </div>

                                <div className={styles.WalletBalanceInputGroup}>
                                    <label>IFSC Code</label>
                                    <input
                                        type="text"
                                        value={bankForm.ifsc}
                                        onChange={e => setBankForm({ ...bankForm, ifsc: e.target.value.toUpperCase() })}
                                    />
                                    {errors.ifsc && (
                                        <span className={styles.WalletBalanceError}>{errors.ifsc}</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* {apiMessage && (
                        <div
                            className={styles.WalletBalanceApiMessage}
                            style={{
                                backgroundColor: '#e6f0ff',
                                color: '#0b3c8a',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                fontSize: '13px'
                            }}
                        >
                            {apiMessage}
                        </div>
                    )} */}

                    <div className={styles.WalletBalanceActionFooter}>
                        {view === 'addBank' && (
                            <button
                                className={styles.WalletBalanceSubmitButton}
                                disabled={isProcessing}
                                onClick={handleAddBank}
                            >
                                {isProcessing ? <LoadingDots /> : 'Save Bank Account'}
                            </button>
                        )}

                        {view === 'selectBank' && selectedBank && (
                            <button
                                className={styles.WalletBalanceSubmitButton}
                                disabled={isProcessing}
                                onClick={handleWithdraw}
                            >
                                {isProcessing ? <LoadingDots /> : 'Withdraw Balance'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

};

export default WalletBalance;
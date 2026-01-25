import React, { useState, useRef, useEffect } from 'react';
import styles from './BuyGold.module.css';
import backFaq from '../../../assets/images/backIcon.svg';
import { createGoldOrder, createGoldOrderVerify, buyGoldValidate, goldLivePrice } from '../../../services/apis/digitalGold.service';
import { Info } from "lucide-react";

const BuyGold = ({
    isOpen,
    onClose,
    title = "Buy Digital Gold",
    showBackButton = true,
    setStatusModal
}) => {
    const [amount, setAmount] = useState('');
    const [livePrice, setLivePrice] = useState(0);
    const [loadingLivePrice, setLoadingLivePrice] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);

    const [validationMsg, setValidationMsg] = useState('');
    const [isValidAmount, setIsValidAmount] = useState(false);
    const debounceRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            setAmount('');
            setValidationMsg('');
            setIsValidAmount(false);
            setIsProcessing(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const fetchLivePrice = async () => {
            setLoadingLivePrice(true);

            try {
                const response = await goldLivePrice();

                if (response.status === 1) {
                    setLivePrice(response?.pricePerGram || 0);
                } else {
                    setLivePrice(0);
                }
            } catch {
                setLivePrice(0);
            } finally {
                setLoadingLivePrice(false);
            }
        };

        fetchLivePrice();
    }, [isOpen]);


    if (!isOpen) return null;

    const validateBuyAmount = async (value) => {
        setValidationMsg('');
        setIsValidAmount(false);

        if (!value || Number(value) <= 0) return;

        try {
            const res = await buyGoldValidate({ amount: Number(value) });

            if (res.status === 1) {
                setIsValidAmount(true);
                setValidationMsg(res.message);
            } else {
                setIsValidAmount(false);
                setValidationMsg(res.message);
            }
        } catch {
            setIsValidAmount(false);
            setValidationMsg('Unable to validate amount. Please try again.');
        }
    };


    const handleQuickSelect = (val) => {
        setAmount(val.toString());
        validateBuyAmount(val);
    };


    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmount(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            validateBuyAmount(value);
        }, 500);
    };


    const createGoldOrders = async () => {
        try {
            setIsProcessing(true);

            const response = await createGoldOrder({ amount: amount });

            const options = {
                key: response.razorpayKey,
                amount: response.amount,
                currency: "INR",
                order_id: response.orderId,
                method: {
                    upi: true
                },
                prefill: {
                    vpa: ""
                },
                handler: async function (razorpayResponse) {
                    try {
                        const verifyRes = await createGoldOrderVerify({
                            ...razorpayResponse,
                            transactionId: response.transactionId
                        });

                        if (verifyRes.status === 1) {
                            setStatusModal({
                                open: true,
                                type: 'success',
                                details: { amount: verifyRes?.purchaseDetails?.amountPaid, goldInGrams: verifyRes?.purchaseDetails?.goldInGrams, transactionId: response.transactionId, transactionDate: verifyRes?.purchaseDetails?.dateTime }
                            });
                            onClose();

                        } else {
                            setStatusModal({
                                open: true,
                                type: 'failed',
                                details: { amount: amount }
                            });
                            onClose();
                        }
                    } finally {
                        setIsProcessing(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            setStatusModal({ open: true, type: 'failed', details: { amount: amount } });
            onClose();
        }
    };

    const resetForm = () => {
        setIsProcessing(false);
        setAmount('');
        onClose();
    }


    return (
        <div className={`${styles.BuyGoldmodalOverlay} ${isOpen ? styles.open : ''}`}>
            <div className={styles.BuyGoldmodalmodalContainer}>

                <div className={styles.BuyGoldmodalmodalHeader}>
                    {showBackButton && (
                        <div className={styles.BuyGoldmodalcomponent1Parent}>
                            <img
                                className={styles.BuyGoldmodalcomponent1Icon5}
                                alt="Back"
                                src={backFaq}
                                onClick={resetForm}
                                style={{ cursor: 'pointer' }}
                            />
                            <div className={styles.BuyGoldHeaderTitleWrapper}>
                                <b className={styles.BuyGoldmodalfaqsheading}>{title}</b>
                                <span className={styles.BuyGoldSubHeaderText}>24K | 99.94% Pure Gold</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.BuyGoldMainContentScroll}>
                    <div className={styles.BuyGoldInnerBody}>

                        <div className={styles.BuyGoldInputSection}>
                            <div className={styles.BuyGoldInputContainer}>
                                <span className={styles.BuyGoldRupeeSign}>₹</span>
                                <input
                                    type="number"
                                    className={styles.BuyGoldMainInput}
                                    placeholder="0"
                                    value={amount}
                                    onChange={handleAmountChange}
                                />
                            </div>
                        </div>


                        {validationMsg && (
                            <div className={styles.validationBox}>
                                <Info className={styles.validationIcon} size={18} />
                                <p className={styles.validationText}>{validationMsg}</p>
                            </div>
                        )}


                        <div className={styles.BuyGoldChipList}>
                            {[100, 500, 1000, 5000].map((val) => (
                                <button
                                    key={val}
                                    className={styles.BuyGoldQuickChip}
                                    onClick={() => handleQuickSelect(val)}
                                >
                                    ₹{val}
                                </button>
                            ))}
                        </div>


                        <div className={styles.BuyGoldCouponBox}>
                            <div className={styles.BuyGoldCouponLabelGroup}>
                                <div className={styles.BuyGoldPercentIcon}>%</div>
                                <span className={styles.BuyGoldCouponTitle}>Use coupon</span>
                            </div>
                            <span className={styles.BuyGoldComingSoonTag}>Coming Soon</span>
                        </div>
                    </div>


                    <div className={styles.BuyGoldActionFooter}>
                        <p className={styles.BuyGoldLivePriceText}>
                            {loadingLivePrice
                                ? 'Fetching live price...'
                                : `LIVE Buy price ₹${livePrice}/gm + 3% GST`}
                        </p>
                        <button
                            className={styles.BuyGoldSubmitButton}
                            onClick={createGoldOrders}
                            disabled={isProcessing || !isValidAmount || livePrice === 0}
                            style={{
                                opacity: isProcessing || !isValidAmount || livePrice === 0 ? 0.6 : 1,
                                cursor: isProcessing || !isValidAmount || livePrice === 0 ? "not-allowed" : "pointer"
                            }}
                        >
                            {isProcessing ? "Processing..." : "Buy Gold"}
                        </button>
                        <p className={styles.BuyGoldTermsText}>
                            By continuing you agree to the <span className={styles.BuyGoldTermsLink}>terms and conditions.</span>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BuyGold;
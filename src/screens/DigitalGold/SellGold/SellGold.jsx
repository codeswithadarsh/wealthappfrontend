import React, { useState, useEffect, useRef } from 'react';
import styles from './SellGold.module.css';
import backFaq from '../../../assets/images/backIcon.svg';
import { initiateSellGold, sellGoldValidate, sellLivePrice } from '../../../services/apis/digitalGold.service';
import { postRequest, getRequest } from "../../../services/apiClient"
import SellGoldStatusModal from './SellGoldStatusModal';
import Select from 'react-select';
import { Info } from "lucide-react";

import { formatINR } from "../../../utils/currency";


const SellGold = ({
    isOpen,
    onClose,
    title = "Sell Gold",
    showBackButton = true,
    setStatusModalSell
}) => {
    const [amount, setAmount] = useState('');
    const [livePrice, setLivePrice] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const [validationMsg, setValidationMsg] = useState('');
    const [isValidAmount, setIsValidAmount] = useState(false);
    const debounceRef = useRef(null);


    useEffect(() => {
        if (!isOpen) {
            setAmount('');
            setIsProcessing(false);
            setValidationMsg('');
            setIsValidAmount(false);
        }
    }, [isOpen]);


    useEffect(() => {
        if (!isOpen) return;

        const fetchLivePrice = async () => {
            try {
                const response = await sellLivePrice();

                if (response.status === 1) {
                    setLivePrice(response?.sellPricePerGram || 0);
                    console.log("response?.sellPricePerGram", response?.sellPricePerGram)
                } else {
                    setLivePrice(0);
                }

            } catch (err) {
                setLivePrice(0);
            }
        };

        fetchLivePrice();
    }, [isOpen]);

    if (!isOpen) return null;




    const validateSellAmount = async (value) => {
        setValidationMsg('');
        setIsValidAmount(false);

        if (!value || Number(value) <= 0) return;

        try {
            const res = await sellGoldValidate({ amount: Number(value) });

            if (res?.status === 1) {
                setIsValidAmount(true);
                setValidationMsg(
                    `You will sell ${res?.gramsToSell} grams of gold for ₹${res?.enteredAmount}.`
                );
            } else {
                setIsValidAmount(false);
                setValidationMsg(
                    `${res?.message}. Available balance: ₹${res?.availableGoldInRupees}.`
                );
            }
        } catch (err) {
            setIsValidAmount(false);
            setValidationMsg('Unable to validate amount. Please try again.');
        }
    };


    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmount(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            validateSellAmount(value);
        }, 500);
    };

    const handleQuickSelect = (val) => {
        setAmount(val.toString());
        validateSellAmount(val);
    };


    const handleSellGold = async () => {
        if (!isValidAmount || isProcessing) return;

        setIsProcessing(true);

        try {
            const res = await initiateSellGold({ amount: Number(amount) });

            if (res?.status === 1) {
                setStatusModalSell({
                    open: true,
                    type: "success",
                    details: {
                        amountCredited: res?.amountCredited,
                        goldSoldInGrams: res?.goldSoldInGrams,
                        sellPricePerGram: res?.sellPricePerGram,
                        transactionDate: res?.transactionDate,
                        walletBalance: res.walletBalance,
                        goldBalance: res?.goldBalance
                    }
                });

                onClose();
            }
            else {
                setStatusModalSell({
                    open: true,
                    type: "error",
                    details: {
                        message: res.message || "Sell transaction failed"
                    }
                });
            }
        } catch {
            setStatusModalSell({
                open: true,
                type: "error",
                details: {
                    message: "Sell transaction failed"
                }
            });
        } finally {
            setIsProcessing(false);
        }
    };




    const resetForm = () => {
        setIsProcessing(false);
        setAmount('');
        onClose();
    }


    const bankOptions = [
        { value: 12, label: 'State Bank of India' },
        { value: 13, label: 'HDFC Bank' },
    ]


    return (
        <div className={`${styles.SellGoldmodalOverlay} ${isOpen ? styles.open : ''}`}>
            <div className={styles.SellGoldmodalmodalContainer}>

                <div className={styles.SellGoldmodalmodalHeader}>
                    {showBackButton && (
                        <div className={styles.SellGoldmodalcomponent1Parent}>
                            <img
                                className={styles.SellGoldmodalcomponent1Icon5}
                                alt="Back"
                                src={backFaq}
                                onClick={onClose}
                                style={{ cursor: 'pointer' }}
                            />
                            <div className={styles.SellGoldHeaderTitleWrapper}>
                                <b className={styles.SellGoldmodalfaqsheading}>{title}</b>
                                <span className={styles.SellGoldSubHeaderText}>24K | 99.94% Pure Gold</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.SellGoldMainContentScroll}>
                    <div className={styles.SellGoldInnerBody}>

                        <div className={styles.SellGoldInputSection}>
                            <div className={styles.SellGoldInputContainer}>
                                <span className={styles.SellGoldRupeeSign}>₹</span>
                                <input
                                    type="tel"
                                    className={styles.SellGoldMainInput}
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



                        <div className={styles.SellGoldChipList}>
                            {[100, 500, 1000, 5000].map((val) => (
                                <button
                                    key={val}
                                    className={styles.SellGoldQuickChip}
                                    onClick={() => handleQuickSelect(val)}
                                >
                                    ₹{val}
                                </button>
                            ))}
                        </div>



                        {/* <div className={styles.SellGoldBankSelection}>
                            <Select options={bankOptions} />
                        </div> */}
                    </div>


                    <div className={styles.SellGoldActionFooter}>
                        <p className={styles.SellGoldLivePriceText}>
                            LIVE Sell price ₹{formatINR(livePrice)}/gm
                        </p>
                        <button
                            className={styles.SellGoldSubmitButton}
                            disabled={isProcessing || livePrice === 0 || !isValidAmount}
                            style={{
                                opacity: isProcessing || livePrice === 0 || !isValidAmount ? 0.6 : 1,
                                cursor: isProcessing || livePrice === 0 || !isValidAmount ? "not-allowed" : "pointer"
                            }}
                            onClick={handleSellGold}
                        >

                            {isProcessing ? "Processing..." : "Sell Gold"}
                        </button>
                        <p className={styles.SellGoldTermsText}>
                            By continuing you agree to the <span className={styles.SellGoldTermsLink}>terms and conditions.</span>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SellGold;
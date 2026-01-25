import React from "react";
import { Modal, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from "framer-motion";
import { formatINR } from "../../../utils/currency";

const SellGoldStatusModal = ({ isOpen, status, details, onClose }) => {
    const isSuccess = status === "success";

    const formattedDate = new Date(details.transactionDate).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });


    return (
        <Modal
            show={isOpen}
            onHide={onClose}
            centered
            backdrop="static"
            keyboard={false}
            style={{ zIndex: 99999999 }}
        >
            <Modal.Body style={{ textAlign: "center", padding: "32px" }}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: isSuccess ? "#4BB543" : "#FF4D4D",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        boxShadow: isSuccess
                            ? "0 10px 20px rgba(75, 181, 67, 0.2)"
                            : "0 10px 20px rgba(255, 77, 77, 0.2)"
                    }}
                >
                    {isSuccess ? (
                        <motion.svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </motion.svg>
                    ) : (
                        <motion.svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </motion.svg>
                    )}
                </motion.div>

                <h5 style={{ fontWeight: 700, marginBottom: 8 }}>
                    {isSuccess ? "Gold Sold Successfully" : "Sell Failed"}
                </h5>

                {isSuccess && (
                    <p style={{ fontSize: 13, color: "#666", marginBottom: 20 }}>
                        {formattedDate}
                    </p>
                )}

                {isSuccess && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                            padding: "14px 16px",
                            backgroundColor: "#f5faff",
                            borderRadius: 10,
                            border: "1px solid #dbeafe",
                            marginBottom: 24
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 13,
                                    color: "#6b7280",
                                    fontWeight: 500
                                }}
                            >
                                Amount Credited
                            </span>
                            <span
                                style={{
                                    fontSize: 14,
                                    color: "#0f172a",
                                    fontWeight: 700
                                }}
                            >
                                ₹{formatINR(details.amountCredited)}
                            </span>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 13,
                                    color: "#6b7280",
                                    fontWeight: 500
                                }}
                            >
                                Gold Sold
                            </span>
                            <span
                                style={{
                                    fontSize: 14,
                                    color: "#0f172a",
                                    fontWeight: 700
                                }}
                            >
                                {details.goldSoldInGrams} gm
                            </span>
                        </div>
                    </div>
                )}



                <Button
                    onClick={onClose}
                    style={{
                        width: "100%",
                        backgroundColor: "#1565c0",
                        border: "none",
                        borderRadius: 30,
                        padding: "12px 0",
                        fontWeight: 700
                    }}
                >
                    Done
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default SellGoldStatusModal;

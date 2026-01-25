import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import styles from "./MobileOrders.module.css";
import { getGoldOrders } from "../../../services/apis/digitalGold.service";
import LoadingDots from "../../../components/LoadingDots/LoadingDots";
import { useNavigate } from "react-router-dom";
import { formatINR } from "../../../utils/currency";
import Navbar from "../../../components/Navbar/Navbar";

const GoldOrderMobileSkeleton = () => {
  return Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className={styles.GoldOrderMobileSkeletonCard}>
      <div className={styles.GoldOrderMobileSkeletonIcon} />

      <div className={styles.GoldOrderMobileSkeletonDetails}>
        <div className={styles.GoldOrderMobileSkeletonRow}>
          <div className={styles.GoldOrderMobileSkeletonLineSm} />
          <div className={styles.GoldOrderMobileSkeletonLineMd} />
        </div>

        <div className={styles.GoldOrderMobileSkeletonSubRow}>
          <div className={styles.GoldOrderMobileSkeletonLineXs} />
          <div className={styles.GoldOrderMobileSkeletonLineXs} />
        </div>
      </div>
    </div>
  ));
};

const MobileOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await getGoldOrders();
      if (res.status === 1) {
        setOrders(res.orders || []);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  return (
    <>
    <Navbar />
    <div className={styles.GoldOrderMobileContainer}>
      <header className={styles.GoldOrderMobileHeader}>
        <ArrowLeft size={20} onClick={() => navigate(-1)} />
        <h2>Order history</h2>
      </header>

      <div className={styles.GoldOrderMobileContent}>
        {loading ? (
          <div className={styles.GoldOrderMobileLoading}>
            <GoldOrderMobileSkeleton />
          </div>
        ) : orders.length === 0 ? (
          <div className={styles.GoldOrderMobileEmpty}>
            No orders found
          </div>
        ) : (
          orders.map((order, idx) => {
            const isBuy = order.orderType === "BUY";
            return (
              <div key={idx} className={styles.GoldOrderMobileCard}>
                <div
                  className={`${styles.GoldOrderMobileIconBox} ${
                    isBuy
                      ? styles.GoldOrderMobileBuy
                      : styles.GoldOrderMobileSell
                  }`}
                >
                  {isBuy ? (
                    <ArrowDownLeft size={18} />
                  ) : (
                    <ArrowUpRight size={18} />
                  )}
                </div>

                <div className={styles.GoldOrderMobileDetails}>
                  <div className={styles.GoldOrderMobileRow}>
                    <span className={styles.GoldOrderMobileType}>
                      {isBuy ? "Bought Gold" : "Sold Gold"}
                    </span>
                    <span className={styles.GoldOrderMobileAmount}>
                      {formatINR(order.amountInRupees)}
                    </span>
                  </div>

                  <div className={styles.GoldOrderMobileSubRow}>
                    <span>{order.goldInGrams} gm</span>
                    <span>{formatDate(order.transactionDate)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>

    </>
  );
};

export default MobileOrders;

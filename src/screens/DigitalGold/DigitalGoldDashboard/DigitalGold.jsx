import React, { useState, useEffect } from 'react';
import { MoveLeft, Calendar, Coins, Play, CircleStar, ChevronRight, CheckCircle2, Clock, ArrowLeft, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import styles from './DigitalGold.module.css';
import Navbar from '../../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import BuyGold from '../BuyGold/BuyGold';
import BuyGoldStatusModal from '../BuyGold/BuyGoldStatusModal';
import backIcon from '../../../assets/images/backIcon.svg';
import SellGold from '../SellGold/SellGold';
import SellGoldStatusModal from '../SellGold/SellGoldStatusModal';
import { fetchGoldInvestedSummary, getGoldOrders, goldLivePrice } from '../../../services/apis/digitalGold.service';
import { formatINR } from '../../../utils/currency';
import CountUp from 'react-countup';
import LoadingDots from '../../../components/LoadingDots/LoadingDots';
import useDeviceCheck from '../../../utils/useDeviceCheck'
import DesktopOrderSkeleton from '../../../components/SkeletonLoading/GoldOrdersSkeleton/DesktopOrderSkeleton';

const DigitalGold = () => {
  const { isMobileUtils, isDesktopUtils } = useDeviceCheck();
  const navigate = useNavigate();
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [showBuyGoldModal, setBuyGoldModal] = useState(false);
  const [showSellGoldModal, setSellGoldModal] = useState(false);
  const [livePrice, setLivePrice] = useState(0);
  const [loadingLivePrice, setLoadingLivePrice] = useState(false);
  const [loadingInvestedSummary, setLoadingInvestedSummary] = useState(false);
  const [summaryError, setSummaryError] = useState(true);
  const [statusModal, setStatusModal] = useState({
    open: false,
    type: '',
    details: {}
  });

  const [statusModalSell, setStatusModalSell] = useState({
    open: false,
    type: '',
    details: {}
  });

  const [goldInvestedSummary, setGoldInvestedSummary] = useState({
    totalInvestedAmount: null,
    totalGrams: null
  });

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);



  const getGoldInvestedSummary = async () => {
    setLoadingInvestedSummary(true);
    setSummaryError(false);

    try {
      const res = await fetchGoldInvestedSummary();
      if (res?.status === 1) {
        setGoldInvestedSummary({
          totalInvestedAmount: res?.totalInvestedAmount || 0,
          totalGrams: res?.totalGoldInGrams || 0
        });
      } else {
        setGoldInvestedSummary({
          totalInvestedAmount: 0,
          totalGrams: 0
        });
        setSummaryError(true);
      }
    } catch (err) {
      console.error("Error fetching gold summary:", err);
      setGoldInvestedSummary({
        totalInvestedAmount: 0,
        totalGrams: 0
      });
      setSummaryError(true);
    } finally {
      setLoadingInvestedSummary(false)
    }
  };

  const fetchLivePrice = async () => {
    setLoadingLivePrice(true);

    try {
      const response = await goldLivePrice();

      if (response.status === 1) {
        setLivePrice(response?.pricePerGram || 0);
      } else {
        setLivePrice(0);
      }

    } catch (err) {
      setLivePrice(0);
    } finally {
      setLoadingLivePrice(false);
    }
  };

  useEffect(() => {
    getGoldInvestedSummary();
    fetchLivePrice();
  }, []);


  const fetchDesktopGoldOrders = async () => {
    setOrdersLoading(true);
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
      setOrdersLoading(false);
    }
  };


  useEffect(() => {
    if (isDesktopUtils) {
      fetchDesktopGoldOrders();
    }
  }, [isDesktopUtils]);


  const getCountUpStart = (value) => {
    if (typeof value !== "number") return 0;
    return Math.floor(value / 1000) * 1000;
  };

  const getGramsStart = (value) => {
    if (typeof value !== "number" || value <= 0) return 0;
    return Number((value - 0.01).toFixed(4));
  };

  const refreshAfterTransaction = () => {
    getGoldInvestedSummary();
    if (isDesktopUtils) {
      fetchDesktopGoldOrders();
    }
  };

  const formatOrderDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  const getOrderMeta = (order) =>
    `${order.orderType === "BUY" ? "Bought" : "Sold"}`;


  const goldVideos = [
    {
      id: 1,
      title: "Investment Tips: How to Invest in Digital Gold?",
      youtubeId: "ia35C5WhFNk",
      duration: "6:02"
    },
    {
      id: 2,
      title: "Digital Gold vs Physical Gold | What is Digital Gold",
      youtubeId: "OS2NfDMTpeM",
      duration: "10:55"
    }
  ];

  return (
    <>
      <Navbar />

      <div className={styles.DigitalGoldDashboardContainer}>
        {/* Header */}
        <header className={styles.DigitalGoldDashboardHeader}>
          <div className={styles.DigitalGoldDashboardTitleGroup} onClick={() => navigate("/dashboard")}>
            <img src={backIcon} alt="back" className={styles.DigitalGoldDashboardBackIcon} />
            <h2 className={styles.DigitalGoldDashboardMainTitle}>Digital gold</h2>
          </div>
          <div className={styles.DigitalGoldDashboardLivePriceBadge}>
            <div className={styles.DigitalGoldDashboardLiveIndicator}>
              <span className={styles.DigitalGoldDashboardPulseDot}></span>
              <span className={styles.DigitalGoldDashboardLiveText}>Live Price:</span>
            </div>
            <span className={styles.DigitalGoldDashboardPriceValue}>
              {loadingLivePrice ? (
                <LoadingDots />
              ) : (
                `${formatINR(livePrice)}/gm`
              )}
            </span>

          </div>
        </header>

        <main className={styles.DigitalGoldDashboardMain}>
          <div className={styles.DigitalGoldDashboardContentLeft}>

            {/* Savings Card */}
            <section className={styles.DigitalGoldDashboardSavingsCard}>
              <div className={styles.DigitalGoldDashboardSavingsTop}>
                <div className={styles.DigitalGoldDashboardSavingsText}>
                  <p className={styles.DigitalGoldDashboardLabel}>Your savings</p>
                  {summaryError ? (
                    <div className={styles.DigitalGoldDashboardErrorContainer}>
                      <p className={styles.DigitalGoldDashboardErrorText}>Failed to load savings</p>
                      <button
                        className={styles.DigitalGoldDashboardRetryBtn}
                        onClick={getGoldInvestedSummary}
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <>
                      <h1 className={styles.DigitalGoldDashboardBalance}>
                        {loadingInvestedSummary ? (
                          <LoadingDots />
                        ) : (
                          <CountUp
                            start={getCountUpStart(goldInvestedSummary.totalInvestedAmount || 0)}
                            end={goldInvestedSummary.totalInvestedAmount || 0}
                            duration={1.4}
                            separator=","
                            prefix="₹"
                          />
                        )}
                      </h1>
                      {/* <p className={styles.DigitalGoldDashboardWeight}>{goldInvestedSummary.totalGrams} grams</p> */}
                      <p className={styles.DigitalGoldDashboardWeight}>
                        {loadingInvestedSummary ? (
                          <LoadingDots />
                        ) : (
                          <CountUp
                            start={getGramsStart(goldInvestedSummary.totalGrams || 0)}
                            end={goldInvestedSummary.totalGrams || 0}
                            decimals={4}
                            duration={1.2}
                          />

                        )} grams
                      </p>
                    </>
                  )}
                </div>
                <div className={styles.DigitalGoldDashboardSavingsIcon}>
                  <CircleStar size={36} color="#FFD700" fill="#FFD700" fillOpacity={0.3} />
                </div>
              </div>

              <div className={styles.DigitalGoldDashboardSavingsBottom}>
                <a href="#" className={styles.DigitalGoldDashboardViewDetail}>
                  View Detail <ChevronRight size={14} />
                </a>
                <div className={styles.DigitalGoldDashboardSavingsActions}>
                  <button className={styles.DigitalGoldDashboardBtnWithdraw} onClick={() => setSellGoldModal(true)}>Withdraw</button>
                  <button className={styles.DigitalGoldDashboardBtnBuy} onClick={() => setBuyGoldModal(true)}>Buy More</button>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <div className={styles.DigitalGoldDashboardQuickActions}>
              <div className={styles.DigitalGoldDashboardActionBox}>
                <div className={styles.DigitalGoldDashboardIconWrapper}>
                  <Calendar size={18} color="#1565c0" />
                </div>
                <div className={styles.DigitalGoldDashboardActionText}>
                  <h4>Setup monthly SIP</h4>
                  <p>Start your monthly savings now.</p>
                </div>
              </div>

              <div className={`${styles.DigitalGoldDashboardActionBox} ${styles.DigitalGoldDashboardActionDisabled}`}>
                <span className={styles.DigitalGoldDashboardComingSoonBadge}>Coming Soon</span>
                <div className={styles.DigitalGoldDashboardIconWrapper}>
                  <Coins size={18} color="#9e9e9e" />
                </div>
                <div className={styles.DigitalGoldDashboardActionText}>
                  <h4>Lease Gold</h4>
                  <p>Earn yield in form of gold.</p>
                </div>
              </div>
            </div>

            {/* Blogs & Videos */}
            <section className={styles.DigitalGoldDashboardBlogs}>
              <div className={styles.DigitalGoldDashboardSectionHeader}>
                <h3>Blogs & Videos</h3>
                <a href="#" className={styles.DigitalGoldDashboardLink}>View All</a>
              </div>
              <div className={styles.DigitalGoldDashboardVideoGrid}>
                {goldVideos.map((video) => (
                  <div key={video.id} className={styles.DigitalGoldDashboardVideoCard}>
                    <div className={styles.DigitalGoldDashboardVideoThumb}>
                      {activeVideoId === video.id ? (
                        /* The Video Player */
                        <iframe
                          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                          title={video.title}
                          className={styles.DigitalGoldDashboardInlinePlayer}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <>
                          <img
                            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                            alt={video.title}
                            className={styles.DigitalGoldDashboardThumbImage}
                          />
                          <div
                            className={styles.DigitalGoldDashboardPlayOverlay}
                            onClick={() => setActiveVideoId(video.id)}
                          >
                            <div className={styles.DigitalGoldDashboardPlayCircle}>
                              <Play size={14} fill="white" color="white" />
                            </div>
                          </div>
                          <span className={styles.DigitalGoldDashboardDuration}>{video.duration}</span>
                        </>
                      )}
                    </div>

                    <div className={styles.DigitalGoldDashboardVideoContent}>
                      <p className={styles.DigitalGoldDashboardVideoTitle}>{video.title}</p>
                      <div className={styles.DigitalGoldDashboardAuthor}>
                        <div className={styles.DigitalGoldDashboardAvatar}>F</div>
                        <span>MakeWealth</span>
                        {activeVideoId === video.id && (
                          <span
                            className={styles.DigitalGoldDashboardStopVideo}
                            onClick={() => setActiveVideoId(null)}
                          >
                            Stop Video
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>


          <aside className={styles.DigitalGoldDashboardOrderSidebar}>
            <div className={styles.DigitalGoldDashboardSectionHeader}>
              <h3>Order history</h3>
            </div>

            <div className={styles.DigitalGoldDashboardOrderList}>
              {ordersLoading ? (
                <DesktopOrderSkeleton count={10} />
              ) : orders.length === 0 ? (
                <div className={styles.DigitalGoldDashboardEmptyState}>
                  No orders found
                </div>
              ) : (
                orders.map((order, idx) => (
                  <div key={idx} className={styles.DigitalGoldDashboardOrderItem}>
                    <div className={styles.DigitalGoldDashboardOrderIconBox}>
                      {order.orderType === "BUY" ? (
                        <ArrowDownLeft size={16} color="#2e7d32" />
                      ) : (
                        <ArrowUpRight size={16} color="#ed6c02" />
                      )}
                    </div>

                    <div className={styles.DigitalGoldDashboardOrderDetails}>
                      <p className={styles.DigitalGoldDashboardOrderType}>
                        {getOrderMeta(order)}
                      </p>
                      <p className={styles.DigitalGoldDashboardOrderMeta}>
                        {formatOrderDate(order.transactionDate)}
                      </p>
                    </div>

                    <div className={styles.DigitalGoldDashboardOrderValue}>
                      <p className={styles.DigitalGoldDashboardAmount}>
                        ₹ {order.amountInRupees.toLocaleString("en-IN")}
                      </p>
                      <p className={styles.DigitalGoldDashboardWeightSub}>
                        {order.goldInGrams} gm
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

        </main>
      </div>


      <BuyGold
        isOpen={showBuyGoldModal}
        onClose={() => {
          setBuyGoldModal(false);
          refreshAfterTransaction();
        }}
        title="Buy Gold"
        setStatusModal={setStatusModal}
      />

      <SellGold
        isOpen={showSellGoldModal}
        onClose={() => {
          setSellGoldModal(false);
          refreshAfterTransaction();
        }}
        title="Sell Gold"
        setStatusModalSell={setStatusModalSell}
      />

      <BuyGoldStatusModal
        isOpen={statusModal.open}
        status={statusModal.type}
        details={statusModal.details}
        onClose={() =>
          setStatusModal({ ...statusModal, open: false })
        }
      />

      <SellGoldStatusModal
        isOpen={statusModalSell.open}
        status={statusModalSell.type}
        details={statusModalSell.details}
        onClose={() =>
          setStatusModalSell({ ...statusModalSell, open: false })
        }
      />

    </>
  );
};

export default DigitalGold;
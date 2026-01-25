import React, { useEffect, useState } from 'react';
import {
    MoveLeft,
    TrendingUp,
    ChevronRight,
    Sparkles,
    Calculator,
    Zap,
    ShieldCheck,
    Info,
    PieChart,
    ArrowRight,
    TrendingDown
} from 'lucide-react';
import styles from './Dashboard.module.css';
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { setAuthFromLogin } from '../../store/auth/auth.slice';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile } from '../../store/auth/auth.thunks';
import { selectProfileLoaded, selectUserName } from "../../store/auth/auth.selectors";
import { fetchDashboardAllAssets } from '../../services/apis/dashboard.service';
import { formatINR } from "../../utils/currency";
import CountUp from 'react-countup';
import LoadingDots from '../../components/LoadingDots/LoadingDots';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const profileLoaded = useSelector(selectProfileLoaded);
    const userName = useSelector(selectUserName)

    const [dashboardData, setDashboardData] = useState(null);
    const [loadingDashboard, setLoadingDashboard] = useState(false);


    useEffect(() => {
        if (!profileLoaded) {
            dispatch(fetchUserProfile());
        }
    }, [profileLoaded, dispatch]);


    useEffect(() => {
        const fetchDashboardAssets = async () => {
            setLoadingDashboard(true);

            try {
                const res = await fetchDashboardAllAssets();

                console.log("dashboardDatares", res)
                if (res.status === 1) {
                    setDashboardData(res);
                } else {
                    setDashboardData(null);
                }
            } catch {
                setDashboardData(null);
            } finally {
                setLoadingDashboard(false);
            }
        };

        fetchDashboardAssets();
    }, []);

    const totalInvested = dashboardData?.totalInvestedAmt || 0;
    const totalCurrentValue = dashboardData?.totalCurrentValue || 0;
    const totalGain = dashboardData?.totalGainInNum || 0;
    const profitLossPercent = dashboardData?.totalProfitLossPercent || 0;

    const assetDist = dashboardData?.assetsDistribution || {};




    const products = [
        { name: 'Digital Gold', icon: '📀', status: 'active', color: '#FFD700', link: '/digitalGold' },
        { name: 'NPS', icon: '🏛️', status: 'active', color: '#1565C0' },
        { name: 'Mutual Funds', icon: '📈', status: 'coming', color: '#4CAF50' },
        { name: 'Stocks', icon: '📊', status: 'coming', color: '#9C27B0' },
        { name: 'Fixed Deposit', icon: '🔒', status: 'coming', color: '#FF5722' },
    ];

    return (
        <>
            <Navbar />
            <div className={styles.DashboardMainContainer}>
                <header className={styles.DashboardHeader}>
                    <div className={styles.DashboardHeaderLeft}>
                        {/* <MoveLeft size={18} /> */}
                        <h1 className={styles.DashboardPageTitle}>Hi {userName}</h1>
                    </div>
                    <div className={styles.DashboardSupportIcon}>
                        <Info size={16} color="#64748b" />
                    </div>
                </header>

                <main className={styles.DashboardMainGrid}>
                    {/* Left Column: Portfolio, Promo, and Products */}
                    <div className={styles.DashboardLeftCol}>

                        <section className={styles.DashboardPortfolioCard}>
                            <div className={styles.DashboardPortfolioTop}>
                                <div className={styles.DashboardBalanceInfo}>
                                    <span className={styles.DashboardLabel}>Current Value</span>
                                    <h2 className={styles.DashboardMainBalance}>{loadingDashboard ? <LoadingDots /> : formatINR(totalCurrentValue)}</h2>
                                </div>
                                <div className={styles.DashboardGainPill}>
                                    {profitLossPercent < 0 ? (
                                        <TrendingDown size={12} />
                                    ) : (
                                        <TrendingUp size={12} />
                                    )} {profitLossPercent}%
                                </div>
                            </div>
                            <div className={styles.DashboardPortfolioDivider}></div>
                            <div className={styles.DashboardPortfolioStats}>
                                <div className={styles.DashboardStatItem}>
                                    <span className={styles.DashboardLabel}>Invested</span>
                                    <p className={styles.DashboardStatValue}>{loadingDashboard ? <LoadingDots /> : formatINR(totalInvested)}</p>
                                </div>
                                <div className={styles.DashboardStatItem}>
                                    <span className={styles.DashboardLabel}>Total Gain</span>
                                    <p
                                        className={`${styles.DashboardStatValue} ${totalGain < 0
                                                ? styles.DashboardRedTexttotalGain
                                                : styles.DashboardGreenTexttotalGain
                                            }`}
                                    >
                                        {loadingDashboard ? <LoadingDots /> : formatINR(totalGain)}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className={styles.DashboardPromoBanner}>
                            <div className={styles.DashboardPromoContent}>
                                <div className={styles.DashboardPromoBadge}>
                                    <Sparkles size={10} /> INVEST IN GOLD
                                </div>
                                <h3 className={styles.DashboardPromoTitle}>Build your gold nest egg</h3>
                                <p className={styles.DashboardPromoText}>Start saving in 24K Pure Gold from just ₹10.</p>
                                <button className={styles.DashboardPromoAction} onClick={() => navigate("/digitalGold")}>Get Started</button>
                            </div>
                            <div className={styles.DashboardPromoIcon}>📀</div>
                        </div>

                        <div className={styles.DashboardSectionHeader}>
                            <h4 className={styles.DashboardSectionTitle}>Investment Products</h4>
                        </div>
                        <div className={styles.DashboardProductGrid}>
                            {products.map((item, idx) => (
                                <div key={idx} className={`${styles.DashboardProductItem} ${item.status === 'coming' ? styles.DashboardProductSoon : ''}`} onClick={() => navigate(item.link)}>
                                    {item.status === 'coming' && <span className={styles.DashboardMiniBadge}>Soon</span>}
                                    <div className={styles.DashboardIconBox} style={{ backgroundColor: `${item.color}15` }}>
                                        <span>{item.icon}</span>
                                    </div>
                                    <p className={styles.DashboardProductName}>{item.name}</p>
                                    <ChevronRight size={14} className={styles.DashboardArrowIcon} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Calculators, Distribution, and Trust */}
                    <div className={styles.DashboardRightCol}>

                        <div className={styles.DashboardSectionHeader}>
                            <h4 className={styles.DashboardSectionTitle}>Asset Distribution</h4>
                        </div>
                        <div className={styles.DashboardDistributionCard}>
                            <div className={styles.DashboardDistRow}>
                                <span className={styles.DashboardDistDot} style={{ background: '#FFD700' }}></span>
                                <p>Digital Gold</p>
                                <span className={styles.DashboardDistPercent}>{loadingDashboard ? <LoadingDots /> : assetDist?.digitalGold}%</span>
                            </div>
                            <div className={styles.DashboardDistRow}>
                                <span className={styles.DashboardDistDot} style={{ background: '#1565C0' }}></span>
                                <p>Fixed Deposit</p>
                                <span className={styles.DashboardDistPercent}>{loadingDashboard ? <LoadingDots /> : assetDist?.fd}%</span>
                            </div>
                            <div className={styles.DashboardDistRow}>
                                <span className={styles.DashboardDistDot} style={{ background: '#058e0f' }}></span>
                                <p>Mutual Fund</p>
                                <span className={styles.DashboardDistPercent}>{loadingDashboard ? <LoadingDots /> : assetDist?.mutualFund}%</span>
                            </div>
                        </div>

                        <div className={styles.DashboardSectionHeader}>
                            <h4 className={styles.DashboardSectionTitle}>Calculators</h4>
                        </div>
                        <div className={styles.DashboardToolList}>
                            <div className={styles.DashboardToolCard}>
                                <div className={styles.DashboardToolIcon}><Calculator size={16} /></div>
                                <div className={styles.DashboardToolText}>
                                    <p>SIP Calculator</p>
                                    <span>Goal planning</span>
                                </div>
                            </div>
                            <div className={styles.DashboardToolCard}>
                                <div className={styles.DashboardToolIcon}><Zap size={16} /></div>
                                <div className={styles.DashboardToolText}>
                                    <p>Lumpsum Calculator</p>
                                    <span>Lumpsum Goal planning</span>
                                </div>
                            </div>

                            <div className={styles.DashboardToolCard}>
                                <div className={styles.DashboardToolIcon}><Zap size={16} /></div>
                                <div className={styles.DashboardToolText}>
                                    <p>StepUp Calculator</p>
                                    <span>Add StepUp in investments</span>
                                </div>
                            </div>

                            <div className={styles.DashboardToolCard}>
                                <div className={styles.DashboardToolIcon}><Zap size={16} /></div>
                                <div className={styles.DashboardToolText}>
                                    <p>Tax Saver</p>
                                    <span>Check 80C</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.DashboardMarketInsight}>
                            <h4 className={styles.DashboardSectionTitle}>Market Updates</h4>
                            <div className={styles.DashboardNewsItem}>
                                <p>Gold rates hit a new 3-month high...</p>
                                <ArrowRight size={12} />
                            </div>
                        </div>

                        <div className={styles.DashboardTrustBox}>
                            <ShieldCheck size={16} color="#059669" />
                            <p>100% secure and insured.</p>
                        </div>
                    </div>
                </main>
            </div>

        </>
    );
};

export default Dashboard;
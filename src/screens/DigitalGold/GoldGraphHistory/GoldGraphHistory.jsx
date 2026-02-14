import React, { useState, useMemo, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import styles from './GoldGraphHistory.module.css';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Navbar from '../../../components/Navbar/Navbar';
import backIcon from '../../../assets/images/backIcon.svg';
import { useNavigate } from 'react-router-dom';
import { getGoldPricehistory } from '../../../services/apis/digitalGold.service';


const dummyApiData = {
    status: 1,
    latestPrice: 13401.26,
    change1D: 0,
    change7D: 3.3,
    change30D: 16.4,
    chart: [
        { price: 6200 },
        { date: "2025-12-17", price: 11601.35 },
        { date: "2025-12-18", price: 11580 },
        { date: "2025-12-19", price: 11638.44 },
        { date: "2025-12-22", price: 11860.46 },
        { date: "2025-12-23", price: 11962.4 },
        { date: "2025-12-24", price: 11956.53 },
        { date: "2025-12-26", price: 12085.95 },
        { date: "2025-12-29", price: 11541.57 },
        { date: "2025-12-30", price: 11661.66 },
        { date: "2025-12-31", price: 11542.91 },
        { date: "2026-01-02", price: 11513.02 },
        { date: "2026-01-05", price: 11839.91 },
        { date: "2026-01-06", price: 11960.8 },
        { date: "2026-01-07", price: 11873 },
        { date: "2026-01-08", price: 11874.07 },
        { date: "2026-01-09", price: 11982.41 },
        { date: "2026-01-12", price: 12286.62 },
        { date: "2026-01-13", price: 12246.33 },
        { date: "2026-01-14", price: 12345.33 },
        { date: "2026-01-15", price: 12318.64 },
        { date: "2026-01-16", price: 12244.19 },
        { date: "2026-01-20", price: 12701.04 },
        { date: "2026-01-21", price: 12893.71 },
        { date: "2026-01-22", price: 13099.18 },
        { date: "2026-01-23", price: 13279.04 },
        { date: "2026-01-26", price: 13555.23 },
        { date: "2026-01-27", price: 13555.76 },
        { date: "2026-01-28", price: 14147.37 },
        { date: "2026-01-29", price: 14192.2 },
        { date: "2026-01-30", price: 12579.09 },
        { date: "2026-02-02", price: 12335.19 },
        { date: "2026-02-03", price: 13085.57 },
        { date: "2026-02-04", price: 13130.14 },
        { date: "2026-02-05", price: 12972.69 },
        { date: "2026-02-06", price: 13212.33 },
        { date: "2026-02-09", price: 13478.38 },
        { date: "2026-02-10", price: 13352.69 },
        { date: "2026-02-11", price: 13533.62 },
        { date: "2026-02-12", price: 13138.94 },
        { date: "2026-02-13", price: 13401.26 }
    ]
};


const GoldGraphHistory = () => {
    const navigate = useNavigate();
    // const dataSource = apiData?.chart?.length ? apiData : dummyApiData;
    const [filter, setFilter] = useState('1W');

    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await getGoldPricehistory({});
                if (res?.status === 1) {
                    setApiData(res);
                } else {
                    console.warn('API returned no data or failed status', res);
                    setApiData({ latestPrice: 0, chart: [] });
                }
            } catch (error) {
                console.error('Error fetching gold price history:', error);
                setApiData({ latestPrice: 0, chart: [] }); 
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);


    const dataSource = apiData?.chart?.length ? apiData : { latestPrice: 0, chart: [] };



    const { filteredData, changeStats } = useMemo(() => {
        const data = dataSource.chart.filter(item => item.date);
        let result = [];

        switch (filter) {
            case '1W': result = data.slice(-7); break;
            case '2W': result = data.slice(-14); break;
            case '1M': result = data.slice(-30); break;
            case '2M': result = data.slice(-60); break;
            default: result = data;
        }

        let percentage = 0;
        let diff = 0;

        if (result.length > 1) {
            const startPrice = result[0].price;
            const currentPrice = result[result.length - 1].price;
            diff = currentPrice - startPrice;
            percentage = (diff / startPrice) * 100;
        }

        return {
            filteredData: result,
            changeStats: {
                percent: Math.abs(percentage).toFixed(1),
                diff: Math.abs(diff).toFixed(0),
                isPositive: diff >= 0
            }
        };
    }, [filter, dataSource.chart]);


    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { date, price } = payload[0].payload;

            const d = new Date(date);

            const day = d.getDate();
            const month = d.toLocaleString('en-GB', { month: 'short' });
            const year = d.getFullYear();

            const getSuffix = (n) => {
                if (n > 3 && n < 21) return 'th';
                switch (n % 10) {
                    case 1: return 'st';
                    case 2: return 'nd';
                    case 3: return 'rd';
                    default: return 'th';
                }
            };

            const formattedDate = `${day}${getSuffix(day)} ${month} ${year}`;

            return (
                <div className={styles.GoldGraphHistoryCustomTooltip}>
                    <span className={styles.GoldGraphHistoryTooltipText}>
                        ₹{price.toLocaleString('en-IN')}/gm on {formattedDate}
                    </span>
                </div>
            );
        }
        return null;
    };


    if (loading) {
        return (
            <>
                <Navbar />

                <div className={styles.GoldHistoryTitleGroup}>
                    <img
                        src={backIcon}
                        alt="back"
                        className={styles.GoldHistoryBackIcon}
                        onClick={() => navigate(-1)}
                    />
                    <h2 className={styles.GoldHistoryMainTitle}>Gold Price</h2>
                </div>

                <div className={styles.GoldHistoryMainSkeletonContainer}>
                    <div className={styles.GoldHistoryMainSkeletonPrice} />
                    <div className={styles.GoldHistoryMainSkeletonChart} />
                    <div className={styles.GoldHistoryMainSkeletonTabs}>
                        {Array(4).fill(0).map((_, i) => (
                            <div key={i} className={styles.GoldHistoryMainSkeletonTab} />
                        ))}
                    </div>
                </div>
            </>
        );
    }


    if (!dataSource.chart || dataSource.chart.length === 0) {
        return (
            <>
                <Navbar />
                <div
                    className={styles.GoldHistoryTitleGroup}
                >
                    <img
                        src={backIcon}
                        alt="back"
                        className={styles.GoldHistoryBackIcon}
                        onClick={() => navigate(-1)}
                    />
                    <h2 className={styles.GoldHistoryMainTitle}>Gold Price</h2>
                </div>

                <div className={styles.GoldHistoryMainNoDataContainer}>
                    <p className={styles.GoldHistoryMainNoDataText}>No Data Found</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div
                className={styles.GoldHistoryTitleGroup}
            >
                <img
                    src={backIcon}
                    alt="back"
                    className={styles.GoldHistoryBackIcon}
                    onClick={() => navigate(-1)}
                />
                <h2 className={styles.GoldHistoryMainTitle}>
                    Gold Price
                </h2>
            </div>

            <div className={styles.GoldGraphHistoryContainer}>
                <div className={styles.GoldGraphHistoryHeader}>
                    <div className={styles.GoldGraphHistoryPriceSub}>
                        Live Gold Price
                    </div>
                    <h2 className={styles.GoldGraphHistoryPriceT}>₹{dataSource.latestPrice.toLocaleString('en-IN')}/gm</h2>
                    <div className={styles.GoldGraphHistoryChangeRow}>
                        {changeStats.isPositive ? (
                            <TrendingUp size={16} color="#00c853" />
                        ) : (
                            <TrendingDown size={16} color="#ff3b30" />
                        )}

                        <span className={styles.GoldGraphHistoryChangeLabel}>
                            {filter} Change
                        </span>

                        <span
                            className={styles.GoldGraphHistoryChangeValue}
                            style={{ color: changeStats.isPositive ? '#00c853' : '#ff3b30' }}
                        >
                            {changeStats.percent}%
                        </span>
                    </div>


                </div>

                <div className={styles.GoldGraphHistoryChartWrapper}>
                    <ResponsiveContainer>
                        <AreaChart data={filteredData} margin={{ top: 10, right: 5, left: 5, bottom: 0 }}>
                            <defs>
                                <linearGradient id="goldWaterfallGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.7} />
                                    <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f0f0f0" />

                            <XAxis dataKey="date" hide />
                            <YAxis hide domain={['dataMin - 300', 'dataMax + 100']} />

                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ stroke: '#b9c7d6', strokeWidth: 1, strokeDasharray: '6 3' }}
                                useTranslate3d={true}
                                allowEscapeViewBox={{ x: false, y: true }}
                            />

                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#D4AF37"
                                strokeWidth={1.5}
                                fillOpacity={1}
                                fill="url(#goldWaterfallGradient)"
                                animationDuration={1000}
                                activeDot={{ r: 6, fill: '#6200ea', stroke: '#fff', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className={styles.GoldGraphHistoryTabs}>
                    {['1W', '2W', '1M', '2M'].map((tab) => (
                        <button
                            key={tab}
                            className={`${styles.GoldGraphHistoryTabBtn} ${filter === tab ? styles.GoldGraphHistoryTabActive : ''}`}
                            onClick={() => setFilter(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default GoldGraphHistory;
import React, { useState, useEffect } from 'react';

const LoadingDots = ({ speed = 500, className, style }) => {
    const [dots, setDots] = useState('.');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '.' : prev + '.');
        }, speed);
        return () => clearInterval(interval);
    }, [speed]);

    return <span className={className} style={style}>{dots}</span>;
};

export default LoadingDots;

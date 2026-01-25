import React from 'react';
import styles from './DesktopOrderSkeleton.module.css';

const DesktopOrderSkeleton = ({ count = 5 }) => {
  const skeletonItems = Array(count).fill(0);

  return (
    <div className={styles.DesktopOrderSkeletonContainer}>
      {skeletonItems.map((_, index) => (
        <div key={index} className={styles.DesktopOrderSkeletonItem}>
          {/* Icon Placeholder */}
          <div className={styles.DesktopOrderSkeletonIconBox} />

          {/* Text Details Placeholder */}
          <div className={styles.DesktopOrderSkeletonDetails}>
            <div className={styles.DesktopOrderSkeletonLineShort} />
            <div className={styles.DesktopOrderSkeletonLineTiny} />
          </div>

          {/* Value Placeholder */}
          <div className={styles.DesktopOrderSkeletonValue}>
            <div className={styles.DesktopOrderSkeletonLineShort} />
            <div className={styles.DesktopOrderSkeletonLineTiny} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DesktopOrderSkeleton;
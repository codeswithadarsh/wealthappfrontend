import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from './Profile.module.css';
import backIcon from '../../assets/images/backIcon.svg';
import Navbar from '../../components/Navbar/Navbar';
import { selectProfileLoaded, selectUserEmail, selectUserName, selectUserMobileNo } from "../../store/auth/auth.selectors";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import WalletBalance from './WalletBalance/WalletBalance';
import LoadingDots from '../../components/LoadingDots/LoadingDots';
import { fetchUserProfile } from '../../services/apis/profile.service';
import toast from 'react-hot-toast';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { formatINR } from '../../utils/currency';
import { APP_VERSION } from '../../config/appVersion';
import DeleteAccountModal from './DeleteAccountModal/DeleteAccountModal';


const Profile = () => {
    const navigate = useNavigate();
    const userName = useSelector(selectUserName)
    const userEmail = useSelector(selectUserEmail)
    const userMobileNo = useSelector(selectUserMobileNo)
    const [isEditing, setIsEditing] = useState(false);

    const [profileData, setProfileData] = useState(null);
    const [isFetchingProfile, setIsFetchingProfile] = useState(false);



    const [showWalletBalanceModal, setShowWalletBalanceModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const userData = {
        name: "Adarsh Pandey",
        mobile: "+91 9876543210",
        email: "adars@gmail.com",
        profileStatus: 0
    };

    useEffect(() => {
        const getProfile = async () => {
            setIsFetchingProfile(true);
            try {
                const res = await fetchUserProfile();
                if (res.status === 1) {
                    setProfileData(res);
                } else {
                    toast.error("Please try again")
                }
            } catch (e) {
                toast.error("Please try again")
            }
            finally {
                setIsFetchingProfile(false);
            }
        };
        getProfile();
    }, []);


    const customSelectStyles = {
        control: (base, state) => ({
            ...base,
            height: '50px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            boxShadow: state.isFocused ? '0 0 0 1px #1565c0' : 'none',
            '&:hover': { border: '1px solid #1565c0' }
        })
    };

    return (
        <>
            <Navbar />
            <div className={styles.profileWrapper}>
                {/* Top Navigation */}
                <header className={styles.profileNavbar}>
                    <div className={styles.profileNavContent}>
                        <div className={styles.profileHeaderLeft}>
                            <img src={backIcon} alt="Back" className={styles.profileBackBtn} onClick={() => navigate('/dashboard')} />
                            <h1 className={styles.profileNavTitle}>My Profile</h1>
                        </div>
                        {userData.profileStatus === 0 && !isEditing && (
                            <div className={styles.profileStatusTag}>
                                <span className={styles.profilePulse}></span> Incomplete
                            </div>
                        )}
                    </div>
                </header>

                <main className={styles.profileContent}>
                    {!isEditing ? (
                        <div className={styles.profileCard}>
                            <div className={styles.profileCardHeader}>
                                <div className={styles.profileUserInfo}>
                                    <div className={styles.profileAvatar}>{userName.charAt(0)}</div>
                                    <div>
                                        <h2 className={styles.profileNameTitle}>{userName}</h2>
                                        <p className={styles.profileUserEmail}>{userEmail}</p>
                                    </div>
                                </div>
                                {/* <button className={styles.profileEditActionBtn} onClick={() => setIsEditing(true)}>
                                    Complete Profile
                                </button> */}

                                <button
                                    className={styles.smallWalletBtn}
                                    onClick={() => setShowWalletBalanceModal(true)}
                                >
                                    <Wallet size={14} strokeWidth={2.5} className={styles.walletIcon} />
                                    <span className={styles.btnText}> {isFetchingProfile ? <LoadingDots /> : `Wallet: ${formatINR(profileData?.walletBalance)}`}</span>
                                </button>
                            </div>

                            <div className={styles.profileDetailsSection}>
                                <h3 className={styles.profileGroupHeading}>Basic Information</h3>

                                <div className={styles.profileDataRow}>
                                    <div className={styles.profileFieldGroup}>
                                        <label className={styles.profileLabel}>Full Name</label>
                                        <span className={styles.profileValue}>{userName}</span>
                                    </div>
                                    <div className={styles.profileFieldGroup}>
                                        <label className={styles.profileLabel}>Email Address</label>
                                        <span className={styles.profileValue}>{userEmail}</span>
                                    </div>
                                </div>

                                <div className={styles.profileDataRow}>
                                    <div className={styles.profileFieldGroup}>
                                        <label className={styles.profileLabel}>Mobile Number</label>
                                        <span className={styles.profileValue}>{userMobileNo}</span>
                                    </div>
                                    <div className={styles.profileFieldGroup}>
                                        <label className={styles.profileLabel}>Account Status</label>
                                        <span className={styles.profileValueBadge}>Verification Pending</span>
                                    </div>
                                </div>

                                <div className={styles.deleteSection} style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                    <button
                                        className={styles.deleteAccountTriggerBtn}
                                        style={{ color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                                        onClick={() => setShowDeleteModal(true)}
                                    >
                                        <Trash2 size={18} /> Delete Account
                                    </button>
                                </div>
                            </div>


                        </div>
                    ) : (
                        <div className={styles.profileCard}>
                            <div className={styles.profileFormHeader}>
                                <h2 className={styles.profileFormTitle}>Update Profile Details</h2>
                                <p className={styles.profileFormSub}>Please provide valid details as per your PAN card.</p>
                            </div>

                            <form className={styles.profileFormBody}>
                                <div className={styles.profileInputGrid}>
                                    <div className={styles.profileInputWrapper}>
                                        <label className={styles.profileInputLabel}>Gender</label>
                                        <Select
                                            options={[{ label: 'Male', value: 'M' }, { label: 'Female', value: 'F' }]}
                                            styles={customSelectStyles}
                                            placeholder="Select Gender"
                                        />
                                    </div>
                                    <div className={styles.profileInputWrapper}>
                                        <label className={styles.profileInputLabel}>Marital Status</label>
                                        <Select
                                            options={[{ label: 'Single', value: 'S' }, { label: 'Married', value: 'M' }]}
                                            styles={customSelectStyles}
                                            placeholder="Select Status"
                                        />
                                    </div>
                                    <div className={styles.profileInputWrapper}>
                                        <label className={styles.profileInputLabel}>Age</label>
                                        <input type="number" className={styles.profileInputField} placeholder="Enter your age" />
                                    </div>
                                    <div className={styles.profileInputWrapper}>
                                        <label className={styles.profileInputLabel}>PAN Number</label>
                                        <input type="text" className={styles.profileInputField} placeholder="ABCDE1234F" />
                                    </div>
                                </div>

                                <div className={styles.profileFormFooter}>
                                    <button type="button" className={styles.profileBtnSecondary} onClick={() => setIsEditing(false)}>Cancel</button>
                                    <button type="submit" className={styles.profileBtnPrimary}>Save Information</button>
                                </div>
                            </form>
                        </div>
                    )}
                </main>
            </div>

            <div className={styles.appVersion}>
                App Version {APP_VERSION}
            </div>


            <WalletBalance
                isOpen={showWalletBalanceModal}
                onClose={() => {
                    setShowWalletBalanceModal(false);
                }}
                title="Sell Gold"
            />

            <DeleteAccountModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
            // onDeleteConfirm={handleDeleteAccount}
            />

        </>
    );
};

export default Profile;
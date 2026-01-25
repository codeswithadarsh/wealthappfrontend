import { useState } from 'react';
import toast from 'react-hot-toast';
import styles from './UserLogin.module.css';
import { fetchUserExists, userLogin, userRegister } from '../../services/apis/login.service';
import loginDesk from "../../assets/images/login/d.jpg"
import { setAuthFromLogin } from '../../store/auth/auth.slice';
import { useDispatch } from 'react-redux';
import { fetchUserProfile } from '../../store/auth/auth.thunks';
import wealthLogo from "../../assets/images/logos/logo.png"
import { APP_VERSION } from '../../config/appVersion';


const UserLogin = () => {
  const dispatch = useDispatch();
  const navigateToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const [step, setStep] = useState('email'); // 'email', 'login', 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  // Handle email check
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetchUserExists({ emailId: email });

      console.log("email exits:", response.status)

      if (response?.status === 1) {
        setStep('login');
      } else if (response?.status === 0) {
        setStep('register');
      } else {
        toast.error("Please try again later")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error checking user');
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validatePassword(password)) {
      setErrors({ password: 'Password must be at least 6 characters' });
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await userLogin({ email, password });

      if (response?.status === 1) {
        toast.success('Login successful!');
        dispatch(
          setAuthFromLogin({
            authToken: response.token,
          })
        );

        setTimeout(() => {
          navigateToDashboard();
        }, 500);
      } else {
        toast.error(response?.message || 'Invalid credentials');
      }
    } catch (error) {
      toast.error(error?.response?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    if (!validateName(name)) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!validateMobile(mobileNo)) {
      newErrors.mobileNo = 'Mobile number must be 10 digits';
    }
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix all errors');
      return;
    }

    setLoading(true);
    try {
      const response = await userRegister({ name, mobileNo, email, password });

      if (response?.status === 1) {
        toast.success('Registration successful!');
        setStep('login');
      } else {
        toast.error(response?.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error?.response?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setPassword('');
    setName('');
    setMobileNo('');
    setErrors({});
  };

  return (
    <div className={styles.userLoginContainer}>
      <div className={styles.userLoginWrapper}>
        <div className={styles.userLoginCard}>
          <div className={styles.userLoginLeftSection}>
            <img
              // src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop"
              src={loginDesk}
              alt="Login"
              className={styles.userLoginLeftImage}
            />
          </div>

          <div className={styles.userLoginRightSection}>
            <div className={styles.mobileHeaderLogo}>
              <img
                src={wealthLogo}
                alt="Wealth Logo"
                className={styles.mobileLogo}
              />
            </div>
            <p className={styles.trustText}>
              Trusted for Digital Gold and Wealth Investment
              <span style={{ fontSize: '10px', marginLeft: '6px', color: '#94a3b8', fontWeight: 400 }}>
                v{APP_VERSION}
              </span>
            </p>
            <div className={styles.userLoginFormHeader}>
              <h2 className={styles.userLoginFormTitle}>
                {step === 'email' && 'Login'}
                {step === 'login' && 'Login'}
                {step === 'register' && 'Create Account'}
              </h2>
              <p className={styles.userLoginFormDescription}>
                {step === 'email' && 'Build wealth by investing in Digital Gold.'}
                {step === 'login' && 'Login to app and view your assets.'}
                {step === 'register' && 'Register with us to build your Portfolio.'}
              </p>
            </div>

            {/* Email Step */}
            {step === 'email' && (
              <div className={styles.userLoginForm}>
                <div className={styles.userLoginFormGroup}>
                  <label className={styles.userLoginLabel}>Email*</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${styles.userLoginInput} ${errors.email ? styles.userLoginInputError : ''}`}
                    placeholder="Enter your email address"
                    disabled={loading}
                    onKeyPress={(e) => e.key === 'Enter' && handleEmailSubmit(e)}
                  />
                  {errors.email && <span className={styles.userLoginErrorText}>{errors.email}</span>}
                </div>
                <button
                  type="button"
                  onClick={handleEmailSubmit}
                  className={styles.userLoginButton}
                  disabled={loading}
                >
                  {loading ? 'Checking...' : 'Sign In / Login'}
                </button>
              </div>
            )}

            {/* Login Step */}
            {step === 'login' && (
              <div className={styles.userLoginForm}>
                <div className={styles.userLoginFormGroup}>
                  <label className={styles.userLoginLabel}>Email*</label>
                  <input
                    type="email"
                    value={email}
                    className={styles.userLoginInput}
                    disabled
                  />
                </div>
                <div className={styles.userLoginFormGroup}>
                  <label className={styles.userLoginLabel}>Password*</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${styles.userLoginInput} ${errors.password ? styles.userLoginInputError : ''}`}
                    placeholder="Enter password"
                    disabled={loading}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                  />
                  {errors.password && <span className={styles.userLoginErrorText}>{errors.password}</span>}
                  <div className={styles.userLoginForgotPassword}>
                    <span className={styles.userLoginForgotText}>Forgot password?</span>
                    <a href="#" className={styles.userLoginResetLink}>Reset</a>
                  </div>
                </div>
                <div className={styles.userLoginButtonRow}>
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className={styles.userLoginBackButton}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleLogin}
                    className={styles.userLoginButton}
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </div>
            )}

            {/* Register Step */}
            {step === 'register' && (
              <div className={styles.userLoginForm}>
                <div className={styles.userLoginFormGroup}>
                  <label className={styles.userLoginLabel}>Full Name*</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`${styles.userLoginInput} ${errors.name ? styles.userLoginInputError : ''}`}
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                  {errors.name && <span className={styles.userLoginErrorText}>{errors.name}</span>}
                </div>
                <div className={styles.userLoginFormGroup}>
                  <label className={styles.userLoginLabel}>Mobile Number*</label>
                  <input
                    type="tel"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    className={`${styles.userLoginInput} ${errors.mobileNo ? styles.userLoginInputError : ''}`}
                    placeholder="Enter your 10-digit mobile number"
                    maxLength="10"
                    disabled={loading}
                  />
                  {errors.mobileNo && <span className={styles.userLoginErrorText}>{errors.mobileNo}</span>}
                </div>
                <div className={styles.userLoginFormGroup}>
                  <label className={styles.userLoginLabel}>Email*</label>
                  <input
                    type="email"
                    value={email}
                    className={styles.userLoginInput}
                    disabled
                  />
                </div>
                <div className={styles.userLoginFormGroup}>
                  <label className={styles.userLoginLabel}>Password*</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${styles.userLoginInput} ${errors.password ? styles.userLoginInputError : ''}`}
                    placeholder="Create a password (min 6 characters)"
                    disabled={loading}
                  />
                  {errors.password && <span className={styles.userLoginErrorText}>{errors.password}</span>}
                </div>
                <div className={styles.userLoginButtonRow}>
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className={styles.userLoginBackButton}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleRegister}
                    className={styles.userLoginButton}
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Confirm'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
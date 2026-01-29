import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import styles from './UserLogin.module.css';
import { fetchUserExists, forgotPassword, resetPassword, userLogin, userRegister } from '../../services/apis/login.service';
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

  const params = new URLSearchParams(window.location.search)
  const loginType = params.get('loginType')
  const isDemoUser = loginType === 'demoUser'

  // -----For Forget Password related Start -------------
  const [otp, setOtp] = useState(['', '', '', ''])
  const otpRefs = useRef([])

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [backendMessage, setBackendMessage] = useState('')

  // -----For Forget Password related End -------------


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

  const handleSendOtp = async () => {
    setLoading(true)
    setBackendMessage('')
    try {
      const res = await forgotPassword({ email })
      if (res?.status === 1) {
        setBackendMessage(res.message)
        setStep('reset')
      } else {
        setBackendMessage(res.message)
      }
    } catch (err) {
      setBackendMessage('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    setBackendMessage('')
    try {
      const res = await resetPassword({
        email,
        otp: otp.join(''),
        newPassword,
        confirmPassword
      })

      if (res?.status === 1) {
        toast.success(res.message)
        setPassword('')
        setOtp(['', '', '', ''])
        setNewPassword('')
        setConfirmPassword('')
        setStep('login')
      } else {
        setBackendMessage(res.message)
      }
    } catch (err) {
      setBackendMessage('Reset failed')
    } finally {
      setLoading(false)
    }
  }



  const handleBackToEmail = () => {
    setStep('email');
    setPassword('');
    setName('');
    setMobileNo('');
    setErrors({});
    setOtp(['', '', '', '']);
    setBackendMessage("")
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
            {(step === 'email' || step === 'login') && (
              <>
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

                {isDemoUser && (
                  <div className={styles.demoMiniBox}>
                    <span className={styles.demoMiniBadge}>DEMO</span>

                    <span className={styles.demoMiniText}>
                      Use email for demo or create an account using your Email.
                    </span>

                    <span className={styles.demoMiniCred}>
                      <b>Email:</b> meadarshpandey@gmail.com
                    </span>

                    <span className={styles.demoMiniCred}>
                      <b>Pass:</b> Demo@123
                    </span>
                  </div>
                )}


              </>
            )}

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
                    <span
                      className={styles.userLoginForgotText}
                      onClick={() => {
                        setBackendMessage('')
                        setStep('forgot')
                      }}
                    >
                      Forgot password?
                    </span>
                    <span onClick={() => {
                      setBackendMessage('')
                      setStep('forgot')
                    }} className={styles.userLoginResetLink}>Reset</span>
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


            {/* Forget Step */}
            {step === 'forgot' && (
              <div className={styles.userLoginForm}>
                {backendMessage && (
                  <div className={styles.infoMessage}>
                    {backendMessage}
                  </div>
                )}

                <div className={styles.userLoginFormGroup}>
                  <label className={styles.userLoginLabel}>Email*</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.userLoginInput}
                    disabled={loading}
                  />
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
                    className={styles.userLoginButton}
                    disabled={loading}
                    onClick={handleSendOtp}
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              </div>
            )}

            {/* Reset Step */}
            {step === 'reset' && (
              <div className={styles.userLoginForm}>
                {backendMessage && (
                  <div className={styles.infoMessage}>
                    {backendMessage}
                  </div>
                )}

                <div className={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      className={styles.otpBox}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '')
                        if (!value) return

                        const updated = [...otp]
                        updated[index] = value
                        setOtp(updated)

                        if (index < otp.length - 1) {
                          otpRefs.current[index + 1]?.focus()
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace') {
                          const updated = [...otp]
                          if (updated[index]) {
                            updated[index] = ''
                            setOtp(updated)
                          } else if (index > 0) {
                            otpRefs.current[index - 1]?.focus()
                          }
                        }
                      }}
                    />
                  ))}
                </div>


                <div className={styles.userLoginFormGroup}>
                  <label className={styles.userLoginLabel}>New Password*</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.userLoginInput}
                  />
                </div>

                <div className={styles.userLoginFormGroup}>
                  <label className={styles.userLoginLabel}>Confirm Password*</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.userLoginInput}
                  />
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
                    className={styles.userLoginButton}
                    disabled={loading}
                    onClick={handleResetPassword}
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>

                {/* <button
                  type="button"
                  className={styles.userLoginButton}
                  disabled={loading}
                  onClick={handleResetPassword}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button> */}
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

For Logout:

dispatch(logout());
persistor.purge();
navigate("/login");

------------------------

Dashboard Call-

dispatch(setAuthFromLogin(response.data));
navigate("/dashboard");

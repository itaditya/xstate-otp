import { useState, useEffect } from 'react';
import { useMachine } from '@xstate/react';
import Head from 'next/head';
import { CheckCircle, AlertCircle } from 'react-feather';
import { motion, AnimateSharedLayout } from 'framer-motion';

import otpMachine from '../otpMachine';

function UserForm(props) {
  const { initialPhone } = props;
  const [currentState, sendEvent, service] = useMachine(otpMachine, {
    context: {
      phone: initialPhone,
    },
  });
  const { phone, otp } = currentState.context;
  const [stateSavedPhone, setStateSavedPhone] = useState(phone);
  const [stateName, setStateName] = useState('Aditya Agarwal');

  const isVerificationNeeded = phone !== stateSavedPhone;

  function handleSubmitForm(event) {
    event.preventDefault();

    if (isVerificationNeeded) {
      handleSendOtp();
    } else {
      // make API call to save data and then show in UI.
      alert('Everything Saved!');
    }
  }

  function handleUpdatePhone(event) {
    const newPhone = event.target.value;
    sendEvent({ type: 'UPDATE_PHONE', phone: newPhone });
  }

  function handleSendOtp() {
    sendEvent('SEND_OTP');
  }

  function handleUpdateOtp(event) {
    const newOtp = event.target.value;
    sendEvent({ type: 'UPDATE_OTP', otp: newOtp });
  }

  function handleSubmitOtp(event) {
    event.preventDefault();
    sendEvent('VERIFY_OTP');
  }

  useEffect(() => {
    service.onTransition(state => {
      console.log(state.value);
      if (state.matches('otpVerified')) {
        setStateSavedPhone(state.context.phone);
      }
    });
  }, []);

  return (
    <AnimateSharedLayout type="crossfade">
      <motion.div
        animate
        className="flex items-center justify-center bg-white text-gray-900 pt-4 pb-8 px-4 rounded-lg shadow-md"
        style={{ width: '300px' }}
      >
        {currentState.matches('idle') || currentState.matches('otpVerified') ? (
          <motion.form animate onSubmit={handleSubmitForm} className="">
            <h2 className="text-center font-bold text-2xl mb-8">
              Update Profile
            </h2>
            <div className="flex flex-col space-y-6">
              <label className="">
                <h4 className="mb-2">Enter Name</h4>
                <input
                  required
                  className="bg-gray-100 text-gray-700 w-full px-3 py-2 text-xl rounded-md shadow-inner"
                  type="text"
                  value={stateName}
                  onChange={event => setStateName(event.target.value)}
                />
              </label>
              <label className="">
                <h4 className="mb-2">Enter Phone Number</h4>
                <div className="flex items-center relative">
                  <input
                    required
                    className="bg-gray-100 text-gray-700 w-full pl-3 pr-10 py-2 text-xl rounded-md shadow-inner"
                    type="text"
                    value={phone}
                    onChange={handleUpdatePhone}
                  />
                  <span className="absolute right-0 px-2">
                    {isVerificationNeeded ? (
                      <span
                        className="text-yellow-600"
                        aria-label="Need Verification"
                      >
                        <AlertCircle />
                      </span>
                    ) : (
                      <span className="text-green-700" aria-label="Verified">
                        <CheckCircle />
                      </span>
                    )}
                  </span>
                </div>
              </label>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 rounded-md shadow-lg transition-colors duration-500 ease-in-out"
              >
                {isVerificationNeeded ? 'Proceed' : 'Submit'}
              </button>
            </div>
            {currentState.matches('otpVerified') && (
              <p className="text-center mt-2 text-green-600">
                OTP verified and Phone saved
              </p>
            )}
          </motion.form>
        ) : (
          <motion.div animate className="w-full">
            <h2 className="text-center font-bold text-2xl mb-8">Verify OTP</h2>
            {currentState.matches('otpSending') && (
              <p className="text-center">Sending OTP...</p>
            )}
            {[
              'otpSent',
              'otpSendFailed',
              'otpVerifying',
              'otpVerifyFailed',
            ].some(currentState.matches) && (
              <div>
                {currentState.matches('otpSendFailed') && (
                  <p className="text-red-600 text-center">Couldn't send OTP</p>
                )}
                {['otpSent', 'otpVerifying', 'otpVerifyFailed'].some(
                  currentState.matches
                ) && (
                  <form onSubmit={handleSubmitOtp}>
                    <div className="flex flex-col space-y-3">
                      <label className="relative pb-8">
                        <h4 className="mb-2">Enter OTP</h4>
                        <input
                          required
                          autoFocus
                          className="bg-gray-100 text-gray-700 disabled:opacity-50 w-full px-3 py-2 text-xl rounded-md shadow-inner"
                          type="text"
                          value={otp}
                          onChange={handleUpdateOtp}
                          disabled={currentState.matches('otpVerifying')}
                        />
                        {currentState.matches('otpVerifyFailed') && (
                          <p className="absolute bottom-0 text-red-600">
                            OTP verification failed
                          </p>
                        )}
                      </label>
                      <button
                        type="submit"
                        disabled={currentState.matches('otpVerifying')}
                        className="bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 rounded-md shadow-lg transition-colors duration-500 ease-in-out"
                      >
                        {currentState.matches('otpVerifying')
                          ? 'Verifying OTP...'
                          : 'Verify OTP'}
                      </button>
                    </div>
                  </form>
                )}
                <div className="mt-4 flex justify-evenly">
                  <button onClick={() => sendEvent('CHANGE_PHONE')}>
                    Change Phone
                  </button>
                  <button onClick={handleSendOtp}>Resend OTP</button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimateSharedLayout>
  );
}

function Home(props) {
  const { phone } = props;
  return (
    <div className="">
      <Head>
        <title>Homepage | Aditya Agarwal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-gray-200 min-h-screen flex items-center justify-center">
        <UserForm initialPhone={phone} />
      </main>

      <footer />
    </div>
  );
}

Home.getInitialProps = async () => {
  const { data } = await fetch(
    'https://c4rey.sse.codesandbox.io/api/getSavedPhone'
  ).then(res => res.json());
  return { phone: data.phone };
};

export default Home;

import { Machine, assign } from 'xstate';

import fetcher from './utils/fetcher';

const otpMachine = Machine(
  {
    id: 'OTP_MACHINE',
    initial: 'idle',
    // initial: 'otpSendFailed',
    context: {
      phone: '',
      otp: '',
    },
    states: {
      idle: {
        on: {
          SEND_OTP: 'otpSending',
          UPDATE_PHONE: {
            actions: 'updatePhone',
          },
        },
      },
      otpSending: {
        invoke: {
          id: 'sendOtpApi',
          src: (context, event) => {
            return fetcher('/api/sendOtp', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ phone: context.phone }),
            });
          },
          onDone: {
            target: 'otpSent',
          },
          onError: 'otpSendFailed',
        },
      },
      otpSent: {
        on: {
          SEND_OTP: 'otpSending',
          VERIFY_OTP: 'otpVerifying',
          CHANGE_PHONE: 'idle',
          UPDATE_OTP: {
            actions: 'updateOtp',
          },
        },
      },
      otpSendFailed: {
        on: {
          SEND_OTP: 'otpSending',
          CHANGE_PHONE: 'idle',
        },
      },
      otpVerifying: {
        invoke: {
          id: 'verifyOtpApi',
          src: (context, event) =>
            fetcher('/api/verifyOtp', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ otp: context.otp }),
            }),
          onDone: {
            target: 'otpVerified',
          },
          onError: 'otpVerifyFailed',
        },
      },
      otpVerified: {
        on: {
          SEND_OTP: 'otpSending',
          UPDATE_PHONE: {
            target: 'idle',
            actions: 'updatePhone',
          },
        },
        after: {
          1300: 'idle',
        },
      },
      otpVerifyFailed: {
        on: {
          SEND_OTP: 'otpSending',
          VERIFY_OTP: 'otpVerifying',
          CHANGE_PHONE: {
            target: 'idle',
            actions: 'updatePhone',
          },
          UPDATE_OTP: {
            actions: 'updateOtp',
          },
        },
      },
    },
  },
  {
    actions: {
      updatePhone: assign({
        phone: (context, event) => {
          console.log('updating phone...');
          return event.phone;
        },
      }),
      updateOtp: assign({
        otp: (context, event) => {
          console.log('updating otp...');
          return event.otp;
        },
      }),
    },
  }
);

export default otpMachine;

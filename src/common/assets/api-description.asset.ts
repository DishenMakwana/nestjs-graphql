export const apiDesc = {
  auth: {
    login: 'Login user (user as well as admin) with email and password',
    logout: 'Logout user (user as well as admin)',
    register: 'Register for user',
    forgotPassword:
      'Forgot password by email. You can consume this api to resend otp',
    verifyOtp: 'Verify otp of user with email and otp',
    resetPassword: 'Reset password with otp and email',
    userActivation: 'User activation NOT an api. Front end rendering (hbs)',
    otpSent: 'Send otp to user',
    changePassword: 'Change password of user',
    verifyOTP: 'Verify otp of user with email and otp',
    resentVerificationEmail: 'Resent verification email to verify user',
    verifyUser: 'Verify user',
  },
  config: {
    createConfig: 'Create Config',
    configList: 'Config list',
    configDetails: 'Config details',
    updateConfig: 'Update Config',
    deleteConfig: 'Delete Config',
    allConfig: 'All config',
    ConfigSearch: 'Config search',
  },
};

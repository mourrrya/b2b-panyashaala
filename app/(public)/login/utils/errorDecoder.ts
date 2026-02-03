export function decodeErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    OAuthSignin: "Error starting the OAuth sign in process",
    OAuthCallback: "Error handling the OAuth callback",
    OAuthCreateAccount: "Error creating OAuth account",
    EmailCreateAccount: "Error creating email account",
    Callback: "Error in the callback handler",
    OAuthAccountNotLinked:
      "This email is already associated with another account. Please sign in with your original method.",
    EmailSignin: "Error sending the email verification link",
    CredentialsSignin:
      "Invalid credentials. Please check your email and password.",
    SessionRequired: "Please sign in to access this page",
    AccessDenied:
      "Access denied. There was an error during authentication. Please try again.",
    Configuration: "Server configuration error. Please contact support.",
    Default: "An authentication error occurred",
  };

  return errorMessages[error] || errorMessages.Default;
}

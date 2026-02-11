export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold font-display mb-8">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-sm text-foreground">Last updated: October 2024</p>
          <p>
            Please read these Terms of Service carefully before using the Priisme website or mobile application operated by us.
          </p>
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Accounts</h2>
          <p>
            When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of Priisme and its licensors.
          </p>
        </div>
      </div>
    </div>
  );
}

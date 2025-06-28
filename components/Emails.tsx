interface EmailProps {
  firstName: string;
}

export const WelcomeEmail: React.FC<Readonly<EmailProps>> = ({ firstName }) => (
  <div>
    {/* Preheader (limit to 75 characters) */}
    <div className="hidden">3 tips, 2 tools, and 1 heartfelt hello</div>
    <p>Welcome, {firstName}!</p>
    <br />
    <br />
    <h1>✅ 3 tips to get you started</h1>
    <ol>
      <li>
        Explore Your Dashboard – Everything you need is right at your
        fingertips.
      </li>
      <li>Set Your First Goal – Small steps now lead to big wins later.</li>
      <li>
        Turn on Notifications – Never miss an update, insight, or opportunity.
      </li>
    </ol>
    <h1>🛠️ 2 tools you&apos;ll love</h1>
    <ul>
      <li>Dollar Sine iOS app</li>
      <li>Some other tool...</li>
    </ul>
    <h1>And 1 heartfelt hello 👋🏿</h1>
    <p>
      You&apos;re not just a username to us — you’re part of something bigger.
      Whether you&apos;re just starting out or already on your way, Dollar Sine is
      your new financial home base.
    </p>
  </div>
);

export const OnboardingCompletedEmail: React.FC<Readonly<EmailProps>> = ({
  firstName,
}) => (
  <div>
    {/* Preheader (limit to 75 characters) */}
    <div className="hidden">Okay, I see you, {firstName}!</div>
    <p>You finished your onboarding, {firstName}!</p>
  </div>
);

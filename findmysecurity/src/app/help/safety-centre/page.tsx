import React from 'react';

const SafetyCentre: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">FindMySecurity Safety Centre</h1>
      <p className="text-gray-700 mb-2">Guidance for Staying Safe</p>

      <section className="mb-8">
        <p className="text-gray-700 mb-2">
          At FindMySecurity, your safety is our top priority. We are committed to creating a secure environment for all users, whether you are a security professional, company, trainer, or client. We remind all clients and businesses that we do not personally verify every professional or organisation at the point of registration. Similarly, security professionals are advised to exercise caution when meeting new clients or employers, and never attend a site without basic vetting, communication, or agreed credentials in place.
        </p>
        <p className="text-gray-700 mb-2">
          The internet poses inherent risks, and we take online safety extremely seriously. Please remember that profile information may be accessible to the public and, in some cases, indexed by search engines. We strongly advise users to be mindful of how much personal or sensitive information they choose to share.
        </p>
        <p className="text-gray-700 mb-2">
          Below is a summary of how we help keep our platform secure and what you can do to protect yourself.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile Safety & Guidelines</h2>
        <p className="text-gray-700 mb-2">
          Users can optionally create public profiles that detail their services, job requirements, or business offerings. To enhance safety:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>We never display full real names; instead, users create a screen name upon sign-up.</li>
          <li>Public profiles are visible to all, including non-registered visitors, and may be indexed by platforms like Google.</li>
          <li>Do not include personally identifiable information (e.g. full name, street address, workplace, family details, etc.) in your profile.</li>
          <li>Profile images must feature only the individual security professional or company logo not group shots or identifiable third parties.</li>
          <li>Direct contact information (emails, phone numbers, social media handles) must not appear in your written profile content.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Platform Monitoring</h2>
        <p className="text-gray-700 mb-2">
          We use a combination of automated systems and manual reviews to monitor the platform 24/7. Suspicious behaviour is flagged to our security team, and accounts may be temporarily suspended during investigation. Where concerns persist or fraud is detected, accounts may be permanently banned, and repeat offenders are blacklisted.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Community Reporting</h2>
        <p className="text-gray-700 mb-2">
          Each user is encouraged to report via email to FindMySecurity support team to enable quick flagging of inappropriate or suspicious activity. Our safety team operates 365 days a year and investigates all reports.
        </p>
        <p className="text-gray-700 mb-2">
          We maintain a zero-tolerance policy for harassment, abuse, or exploitation. Offenders will be permanently suspended without notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Safe & Secure Messaging</h2>
        <p className="text-gray-700 mb-2">
          We strongly advise all users to communicate via our internal messaging system until a professional relationship is established. This protects your personal contact details and helps us keep the platform safe.
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Message sending limits are in place by default and increased only after usage is verified.</li>
          <li>All messages are securely logged and monitored to support dispute resolution and legal processes.</li>
          <li>Users can report inappropriate messages by emailing any concerns to our support team.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Secure Document Sharing</h2>
        <p className="text-gray-700 mb-2">
          Security professionals can upload documentation such as SIA licences, insurance certificates, or accreditation into our My Documents vault.
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Uploaded files are encrypted, watermarked, and reviewed by our validation team.</li>
          <li>Documents are checked for consistency with your profile and manually verified for authenticity.</li>
          <li>Businesses or clients can request document access via the profile.</li>
          <li>Professionals control which documents are shared and with whom.</li>
        </ul>
        <p className="text-gray-700 mt-2">
          It is the responsibility of all users to request and verify original documents before entering into any agreement.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Verified Members</h2>
        <p className="text-gray-700 mb-2">
          Verified profiles are marked with verification badge. This indicates that the user has uploaded valid ID or regulatory documents. You’ll find a list of verified documentation in the “My Documents” section of each profile. We recommend that all users review original documents when engaging any security professional or company.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Protecting Your Contact Details</h2>
        <p className="text-gray-700 mb-2">
          If you choose to list direct contact details (e.g., phone number), we record each access instance and display a log to you via the Who’s Viewed Me? dashboard.
        </p>
        <p className="text-gray-700 mb-2">
          If you do not want others to access your direct contact information, do not complete the relevant section of your profile.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Client Reviews & Ratings</h2>
        <p className="text-gray-700 mb-2">
          Clients can leave public reviews for security professionals and companies. This ensures accountability and highlights professionalism within the industry.
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>All reviews are moderated upon publication.</li>
          <li>Professionals may report any reviews.</li>
          <li>We encourage all clients to leave honest feedback after any engagement, good or bad.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">In-Person Interviews</h2>
        <p className="text-gray-700 mb-2">
          We strongly encourage face-to-face interviews before any engagement. Security professionals should never accept assignments from individuals or organisations they have not met and verified.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Meeting Safely</h2>
        <p className="text-gray-700 mb-2">When arranging to meet, always:</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Choose a public, neutral location (e.g., café or co-working space).</li>
          <li>Inform someone you trust of your meeting time, location, and contact details.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Protection from Spammers</h2>
        <p className="text-gray-700 mb-2">
          Spammers range from opportunistic mischief-makers to individuals or companies attempting to access and misuse personal or professional information. At FindMySecurity, we remain vigilant against any party seeking to exploit our platform for inappropriate or unlawful gain.
        </p>
        <p className="text-gray-700 mb-2">
          To mitigate spam and abuse, we place daily message limits on each user account. Every message sent is securely logged, and our system uses advanced security technology including automated detection and manual review to flag suspicious behaviour for investigation.
        </p>
        <p className="text-gray-700 mb-2">
          If you receive a message that appears inappropriate or concerning, please report it immediately by emailing your concern to support team. Our safety team will review the content and take appropriate action.
        </p>
        <p className="text-gray-700 mb-2">
          All communication records are stored in compliance with UK data protection legislation and our registration with the Information Commissioner’s Office (ICO). These logs may be accessed in the event of legal enquiries, law enforcement investigations, or safety-related matters.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Protecting Yourself from Scams</h2>
        <p className="text-gray-700 mb-2">
          While we work hard to ensure the integrity of the FindMySecurity community, some individuals may attempt to defraud others online. Common scams in the security sector may include:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>False job offers from overseas or fictitious clients</li>
          <li>Promises of large advance payments without proper verification</li>
          <li>Requests to transfer or return funds sent by cheque or wire</li>
        </ul>
        <p className="text-gray-700 mt-2">
          If an opportunity sounds too good to be true or if payment is offered before checks or in-person meetings, it likely is. Always remain cautious, and if in doubt, contact our support team immediately.
        </p>
        <p className="text-gray-700 mt-2">
          Please never accept payments from, or send funds to, someone you have not met in person. These types of scams are serious offences and are monitored closely by cybercrime units and national fraud prevention agencies. We take all reports seriously and act swiftly to protect our users.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Password Safety</h2>
        <p className="text-gray-700 mb-2">
          We urge all users to protect their login credentials and not share passwords with others. 2FA is applicable and we strongly recommend all users to enable 2FA on their accounts.
        </p>
        <p className="text-gray-700 mb-2">
          While browsers and devices may prompt you to save your login information, we advise against this for security reasons, particularly if you share your device with others.
        </p>
        <p className="text-gray-700 mb-2">
          If you forget your password, use the secure password reset feature on our platform. If you believe your email or FindMySecurity account may have been compromised, reset your password immediately.
        </p>
        <p className="text-gray-700 mb-2">
          Sharing login credentials is a serious breach of our terms, and accounts found to be shared or misused may be suspended without notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Logging In and Out</h2>
        <p className="text-gray-700 mb-2">
          For your protection, always log in manually each time you access FindMySecurity rather than saving credentials in your browser or device. This minimises the risk of unauthorised access, especially in the event of theft or loss of your computer or mobile device.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Secure Server Hosting</h2>
        <p className="text-gray-700 mb-2">
          FindMySecurity uses advanced secure server hosting infrastructure located across multiple facilities. Our systems are protected by:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Encrypted data transmission</li>
          <li>Real-time antivirus monitoring</li>
          <li>Enterprise-grade firewalls</li>
          <li>Continuous intrusion detection and prevention systems</li>
        </ul>
        <p className="text-gray-700 mt-2">
          These measures ensure your data is protected at all times.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Verification and Independent Checks</h2>
        <p className="text-gray-700 mb-2">
          While FindMySecurity provides tools for document upload, validation, and user verification, it remains the responsibility of clients and businesses to carry out due diligence.
        </p>
        <p className="text-gray-700 mb-2">Businesses and clients should always:</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Review documentation in person (e.g. SIA licence, insurance)</li>
          <li>Check references</li>
          <li>Conduct interviews before offering work or access to premises</li>
        </ul>
        <p className="text-gray-700 mt-2">Security professionals are likewise encouraged to:</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Verify the identity and legitimacy of new clients</li>
          <li>Confirm the site and role expectations before accepting a job</li>
          <li>Always inform a trusted colleague or contact when attending new client locations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Collaboration with National Agencies</h2>
        <p className="text-gray-700 mb-2">
          We actively cooperate with national bodies including the Police, National Crime Agency, ICO, and relevant regulatory authorities. If we receive credible intelligence or formal request from these organisations, we respond promptly and professionally to support investigations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">General Safety Reminder</h2>
        <p className="text-gray-700 mb-2">
          If you ever feel unsure about a user, listing, or communication on our platform, trust your instincts. Your safety comes first.
        </p>
        <p className="text-gray-700 mb-2">
          If you feel at immediate risk or witness criminal activity, contact the Police on 999.
        </p>
        <p className="text-gray-700 mb-2">
          For general concerns, you can reach our support team directly via{' '}
          <a href="mailto:info@findmysecurity.co.uk" className="text-blue-600 hover:underline">info@findmysecurity.co.uk</a>.
        </p>
      </section>
    </div>
  );
};

export default SafetyCentre;
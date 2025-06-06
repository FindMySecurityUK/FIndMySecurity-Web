import React from 'react';
import Link from 'next/link';


const VerificationGuide: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Verifying Security Professionals – Document Checks, Criminal Records, References & Independent Validation</h1>

      <section className="mb-8">
        <p className="text-gray-700 mb-2">
          It is essential to thoroughly verify any security professional, contractor, or company before engaging their services. Choosing the right security personnel is a serious decision, whether for private hire, site protection, public safety events, or executive protection. It is your responsibility to ensure that the individual or company you contract has the right credentials, legal eligibility, and trustworthy track record to deliver their duties safely and professionally.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Checks to Carry Out</h2>
        <p className="text-gray-700 mb-2">
          We strongly recommend creating a checklist for verifying documents and conducting interviews. Below are the key areas to assess before entering into any contract or assignment agreement.
        </p>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">SIA Licence & Insurance</h3>
          <p className="text-gray-700 mb-2">
            All frontline security professionals in the UK must hold a valid Security Industry Authority (SIA) licence appropriate to their role (e.g., Door Supervisor, Close Protection, CCTV Operator). This can be verified on the official{' '}
            <a href="https://www.sia.homeoffice.gov.uk" className="text-blue-600 hover:underline">SIA Register</a>.
          </p>
          <p className="text-gray-700">
            In addition, self-employed professionals and private security companies must hold up-to-date public liability insurance. Always request proof of this insurance before contracting a service.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Criminal Record Checks (DBS) and Vetting</h3>
          <p className="text-gray-700 mb-2">
            Before hiring, request to see a valid Enhanced DBS check, which reveals spent and unspent convictions, cautions, warnings, and whether the individual is barred from working with vulnerable groups. Many employers also conduct background checks via the BS 7858:2019 standard, which includes:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Identity verification</li>
            <li>Five-year employment history review</li>
            <li>Character references</li>
            <li>Address verification</li>
            <li>Right to Work checks</li>
          </ul>
          <p className="text-gray-700 mt-2">
            For contractors who have served in the Armed Forces or government security roles, military references or security clearance levels (e.g., SC, DV) may also be available and relevant.
          </p>
          <p className="text-gray-700 mt-2">
            Note: A DBS certificate is only accurate as of the day it was issued. The DBS Update Service allows real-time checks for changes, ask if the candidate is subscribed.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">ID Verification & Right to Work</h3>
          <p className="text-gray-700">
            Always check two forms of ID, one photographic (passport, driving licence) and one showing proof of address (utility bill, bank statement). You must also verify their legal right to work in the UK. Guidance is available from{' '}
            <a href="https://www.gov.uk/check-job-applicant-right-to-work" className="text-blue-600 hover:underline">GOV.UK – Right to Work Checks</a>.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Training & Qualifications</h3>
          <p className="text-gray-700 mb-2">
            Security professionals should be able to present SIA-linked qualification certificates (e.g., Door Supervision, CCTV, First Aid). For specialist roles, check for qualifications such as:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Close Protection Level 3</li>
            <li>CCTV Operation Level 2</li>
            <li>Spectator Safety or Event Security NVQs</li>
            <li>Physical Intervention or Conflict Management certifications</li>
          </ul>
          <p className="text-gray-700 mt-2">
            Additional training such as First Aid at Work, Fire Safety, or Mental Health First Aid is recommended and often expected for event-based or lone working roles.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Vehicle Documents (If Driving Is Involved)</h3>
          <p className="text-gray-700 mb-2">
            If a professional will be transporting assets or individuals, check that their vehicle documentation is valid and includes:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Business class vehicle insurance</li>
            <li>Valid MOT</li>
            <li>Vehicle tax status</li>
            <li>Driving licence check</li>
            <li>Roadside assistance cover</li>
          </ul>
          <p className="text-gray-700 mt-2">
            Also check if the vehicle is appropriate and if security modifications (dash cams, lockboxes, etc.) are present where applicable.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">References and Previous Employment</h3>
          <p className="text-gray-700">
            Request references from past clients or employers within the security industry. A reliable security professional should be able to supply verifiable feedback from their most recent assignments or employers, ideally covering the last 5 years.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Note on Document Verification on FindMySecurity</h2>
        <p className="text-gray-700 mb-2">
          FindMySecurity allows security professionals to upload documentation such as SIA licences, insurance, DBS checks, and qualifications to their profile. These are digitally watermarked and stored securely but not automatically verified by FindMySecurity unless explicitly stated.
        </p>
        <p className="text-gray-700">
          As a hiring business or individual, it is your duty to verify these documents directly, request originals during interviews, and follow up on references as part of your due diligence.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Face-to-Face Interviews</h2>
        <p className="text-gray-700 mb-2">
          We strongly advise that all businesses and individuals conduct a face-to-face interview with any security professional before engaging their services. For initial meetings, consider arranging to meet in a public and neutral setting such as a coffee shop, reception area, or office space.
        </p>
        <p className="text-gray-700 mb-2">
          During the interview, you should ask detailed questions about the candidate’s experience, qualifications, and background. Always request to see original copies of key documents, such as:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>SIA Licence</li>
          <li>Enhanced DBS Certificate</li>
          <li>Public Liability Insurance</li>
          <li>Relevant training certificates (e.g., First Aid, Conflict Management, Close Protection)</li>
          <li>Proof of identity and eligibility to work in the UK</li>
        </ul>
        <p className="text-gray-700 mt-2">
          It is also advisable to take notes and retain copies of documentation where appropriate.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">References</h2>
        <p className="text-gray-700 mb-2">
          It is essential to obtain reliable references for any prospective security professional or company. Reputable personnel should be able to supply professional references from previous clients, contracts, or employers. Where a candidate is newly qualified or self-employed, you may consider accepting character references or academic references.
        </p>
        <p className="text-gray-700 mb-2">
          We recommend contacting referees directly by phone rather than relying solely on written testimonials or emails.
        </p>
        <p className="text-gray-700 mb-2">Suggested questions include:</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>How long have you known the professional?</li>
          <li>In what capacity have they worked with or for you?</li>
          <li>What was their role and what responsibilities did they hold?</li>
          <li>How did they perform in areas such as punctuality, discipline, reliability, professionalism under pressure, and communication?</li>
          <li>Would you hire or recommend them again?</li>
          <li>Why did they leave their position (if applicable)?</li>
        </ul>
        <p className="text-gray-700 mt-2">
          For those seeking live-in roles (e.g., close protection or residential security), you may also want to ask lifestyle or conduct-related questions.
        </p>
        <p className="text-gray-700 mt-2">
          You may also consider using specialist reference checking services such as Verifile or RefNow, which provide structured employment verification.
        </p>
        <p className="text-gray-700 mt-2">
          Please note: FindMySecurity does not independently verify references provided by members. It is your responsibility to conduct your own due diligence before formal engagement.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Professional Reviews on FindMySecurity</h2>
        <p className="text-gray-700 mb-2">
          Verified businesses and individuals who have used a security professional through FindMySecurity are encouraged to leave public reviews. These reviews are visible on the professional’s profile and can be a helpful indicator of quality, conduct, and reliability.
        </p>
        <p className="text-gray-700 mb-2">
          If a professional has been listed for a significant period but has no reviews, it may be worth discussing this with them during the vetting process.
        </p>
        <p className="text-gray-700">
          Where available, you may also contact reviewers directly through our platform to request further feedback or verification.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Supporting Documentation</h2>
        <p className="text-gray-700 mb-2">
          Security professionals committed to excellence will usually provide supporting documentation such as:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Training logs and completion certificates (e.g., SIA-linked qualifications, First Aid, Fire Safety)</li>
          <li>Company policies and operating procedures (for private firms)</li>
          <li>Employment contracts, licences, or accreditations (e.g., ISO certification, NSI/ACS membership)</li>
        </ul>
        <p className="text-gray-700 mt-2">
          This documentation helps to evidence the professionalism, capability, and commitment of the provider. Ensure any contractual forms are reviewed thoroughly before signing.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Additional Online Research</h2>
        <p className="text-gray-700 mb-2">
          As part of your due diligence, consider carrying out your own online research. Public social media profiles (e.g., LinkedIn, Facebook, Instagram, or X) may provide insight into a candidate's professionalism, communication style, and public persona.
        </p>
        <p className="text-gray-700 mb-2">Ask yourself:</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Do they behave professionally online?</li>
          <li>Are they discreet about client information or assignments?</li>
          <li>Do their activities align with your organisation’s values or risk tolerance?</li>
        </ul>
        <p className="text-gray-700 mt-2">
          You may also search for any public disciplinary or criminal records, previous company directorships, or mentions in trade forums.
        </p>
        <p className="text-gray-700 mt-2">
          This approach complements formal verification steps and can help build a well-rounded picture of the person or business you're considering.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Continuing Professional Development (CPD) and Training</h2>
        <p className="text-gray-700 mb-2">
          Security professionals should undertake regular CPD to stay informed of current legislation, risk practices, and industry trends. Common CPD topics include:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Use of force and restraint</li>
          <li>Conflict resolution</li>
          <li>Terror threat awareness</li>
          <li>GDPR & data handling</li>
          <li>Emergency response protocols</li>
        </ul>
        <p className="text-gray-700 mt-2">
          Ask candidates to provide proof of any CPD training or webinar participation.
        </p>
        <p className="text-gray-700 mt-2">
          FindMySecurity offers resources, courses, and live webinars for professionals to build their knowledge and enhance employability.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">More Advice on Staying Safe</h2>
        <p className="text-gray-700">
          For further guidance, please visit our{' '}
          <Link href="/help/safety-centre" className="text-blue-600 hover:underline"> Safety Centre </Link>, which contains essential tips on staying safe while using our platform. Or contact us for any further guidance at{' '}
          <a href="mailto:info@findmysecurity.co.uk" className="text-blue-600 hover:underline">info@findmysecurity.co.uk</a>.
        </p>
      </section>
    </div>
  );
};

export default VerificationGuide;
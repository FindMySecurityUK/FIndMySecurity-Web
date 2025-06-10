import React from 'react';
import Link from 'next/link';


const InterviewGuide: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Interviewing a Security Officer: Questions & Tips for Employers</h1>

      <section className="mb-8">
        <p className="text-gray-700 mb-2">
          A warm, professional welcome can help ease any tension and set the tone for a constructive interview. Offer the candidate a tea or coffee, and if appropriate, provide a brief introduction to the premises, team, or family members they may be safeguarding. While an initial informal chat can help build rapport, it's best to conduct the main interview in private to maintain focus and confidentiality.
        </p>
        <p className="text-gray-700 mb-2">
          Begin by inviting the candidate to introduce themselves, then move on to structured questions relevant to the role.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Suggested Interview Questions</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Background & Motivation</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Tell me a little about yourself and your professional journey so far.</li>
            <li>What first attracted you to a career in private security or close protection?</li>
            <li>How long have you worked in the security industry? What roles have you held?</li>
            <li>What has been your most rewarding assignment to date and why?</li>
            <li>Do you prefer working independently in residential/private roles or as part of a larger team? Why?</li>
            <li>What qualities do you believe make an excellent private security officer?</li>
            <li>What do you look for in a client or assignment when considering a job offer?</li>
            <li>Are you looking to grow your career within security, or do you have other long-term goals?</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Checks & Certifications</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Are you currently SIA-licensed? Please specify the licence(s) you hold (e.g. Close Protection, Door Supervisor).</li>
            <li>Do you hold a valid enhanced DBS check? (This is required for this position.)</li>
            <li>Are you first aid trained? If not, are you willing to complete certification?</li>
            <li>Do you have any additional qualifications relevant to this role (e.g. conflict management, surveillance, driving certifications)?</li>
            <li>Are your documents and qualifications up to date and accredited in the UK?</li>
            <li>Do you hold a full, clean UK driving licence? If not, please explain.</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Employment History</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Please talk us through the gap/change noted in your CV (if applicable).</li>
            <li>What type of environments have you previously secured (e.g. private residence, VIP events, corporate buildings)?</li>
            <li>Have you ever worked with high-net-worth individuals or families with children? If so, how did you ensure their safety discreetly?</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Scenario & Response</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>What do you consider the most common risks for individuals or households in this area?</li>
            <li>If you encountered [insert realistic scenario, e.g. "an attempted unauthorised entry" or "an aggressive guest at a private event"], how would you respond?</li>
            <li>How do you manage situations that require diplomacy, such as dealing with family guests or staff while maintaining professional boundaries?</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Approach & Behaviour</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>What is your view on the appropriate use of physical intervention, and under what circumstances would you consider it justified?</li>
            <li>How do you maintain alertness during long shifts, particularly overnight assignments?</li>
            <li>What additional duties are you comfortable with (e.g. CCTV monitoring, liaison with contractors, accompanying travel, concierge responsibilities)?</li>
            <li>What notice period are you required to give in your current role?</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Next Steps</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Let the candidate know when they can expect a decision and how you will follow up.</li>
            <li>Always follow up on all references and verify the legitimacy of certifications and documents.</li>
            <li>An enhanced DBS check and up-to-date SIA licence verification should be considered essential.</li>
            <li>Regardless of outcome, provide professional and constructive feedback to the candidate.</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">For more guidance</h2>
        <p className="text-gray-700">
          See our Checks and References section or visit the{' '}
          <Link href="/help/safety-centre" className="text-blue-600 hover:underline"> FindMySecurity Safety Centre </Link> for employer best practices.
        </p>
      </section>
    </div>
  );
};

export default InterviewGuide;
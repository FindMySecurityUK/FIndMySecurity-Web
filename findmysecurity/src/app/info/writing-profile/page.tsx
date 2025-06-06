import React from 'react';
import Link from 'next/link';

const ProfileTips: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Writing Your Profile – Tips for Security Professionals on FindMySecurity</h1>

      <section className="mb-8">
        <p className="text-gray-700 mb-2">
          Your FindMySecurity profile is your professional introduction, it’s your opportunity to present yourself to businesses, private clients, training providers, and agencies seeking reliable, qualified, and verified security personnel.
        </p>
        <p className="text-gray-700 mb-2">It should:</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Reflect your professionalism and work ethic</li>
          <li>Highlight your training, qualifications, and certifications</li>
          <li>Emphasise your unique skills or specialisms</li>
          <li>Help build trust with potential clients</li>
          <li>Keep you safe by avoiding personal oversharing</li>
          <li>Position you as a top candidate within the UK’s security sector</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Getting Started: Creating a Strong Profile</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose a Screen Name Wisely</h3>
          <p className="text-gray-700">
            Your screen name is visible across the platform. Many professionals choose an alias to maintain privacy, but avoid anything unprofessional or linked to negative content elsewhere online. Keep it neutral and professional.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload a Professional Photo</h3>
          <p className="text-gray-700">
            You must upload a clear photo of yourself. Aim for a recent image, taken in smart attire, with a plain background. Your profile photo must not contain other individuals, logos with text, or inappropriate content. Avoid casual or themed images (e.g., fancy dress).
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Showcase Your Skills and Experience</h3>
          <h4 className="text-lg font-medium text-gray-800 mb-2">List Your Qualifications and Training</h4>
          <p className="text-gray-700">
            Detail your professional experience and training, including SIA licence types (e.g., Door Supervision, Close Protection), first aid certificates, fire safety, conflict management, or specialist training (e.g., counter-terrorism, crowd control, executive protection).
          </p>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-2">Upload Your Documents</h4>
          <p className="text-gray-700">
            Upload your ID, SIA badge, right-to-work proof, training certificates, DBS check, insurance documents, or military service records to the secure My Documents vault. Documents are encrypted, stored safely, and only shared with others if you choose to do so. Publicly showing verified documents boosts your credibility and trust score.
          </p>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-2">Highlight Your Strengths</h4>
          <p className="text-gray-700 mb-2">
            Ask former employers or colleagues what they value most about your work. Use their feedback to describe your qualities:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>“Clients describe me as punctual, alert, and dependable.”</li>
            <li>“Trained in conflict resolution and discreet VIP protection.”</li>
            <li>“Fluent in English and any other language applicable, effective communicator in diverse environments.”</li>
          </ul>
          <p className="text-gray-700 mb-2 mt-2">Mention the types of roles or sectors you specialise in:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Nightclub security, residential guarding, event crowd control, or high-risk assignments</li>
            <li>Past deployments or military service, if relevant</li>
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-2">Be Clear About Your Availability and Expectations</h4>
          <p className="text-gray-700 mb-2">
            Let potential clients know your current situation and preferences. For example:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Open to full-time, part-time, or freelance assignments</li>
            <li>Availability: evenings, weekends, on-call, or 24/7 shifts</li>
            <li>Locations covered (e.g., Greater London, Midlands, Nationwide)</li>
            <li>Type of roles: static guarding, mobile patrol, asset protection, VIP escort</li>
            <li>Immediate availability or notice period</li>
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-2">Keep Your Profile Updated</h4>
          <p className="text-gray-700">
            Log in regularly to update your availability, add new qualifications, and refresh your summary. Inactivity can affect your visibility in search results. Logging in also moves your profile higher in local listings, making you easier to discover.
          </p>
          <p className="text-gray-700 mt-2">
            If you're away or unavailable for a time, add a note to your profile indicating your return date. Remove the message once you're back.
          </p>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-2">Proofread and Format Professionally</h4>
          <p className="text-gray-700 mb-2">
            Before publishing, read your profile aloud or ask a trusted colleague to review it. Make sure it:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Sounds professional and confident</li>
            <li>Is free from spelling or grammar errors</li>
            <li>Uses bullet points and short paragraphs for easy reading</li>
          </ul>
          <p className="text-gray-700 mt-2">
            Avoid copying others, plagiarism damages credibility. Your profile should be authentic and unique to you.
          </p>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-2">Reviews Boost Credibility</h4>
          <p className="text-gray-700">
            Ask clients, managers, or supervisors you’ve worked with to leave a verified review on your profile. Positive feedback builds trust and helps you stand out in a competitive market.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tips for Clients and Employers</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Add Clear Role Requirements</h3>
          <p className="text-gray-700">
            Include job details, shift patterns, locations, and qualifications required in your advert. This will help you receive relevant and high-quality applications only.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Use Tags</h3>
          <p className="text-gray-700">
            Select appropriate service categories such as Door Supervisor, CCTV Operator, Close Protection Officer, Event Security, or Corporate Guard to improve search results and filter matches.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Stay Safe</h3>
          <p className="text-gray-700">
            Do not include sensitive information in your public profile, avoid mentioning names, company premises, or private addresses. Communicate through the platform until you are confident in proceeding.
          </p>
          <p className="text-gray-700 mt-2">
            For more advice on safe hiring and professional conduct, please visit our{' '}
            <Link href="/help/safety-centre" className="text-blue-600 hover:underline"> Safety Centre </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default ProfileTips;
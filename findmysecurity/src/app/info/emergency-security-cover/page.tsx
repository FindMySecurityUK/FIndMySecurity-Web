import React from 'react';

const EmergencyCover: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Emergency Security Cover</h1>
      <p className="text-gray-700 mb-2">How to arrange last-minute security cover when you need it most</p>

      <section className="mb-8">
        <p className="text-gray-700 mb-2">
          Whether a scheduled officer calls in sick, your venue is unexpectedly short-staffed, or you receive a sudden assignment, last-minute security gaps can be stressful, disruptive, and costly.
        </p>
        <p className="text-gray-700 mb-2">
          At FindMySecurity, we understand the importance of reliable contingency options and have built a platform that makes it easy to find qualified, trusted professionals fast.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Where can I find emergency security professionals?</h2>
        <p className="text-gray-700 mb-2">
          Many security companies and self-employed officers collaborate in local networks or teams, covering for each other when needed. During interviews or onboarding, it’s good practice to ask whether backup arrangements are in place or if an individual officer is part of a professional response network.
        </p>
        <p className="text-gray-700 mb-2">On FindMySecurity, you can:</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Post an urgent job with your location, timing, and requirements</li>
          <li>Instantly alert nearby available professionals via email and push notification</li>
          <li>Receive rapid applications from those qualified and available</li>
          <li>Filter results based on licensing (e.g. SIA Door Supervisor, Close Protection), or experience type (e.g. event security, retail loss prevention, construction guarding)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Post a short-notice security job</h2>
        <p className="text-gray-700 mb-2">
          Our dedicated job board allows you to quickly post urgent or ad-hoc cover roles, including:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Same-day emergency shifts</li>
          <li>Overnight mobile patrol cover</li>
          <li>Temporary static guarding</li>
          <li>Event security backup</li>
          <li>Retail staff sickness cover</li>
        </ul>
        <p className="text-gray-700 mt-2">
          <a href="#" className="text-blue-600 hover:underline">▶ Post an Emergency Security Job</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search the UK’s largest database of security professionals</h2>
        <p className="text-gray-700 mb-2">
          With thousands of security professionals registered on FindMySecurity, you're never far from a reliable backup option.
        </p>
        <p className="text-gray-700 mb-2">To broaden your reach:</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Use postcode-based searches in your operating area and nearby commute zones</li>
          <li>Check availability by day and hour</li>
          <li>Filter by certification, insurance, language skills, and more</li>
        </ul>
        <p className="text-gray-700 mt-2">
          Many professionals on our platform offer flexible or temporary availability, ideal for bridging gaps in cover at short notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get ahead—build contingency before emergencies occur</h2>
        <p className="text-gray-700 mb-2">
          The best way to manage risk is to plan ahead. We recommend:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Pre-screening a shortlist of professionals who can be called upon</li>
          <li>Arranging introductory shifts or shadowing days</li>
          <li>Completing documentation (e.g. ID checks, insurance verifications) in advance</li>
        </ul>
        <p className="text-gray-700 mt-2">
          This ensures that when the time comes, your substitute professional is already familiar with the role, reducing stress for you and your client or venue.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Start now—it only takes a minute</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
          <li>Register for free on FindMySecurity</li>
          <li>Create a quick profile outlining your emergency staffing needs</li>
          <li>Post your requirement or start searching immediately</li>
          <li>Let the platform notify trusted professionals nearby</li>
        </ol>
        <p className="text-gray-700 mt-2">
          You’ll be surprised how many security professionals are available for short-notice cover, even in your immediate area.
        </p>
      </section>
    </div>
  );
};

export default EmergencyCover;
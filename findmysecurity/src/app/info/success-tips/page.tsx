import React from 'react';
import Link from 'next/link';

const SuccessTips: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Security Professional Tips – How to Maximise Your Success on FindMySecurity</h1>

      <section className="mb-8">
        <p className="text-gray-700 mb-2">
          FindMySecurity is the UK’s leading online security industry platform, trusted by professionals and organisations across the country.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create a Free Profile</h2>
        <p className="text-gray-700">
          If you haven’t registered yet, you can sign up for free and start showcasing your services to hundreds of potential clients in your area today.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Complete Your Profile</h2>
        <p className="text-gray-700">
          Your profile is your professional advert, it’s the first impression you give to employers, businesses, and individuals seeking security services. Take time to craft a compelling description of your experience, qualifications, and availability.
        </p>
        <p className="text-gray-700 mt-2">
          Watch our Youtube guidance videos in New & Insight section of FindMySecurity for more detailed tips.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Use Tags to Stand Out</h2>
        <p className="text-gray-700 mb-2">
          Tags summarise your services and qualifications. You can tick tags such as:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>SIA Licensed</li>
          <li>Close Protection</li>
          <li>CCTV Operator</li>
          <li>First Aid Qualified</li>
          <li>Ex-Military Background</li>
          <li>Event Security</li>
          <li>24/7 Availability</li>
          <li>DBS Verified</li>
        </ul>
        <p className="text-gray-700 mt-2">
          Tags improve visibility in search results. Without the right tags, you may not appear in the searches your potential clients are making.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ask for Reviews</h2>
        <p className="text-gray-700">
          Clients are far more likely to contact professionals with strong reviews. Ask every client you've worked with to leave a review on your profile. It's free and helps build trust. Professionals with multiple positive reviews are over 10 times more likely to receive contact requests.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload Your Credentials</h2>
        <p className="text-gray-700 mb-2">
          Boost your credibility by uploading your updated:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>SIA licence</li>
          <li>DBS certificate</li>
          <li>First aid training</li>
          <li>ID verification</li>
          <li>Insurance documents</li>
        </ul>
        <p className="text-gray-700 mt-2">
          Your documents are encrypted and only visible to those you authorise. Verified documents increase profile views by up to 5 times.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Detailed Availability</h2>
        <p className="text-gray-700">
          Specify when you're available by day and time. If a client is looking for an officer available on Friday nights, your detailed availability ensures you appear in their search results. You can set this from your My Profile dashboard.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add a Professional Photo</h2>
        <p className="text-gray-700">
          Profiles with photos receive five times more views. Make sure your photo is recent, high-quality, and professional, no group shots or logos. A clear headshot in a smart outfit works best.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Login Regularly</h2>
        <p className="text-gray-700">
          Our search results prioritise recently active users. By logging in daily, you’ll stay at the top of local search results and appear more engaged to potential clients.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upgrade to Featured Membership</h2>
        <p className="text-gray-700">
          As a featured (gold/premium) member, you gain premium visibility at the top of search results, ten times more profile views than standard users.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Be Proactive – Contact Clients First</h2>
        <p className="text-gray-700 mb-2">
          There may be several professionals in your area. Don’t wait, log in daily, search for active job posts, and reach out to potential clients directly via our secure messaging system.
        </p>
        <p className="text-gray-700 mb-2">
          When messaging, write professionally and clearly. Explain:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Why you’re suitable for the role</li>
          <li>Your relevant experience</li>
          <li>Any key qualifications or endorsements</li>
        </ul>
        <p className="text-gray-700 mt-2">
          Avoid short or vague messages like “Still need security?”—they’re unlikely to be effective.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Keep Your Profile Up to Date</h2>
        <p className="text-gray-700">
          Update your profile regularly, especially your availability. If you're temporarily unavailable, note your return date. This prevents confusion and avoids missed opportunities.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Never Stop Improving</h2>
        <p className="text-gray-700">
          Not every message gets a reply but persistence pays off. Professionals who consistently check the platform, update their profiles, and reach out to new listings see the best results.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Stay Safe</h2>
        <p className="text-gray-700">
          Your safety is our priority. Always use the platform’s secure messaging system, never share passwords, and follow our{' '}
          <Link href="/help/safety-centre" className="text-blue-600 hover:underline"> Safety Centre </Link>
          guidance.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Need Help?</h2>
        <p className="text-gray-700">
          Our team is here to support you 365 days a year. If you need assistance with any aspect of your profile or account, get in touch at{' '}
          <a href="mailto:info@findmysecurity.co.uk" className="text-blue-600 hover:underline">info@findmysecurity.co.uk</a>, we’ll respond promptly.
        </p>
      </section>
    </div>
  );
};

export default SuccessTips;
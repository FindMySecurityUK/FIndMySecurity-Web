import React from 'react';

const AntiDiscriminationPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">FindMySecurity Safety and Anti-Discrimination Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Policy Statement</h2>
        <p className="text-gray-700 mb-2">
          FindMySecurity is committed to fostering a safe, inclusive, and respectful environment for all users, including security professionals, clients, and staff. We uphold the principles of equality, diversity, and inclusion, ensuring that discrimination, harassment, and victimisation are not tolerated in any form.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Purpose</h2>
        <p className="text-gray-700 mb-2">
          This policy outlines our commitment to:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Providing a platform free from discrimination and harassment.</li>
          <li>Ensuring compliance with the Equality Act 2010 and other relevant UK legislation.</li>
          <li>Promoting equal opportunities for all users, regardless of protected characteristics.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Scope</h2>
        <p className="text-gray-700 mb-2">
          This policy applies to all interactions on the FindMySecurity platform, including but not limited to:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>User profiles and communications.</li>
          <li>Job postings and applications.</li>
          <li>Feedback and reviews.</li>
          <li>Internal operations and staff conduct.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Definitions</h2>
        
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">4.1 Protected Characteristics</h3>
          <p className="text-gray-700 mb-2">
            As defined by the Equality Act 2010, protected characteristics include:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Age</li>
            <li>Disability</li>
            <li>Gender reassignment</li>
            <li>Marriage and civil partnership</li>
            <li>Pregnancy and maternity</li>
            <li>Race</li>
            <li>Religion or belief</li>
            <li>Sex</li>
            <li>Sexual orientation</li>
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">4.2 Discrimination</h3>
          <p className="text-gray-700 mb-2">
            Unlawful discrimination includes:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>
              <strong>Direct discrimination:</strong> Treating someone less favourably because of a protected characteristic.
            </li>
            <li>
              <strong>Indirect discrimination:</strong> Applying a provision, criterion, or practice that disadvantages people with a protected characteristic without a justifiable reason.
            </li>
            <li>
              <strong>Harassment:</strong> Unwanted conduct related to a protected characteristic that violates someone's dignity or creates an intimidating, hostile, degrading, humiliating, or offensive environment.
            </li>
            <li>
              <strong>Victimisation:</strong> Treating someone unfairly because they have made or supported a complaint about discrimination.
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Responsibilities</h2>

        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">5.1 FindMySecurity</h3>
          <p className="text-gray-700 mb-2">
            We are responsible for:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Implementing and enforcing this policy.</li>
            <li>Providing guidance and support to users regarding equality and safety.</li>
            <li>Monitoring the platform for compliance and addressing violations promptly.</li>
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">5.2 Users</h3>
          <p className="text-gray-700 mb-2">
            All users are expected to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Treat others with respect and dignity.</li>
            <li>Refrain from discriminatory or harassing behaviour.</li>
            <li>Report any concerns or violations to FindMySecurity team via email.</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Reporting and Handling Complaints</h2>
        <p className="text-gray-700 mb-2">
          Users can report concerns or violations by contacting our support team at{' '}
          <a href="mailto:info@findmysecurity.co.uk" className="text-blue-600 hover:underline">info@findmysecurity.co.uk</a>. All reports will be handled confidentially and investigated promptly.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Enforcement</h2>
        <p className="text-gray-700 mb-2">
          Violations of this policy may result in:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Warnings or mandatory training.</li>
          <li>Suspension or termination of user accounts.</li>
          <li>Referral to appropriate authorities if necessary.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Review and Updates</h2>
        <p className="text-gray-700 mb-2">
          This policy will be reviewed annually and updated as necessary to ensure compliance with legal requirements and best practices.
        </p>
      </section>
    </div>
  );
};

export default AntiDiscriminationPolicy;
import { X, Link2, FileText, Globe, BookOpen } from 'lucide-react';

interface Reference {
  title: string;
  description: string;
  link?: string;
}

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain?: string;
  source?: string;
  citations?: string[];
  messageContent?: string;
}

export function ReferenceModal({
  isOpen,
  onClose,
  domain,
  source,
  citations,
  messageContent,
}: ReferenceModalProps) {
  if (!isOpen) return null;

  // Detect domain from content if not provided
  const detectedDomain = domain || detectLegalDomain(messageContent || '');
  const references = getReferencesForDomain(detectedDomain);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Link2 className="w-6 h-6" />
            References & Sources
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Domain Information */}
        {detectedDomain && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Legal Domain</h3>
                <p className="text-sm text-gray-700">{detectedDomain}</p>
              </div>
            </div>
          </div>
        )}

        {/* Source Information */}
        {source && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Information Source</h3>
                <p className="text-sm text-gray-700">{source}</p>
              </div>
            </div>
          </div>
        )}

        {/* Primary References */}
        {references.length > 0 && (
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Primary References
            </h3>
            <div className="space-y-3">
              {references.map((ref, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded border border-purple-100 hover:shadow-md transition-all"
                >
                  <div className="font-medium text-gray-900 mb-1">{ref.title}</div>
                  <p className="text-sm text-gray-700 mb-2">{ref.description}</p>
                  {ref.link && (
                    <a
                      href={ref.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3" />
                      Learn More
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Citations */}
        {citations && citations.length > 0 && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-orange-600" />
              Additional Citations
            </h3>
            <ul className="space-y-2">
              {citations.map((citation, idx) => (
                <li
                  key={idx}
                  className="text-sm text-gray-700 p-2 bg-white rounded border border-orange-100"
                >
                  <span className="font-medium text-orange-600">•</span> {citation}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Default Message */}
        {!detectedDomain && !source && (!citations || citations.length === 0) && references.length === 0 && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              No reference information available for this response.
            </p>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/**
 * Get references based on legal domain
 */
function getReferencesForDomain(domain: string): Reference[] {
  const domainLower = domain.toLowerCase();

  if (domainLower.includes('constitutional')) {
    return [
      {
        title: 'The Constitution of India',
        description: 'The supreme law of India. All other laws and policies must be in accordance with this document.',
        link: 'https://www.india.gov.in/my-government/constitution-india',
      },
      {
        title: 'Part III: Fundamental Rights',
        description: 'Articles 12-35 that guarantee civil rights and fundamental freedoms to all citizens.',
        link: 'https://en.wikipedia.org/wiki/Fundamental_rights_in_India',
      },
      {
        title: 'Supreme Court of India',
        description: 'The apex judicial body that interprets constitutional provisions and ensures their enforcement.',
        link: 'https://www.supremecourtofindia.nic.in/',
      },
    ];
  } else if (domainLower.includes('criminal')) {
    return [
      {
        title: 'Indian Penal Code (IPC) - Section 1 to 511',
        description: 'Comprehensive criminal law covering all types of criminal offences in India.',
        link: 'https://www.indiacode.nic.in/handle/123456789/2263',
      },
      {
        title: 'Bharatiya Nyaya Sanhita (BNS) 2023',
        description: 'New criminal law that replaces IPC, effective from July 1, 2023.',
        link: 'https://egazette.nic.in/WriteReadData/2023/245269.pdf',
      },
      {
        title: 'Criminal Procedure Code (CrPC)',
        description: 'Regulates the manner in which criminal law is administered in India.',
        link: 'https://www.indiacode.nic.in/handle/123456789/2195',
      },
    ];
  } else if (domainLower.includes('civil') || domainLower.includes('contract')) {
    return [
      {
        title: 'Civil Procedure Code (CPC) 1908',
        description: 'Regulates the procedure for civil litigation and disputes in Indian courts.',
        link: 'https://www.indiacode.nic.in/handle/123456789/2139',
      },
      {
        title: 'Indian Contract Act 1872',
        description: 'Defines rules for creating, modifying, and enforcing contracts in India.',
        link: 'https://www.indiacode.nic.in/handle/123456789/2280',
      },
      {
        title: 'Specific Relief Act 1963',
        description: 'Provides remedies for breach of contract through specific performance and injunctions.',
        link: 'https://www.indiacode.nic.in/handle/123456789/2393',
      },
    ];
  } else if (domainLower.includes('property')) {
    return [
      {
        title: 'Transfer of Property Act 1882',
        description: 'Regulates all matters related to transfer of property in India.',
        link: 'https://www.indiacode.nic.in/handle/123456789/2306',
      },
      {
        title: 'Indian Succession Act 1925',
        description: 'Defines rules for inheritance, wills, and succession of property.',
        link: 'https://www.indiacode.nic.in/handle/123456789/2392',
      },
      {
        title: 'Registration Act 1908',
        description: 'Regulates the registration of property documents for legal validity.',
        link: 'https://www.indiacode.nic.in/handle/123456789/2361',
      },
    ];
  } else if (domainLower.includes('family')) {
    return [
      {
        title: 'Hindu Marriage Act 1955',
        description: 'Regulates marriage and divorce for Hindu, Buddhist, Jain, and Sikh populations.',
        link: 'https://www.indiacode.nic.in/handle/123456789/2357',
      },
      {
        title: 'Muslim Personal Law (Shariat) Application Act 1937',
        description: 'Applies Islamic law to personal matters for Muslim citizens.',
        link: 'https://www.indiacode.nic.in/handle/123456789/2335',
      },
      {
        title: 'Guardianship and Wards Act 1890',
        description: 'Provides protection to minors and disabled persons through guardianship.',
        link: 'https://www.indiacode.nic.in/handle/123456789/2315',
      },
    ];
  } else {
    return [
      {
        title: 'Indian Legal System Overview',
        description: 'Comprehensive guide to the Indian legal system and its various branches.',
        link: 'https://www.lawschool.co.in/pages/indian-legal-system.html',
      },
      {
        title: 'bareact.com',
        description: 'Complete repository of Indian laws and judicial decisions.',
        link: 'https://www.bareact.com/',
      },
      {
        title: 'India Code',
        description: 'Official database of Indian central legislation.',
        link: 'https://www.indiacode.nic.in/',
      },
    ];
  }
}

/**
 * Detect legal domain from message content
 */
function detectLegalDomain(content: string): string {
  const lowerContent = content.toLowerCase();

  if (
    lowerContent.includes('constitution') ||
    lowerContent.includes('article') ||
    lowerContent.includes('fundamental right')
  ) {
    return 'Constitutional Law';
  } else if (
    lowerContent.includes('ipc') ||
    lowerContent.includes('criminal') ||
    lowerContent.includes('murder') ||
    lowerContent.includes('theft') ||
    lowerContent.includes('section')
  ) {
    return 'Criminal Law (IPC)';
  } else if (
    lowerContent.includes('contract') ||
    lowerContent.includes('agreement') ||
    lowerContent.includes('breach') ||
    lowerContent.includes('civil')
  ) {
    return 'Civil Law / Contract Law';
  } else if (
    lowerContent.includes('property') ||
    lowerContent.includes('land') ||
    lowerContent.includes('inheritance') ||
    lowerContent.includes('will')
  ) {
    return 'Property Law';
  } else if (
    lowerContent.includes('marriage') ||
    lowerContent.includes('divorce') ||
    lowerContent.includes('family')
  ) {
    return 'Family Law';
  } else if (
    lowerContent.includes('लॉ') ||
    lowerContent.includes('कानून') ||
    lowerContent.includes('संविधान') ||
    lowerContent.includes('आपराधिक')
  ) {
    return 'भारतीय कानून (Indian Law)';
  }

  return 'Legal Affairs';
}

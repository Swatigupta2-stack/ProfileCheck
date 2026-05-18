import { CoverLetterData } from "@/types/coverLetter";

interface CoverLetterPreviewProps {
  data: CoverLetterData;
}

export const CoverLetterPreview = ({ data }: CoverLetterPreviewProps) => {
  const formatDate = (date: string) => {
    if (!date) return new Date().toLocaleDateString();
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div id="cover-letter-preview" className="bg-white text-gray-900 p-12 shadow-lg rounded-lg max-w-4xl mx-auto">
      {/* Your Information */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">
          {data.personalInfo.fullName || 'Your Name'}
        </h2>
        <p className="text-sm text-gray-700">{data.personalInfo.address}</p>
        <p className="text-sm text-gray-700">{data.personalInfo.phone}</p>
        <p className="text-sm text-gray-700">{data.personalInfo.email}</p>
      </div>

      {/* Date */}
      <div className="mb-8">
        <p className="text-sm text-gray-700">{formatDate(data.date)}</p>
      </div>

      {/* Recipient Information */}
      <div className="mb-8">
        <p className="text-sm text-gray-900 font-semibold">
          {data.recipientInfo.hiringManager || 'Hiring Manager'}
        </p>
        <p className="text-sm text-gray-700">
          {data.recipientInfo.companyName || 'Company Name'}
        </p>
        <p className="text-sm text-gray-700">{data.recipientInfo.companyAddress}</p>
      </div>

      {/* Salutation */}
      <div className="mb-6">
        <p className="text-sm text-gray-900">
          Dear {data.recipientInfo.hiringManager || 'Hiring Manager'},
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4 mb-6">
        {data.content.opening && (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {data.content.opening}
          </p>
        )}
        {data.content.body && (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {data.content.body}
          </p>
        )}
        {data.content.closing && (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {data.content.closing}
          </p>
        )}
      </div>

      {/* Signature */}
      <div className="mt-8">
        <p className="text-sm text-gray-900">Sincerely,</p>
        <p className="text-sm text-gray-900 font-semibold mt-4">
          {data.personalInfo.fullName || 'Your Name'}
        </p>
      </div>
    </div>
  );
};

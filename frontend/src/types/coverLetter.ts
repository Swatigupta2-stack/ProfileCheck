export interface CoverLetterData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
  recipientInfo: {
    companyName: string;
    hiringManager: string;
    companyAddress: string;
  };
  content: {
    opening: string;
    body: string;
    closing: string;
  };
  date: string;
}

export const getEmptyCoverLetter = (): CoverLetterData => ({
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
  },
  recipientInfo: {
    companyName: '',
    hiringManager: '',
    companyAddress: '',
  },
  content: {
    opening: '',
    body: '',
    closing: '',
  },
  date: new Date().toISOString().split('T')[0],
});

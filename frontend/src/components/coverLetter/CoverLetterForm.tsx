import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CoverLetterData } from "@/types/coverLetter";

interface CoverLetterFormProps {
  data: CoverLetterData;
  onChange: (data: CoverLetterData) => void;
}

export const CoverLetterForm = ({ data, onChange }: CoverLetterFormProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Your Information</h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={data.personalInfo.fullName}
              onChange={(e) => onChange({
                ...data,
                personalInfo: { ...data.personalInfo, fullName: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.personalInfo.email}
              onChange={(e) => onChange({
                ...data,
                personalInfo: { ...data.personalInfo, email: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={data.personalInfo.phone}
              onChange={(e) => onChange({
                ...data,
                personalInfo: { ...data.personalInfo, phone: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={data.personalInfo.address}
              onChange={(e) => onChange({
                ...data,
                personalInfo: { ...data.personalInfo, address: e.target.value }
              })}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Recipient Information</h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={data.recipientInfo.companyName}
              onChange={(e) => onChange({
                ...data,
                recipientInfo: { ...data.recipientInfo, companyName: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="hiringManager">Hiring Manager</Label>
            <Input
              id="hiringManager"
              value={data.recipientInfo.hiringManager}
              onChange={(e) => onChange({
                ...data,
                recipientInfo: { ...data.recipientInfo, hiringManager: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="companyAddress">Company Address</Label>
            <Input
              id="companyAddress"
              value={data.recipientInfo.companyAddress}
              onChange={(e) => onChange({
                ...data,
                recipientInfo: { ...data.recipientInfo, companyAddress: e.target.value }
              })}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Letter Content</h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={data.date}
              onChange={(e) => onChange({ ...data, date: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="opening">Opening Paragraph</Label>
            <Textarea
              id="opening"
              value={data.content.opening}
              onChange={(e) => onChange({
                ...data,
                content: { ...data.content, opening: e.target.value }
              })}
              placeholder="Introduce yourself and state the position you're applying for..."
              className="min-h-[100px]"
            />
          </div>
          <div>
            <Label htmlFor="body">Body Paragraphs</Label>
            <Textarea
              id="body"
              value={data.content.body}
              onChange={(e) => onChange({
                ...data,
                content: { ...data.content, body: e.target.value }
              })}
              placeholder="Highlight your qualifications, experiences, and why you're a great fit..."
              className="min-h-[200px]"
            />
          </div>
          <div>
            <Label htmlFor="closing">Closing Paragraph</Label>
            <Textarea
              id="closing"
              value={data.content.closing}
              onChange={(e) => onChange({
                ...data,
                content: { ...data.content, closing: e.target.value }
              })}
              placeholder="Thank them for their consideration and express your enthusiasm..."
              className="min-h-[100px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

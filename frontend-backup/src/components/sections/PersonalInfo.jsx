import { useDispatch, useSelector } from 'react-redux';
import { Mail, Phone, MapPin, Link as LinkIcon, Globe, Briefcase } from 'lucide-react';
import { updatePersonal } from '@/store/resumeSlice';

export default function PersonalInfo() {
  const dispatch = useDispatch();
  const personal = useSelector((state) => state.resume.personal);

  const handleChange = (field, value) => {
    dispatch(updatePersonal({ [field]: value }));
  };

  const fields = [
    { label: 'First Name', field: 'firstName', icon: null, placeholder: 'John' },
    { label: 'Last Name', field: 'lastName', icon: null, placeholder: 'Doe' },
    { label: 'Professional Title', field: 'title', icon: Briefcase, placeholder: 'Senior Software Engineer' },
    { label: 'Email Address', field: 'email', icon: Mail, placeholder: 'john@example.com' },
    { label: 'Phone Number', field: 'phone', icon: Phone, placeholder: '+1 234 567 890' },
    { label: 'Location', field: 'location', icon: MapPin, placeholder: 'New York, USA' },
    { label: 'LinkedIn URL', field: 'linkedin', icon: LinkIcon, placeholder: 'linkedin.com/in/johndoe' },
    { label: 'Portfolio Website', field: 'portfolio', icon: Globe, placeholder: 'johndoe.com' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {fields.map(({ label, field, icon: Icon, placeholder }) => (
        <div key={field} className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-1.5">
            {Icon && <Icon className="w-3 h-3" />}
            {label}
          </label>
          <input
            type={field === 'email' ? 'email' : 'text'}
            className="form-input"
            placeholder={placeholder}
            value={personal[field]}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

import { CheckCircle, FileText, ClipboardList } from 'lucide-react';
import AnimatedSection from '../../../components/animations/AnimatedSection';

const RequirementsChecklist = ({ eligibility }) => {
  return (
    <AnimatedSection>
      <div className="space-y-6 animate-fade-in-up">
        {/* Admission Criteria - Inspired by image_1ec278.png */}
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-2xs">
          <h3 className="font-heading font-bold text-stone-800 text-lg mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-brand-primary" /> Admission Eligibility
          </h3>
          <ul className="space-y-4">
            {eligibility.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-stone-600 text-sm sm:text-base">
                <span className="text-brand-primary mt-0.5">✔</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Required Documents & Process - Inspired by image_1ec27e.png */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs">
            <h4 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-primary" /> Required Documents
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>• Original 10+2 Marksheet & Character Certificate</li>
              <li>• 10 SLC/SEE Marksheet</li>
              <li>• Citizenship Certificate / Passport (2 copies)</li>
              <li>• 4 PP-size photographs (white background)</li>
              <li>• Migration Certificate (if from another board)</li>
            </ul>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs">
            <h4 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#006A38]" /> Admission Process
            </h4>
            <ol className="space-y-2 text-xs text-stone-600 list-decimal pl-4">
              <li>Fill online application form.</li>
              <li>Attend written entrance examination.</li>
              <li>Merit-list published within 3 working days.</li>
            </ol>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default RequirementsChecklist;
import React from 'react';
import Chairman from "../../../assets/Leadership/Chairman.png";
import chief from "../../../assets/Leadership/Chief.png";
import principal from "../../../assets/Leadership/Principal.png";
import AnimatedSection from '../../animations/AnimatedSection';

const LeadershipTab = () => {
  const executives = [
    
    {
      name: "Dharma Neupane",
      role: "CAMPUS CHIEF",
      message: "I am absolutely glad to immerse in the depth of oceanic arena of academic universe to share my pleasures that Itahari Namuna College from its beginning has made a rapid progress for the holistic development of students and institution.",
      image: chief,
    },
    {
      name: "Mukti Raj Subedi",
      role: "PRINCIPAL",
      message: "Education to everyone is indispensable. At the same time, the concept that reading and writing is known as inappropriate in accordance with present newly modernized society. A good quality of education should be based on a good quality of teacher so as to enable students to easily understand and learn in this age.",
      image: principal
    },{
      name: "Keshav Khadka",
      role: "CHAIRMAN",
      message: "Welcome to Itahari Namuna College for the Pre-Level up to Master’s Level Academic Programs under the roof of Dynamic Management. This College is a vibrant and diverse academic centre focused on teaching, learning and helps to realize innovative knowledge in all wings.",
      image: Chairman, 
      isSpotlight: true
    }
  ];

  const chairman = executives.find(e => e.isSpotlight);
  const coreTeam = executives.filter(e => !e.isSpotlight);

  return (
    <AnimatedSection>
      <div className="w-full space-y-6 text-left relative z-10">
        
        {/* 1. CHAIRMAN SPOTLIGHT CARD - 4:8 GRADING SPLIT */}
        <div className=" sm:p-12 mx-auto bg-stone-50/40 backdrop-blur-md border border-stone-200/60 rounded-3xl overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
            
            {/* Image Block: Matches aspect ratio from image_2b795d.jpg */}
            <div className="md:col-span-4 min-h-60 md:h-auto w-full relative bg-stone-100">
              <img 
                src={chairman.image} 
                alt={chairman.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Text Block: Low-opacity branded Crimson-to-Navy background accent gradient */}
            <div className="md:col-span-8 p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-linear-to-br from-white/95 via-red-50/15 to-blue-900/10">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-sky-600 uppercase">
                {chairman.role}
              </span>
              <h2 className="font-heading font-bold text-stone-800 text-xl md:text-2xl mt-1 tracking-tight">
                {chairman.name}
              </h2>
              <p className="mt-3 font-body text-stone-600 text-sm leading-relaxed italic">
                "{chairman.message}"
              </p>
            </div>

          </div>
        </div>

        {/* 2. DUAL ROW SPLIT - ENHANCED h-64 PROFILE LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreTeam.map((member, idx) => (
            <div 
              key={idx}
              className="bg-stone-50/40 backdrop-blur-md border border-stone-200/60 rounded-3xl overflow-hidden shadow-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 items-stretch h-full">
                
                {/* Image Split - Bumped height up to h-64 for structural prominence */}
                <div className="sm:col-span-5 h-64 sm:h-auto min-h-75 relative bg-stone-100">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover object-center sm:absolute sm:inset-0"
                  />
                </div>

                {/* Text Split: Low-opacity branded Crimson-to-Navy background accent gradient */}
                <div className="sm:col-span-7 p-6 flex flex-col justify-center bg-linear-to-br from-white/95 via-red-50/10 to-blue-900/10">
                  <span className="text-[10px] font-bold tracking-wider text-sky-600 uppercase">
                    {member.role}
                  </span>
                  <h3 className="font-heading font-bold text-stone-800 text-base mt-1 tracking-tight">
                    {member.name}
                  </h3>
                  <p className="mt-2.5 font-body text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-6">
                    "{member.message}"
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </AnimatedSection>
  );
};

export default LeadershipTab;
"use client";
// ExperienceCard.tsx
import Image from "next/image";

type ExperienceItem = {
  company: string;
  position: string;
  location: string;
  date: string;
  logo: string;
  color: string;
  link: string;
  present: boolean;
  incoming: boolean;
};

export const ExperienceCard = ({ item }: { item: ExperienceItem }) => {
  const imageWrapperStyle = {
    backgroundColor: item.color,
  };

  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer">
      <div className="flex items-center justify-between">
        <div
          className="flex-shrink-0 rounded-lg p-0.5"
          style={imageWrapperStyle}
        >
          <Image
            src={item.logo}
            alt={`${item.company} logo`}
            width={40}
            height={40}
          />
        </div>
        <div className="ml-3 flex flex-grow flex-col justify-between">
          <span className="text-[15px] font-bold md:text-lg">
            {item.company}
            {item.present && (
              <span className="ml-1 rounded-lg bg-gray-200 px-2 pb-1 pt-1.5 text-sm font-normal text-text-light-body dark:bg-[#252525] dark:text-text-dark-headerDark">
                Present
              </span>
            )}
            {item.incoming && (
              <span className="ml-1 rounded-lg bg-gray-200 px-2 pb-1 pt-1.5 text-sm font-normal text-text-light-body dark:bg-[#252525] dark:text-text-dark-headerDark">
                Incoming
              </span>
            )}
          </span>
          <span className="text-[13px] dark:text-text-dark-body">
            {item.position}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[15px] md:text-lg">{item.location}</span>
          <span className="text-xs dark:text-text-dark-body md:text-sm">
            {item.date}
          </span>
        </div>
      </div>
    </a>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "" }) => {
  return (
    <nav className={`flex items-center text-sm text-gray-500 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight size={14} className="mx-2 text-gray-400 flex-shrink-0" />
            )}
            {item.path ? (
              <Link 
                to={item.path} 
                className="hover:text-black transition-colors flex items-center gap-1 hover:underline underline-offset-4"
              >
                {index === 0 && <Home size={14} className="mb-0.5" />}
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-black" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
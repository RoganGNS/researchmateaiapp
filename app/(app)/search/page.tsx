// File: /app/(app)/search/page.tsx
// ============================================================================
// Unified Search Page
// ============================================================================

import { PageHeader } from '../../../components/nav/Breadcrumbs';
import { Search } from 'lucide-react';

export default function SearchPage() {
  return (
    <div>
      <PageHeader
        title="Unified Knowledge Search"
        description="Search across external sources, your library, and canvas content"
      />

      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            className="block w-full pl-10 pr-3 py-4 border border-gray-300 dark:border-gray-600 
                     rounded-lg leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 
                     dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            placeholder="Search for research papers, documents, or canvas content..."
          />
        </div>

        <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
          <p>Start typing to search across all your knowledge sources</p>
        </div>
      </div>
    </div>
  );
}
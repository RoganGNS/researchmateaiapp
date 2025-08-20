// File: /app/(app)/library/page.tsx
// ============================================================================
// Library Page - Document Management
// ============================================================================

import { PageHeader } from '../../../components/nav/Breadcrumbs';
import { Card } from '../../../components/ui/Card';
import { FileText, Upload } from 'lucide-react';  // 移除未使用的 FolderOpen
import Link from 'next/link';
import { ROUTES } from '../../../lib/routes';

export default function LibraryPage() {
  return (
    <div>
      <PageHeader
        title="Document Library"
        description="Manage and organize your research documents"
        actions={
          <Link
            href={ROUTES.UPLOAD}
            className="inline-flex items-center px-4 py-2 border border-transparent 
                     text-sm font-medium rounded-md shadow-sm text-white 
                     bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
              Filters
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Document Type
                </label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option>All Types</option>
                  <option>Research Papers</option>
                  <option>Books</option>
                  <option>Reports</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Added
                </label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option>Any Time</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last Year</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Document Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Example document cards */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <FileText className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      Research Paper {i}.pdf
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Added 2 days ago
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      15 pages • 2.4 MB
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                    View
                  </button>
                  <button className="text-xs text-gray-600 dark:text-gray-400 hover:underline">
                    Download
                  </button>
                  <button className="text-xs text-gray-600 dark:text-gray-400 hover:underline">
                    Delete
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
// File: /app/(app)/canvas/page.tsx
// ============================================================================
// Research Canvas Page
// ============================================================================

import { PageHeader } from '../../../components/nav/Breadcrumbs';
import { Card } from '../../../components/ui/Card';
import { PenTool, Plus, Share2, Download } from 'lucide-react';

export default function CanvasPage() {
  return (
    <div>
      <PageHeader
        title="Research Canvas"
        description="Visual workspace for organizing and analyzing your research"
        actions={
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent 
                     text-sm font-medium rounded-md shadow-sm text-white 
                     bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Canvas
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Canvas Templates */}
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
            <PenTool className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            Blank Canvas
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Start with an empty canvas and build your research workspace
          </p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-center h-32 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mb-4">
            <Share2 className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            Literature Review
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Template optimized for comparing and analyzing multiple papers
          </p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-center h-32 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4">
            <Download className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            Research Proposal
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Structured template for organizing research proposals
          </p>
        </Card>
      </div>

      {/* Recent Canvases */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Recent Canvases
        </h2>
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  AI Ethics Research
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last edited 2 hours ago • 12 nodes • 3 collaborators
                </p>
              </div>
              <button className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
                Open
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
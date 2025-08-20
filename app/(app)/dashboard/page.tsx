//File: /app/(app)/dashboard/page.tsx
// ============================================================================
// Simplified Dashboard - 不再检查Profile
// ============================================================================

import { createServerClient } from '../../../lib/supabase/server';
import { Card } from '../../../components/ui/Card';
import { 
  FileText, 
  Search, 
  PenTool, 
  FolderOpen, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Sparkles,
  Users,
  Activity,
  Plus,
  Brain,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '../../../lib/routes';

// Stats interface
interface UserStats {
  documentCount: number;
  projectCount: number;
  canvasCount: number;
  weeklyActivity: number;
  collaborators: number;
  storageUsed: string;
}

/**
 * Dashboard page - 不再进行profile检查
 * Middleware已经确保用户有完整的profile才能访问此页面
 */
export default async function DashboardPage() {
  const supabase = await createServerClient();
  
  // 直接获取用户和profile，不需要检查
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();

  // Mock数据保持不变...
  const userStats: UserStats = {
    documentCount: 12,
    projectCount: 3,
    canvasCount: 5,
    weeklyActivity: 15,
    collaborators: 5,
    storageUsed: '2.4 GB'
  };

  const projects = [
    {
      id: '1',
      name: 'AI Ethics Research',
      description: 'Exploring ethical implications of artificial intelligence',
      lastActivity: '2 hours ago',
      documentCount: 8,
      collaborators: 3,
      progress: 65,
      aiSummary: 'Focus on bias detection algorithms and fairness metrics',
      suggestedAction: 'Review latest IEEE ethics guidelines',
      relatedResearch: 2
    },
    {
      id: '2',
      name: 'Climate Change Models',
      description: 'Analyzing climate prediction models accuracy',
      lastActivity: '1 day ago',
      documentCount: 15,
      collaborators: 5,
      progress: 40,
      aiSummary: 'Comparing IPCC models with recent satellite data',
      suggestedAction: 'Add recent Nature paper on tipping points',
      relatedResearch: 5
    },
    {
      id: '3',
      name: 'Quantum Computing Survey',
      description: 'Comprehensive survey of quantum algorithms',
      lastActivity: '3 days ago',
      documentCount: 6,
      collaborators: 2,
      progress: 25,
      aiSummary: 'Focusing on error correction methods',
      suggestedAction: 'Include IBM\'s latest quantum roadmap',
      relatedResearch: 3
    }
  ];

  const recentActivity = [
    { 
      id: '1', 
      type: 'upload',
      title: 'Uploaded "AI Research Methods.pdf"',
      project: 'AI Ethics Research',
      time: '2 hours ago',
      icon: FileText,
    },
    { 
      id: '2', 
      type: 'canvas',
      title: 'Created comparison canvas',
      project: 'Climate Change Models',
      time: '5 hours ago',
      icon: PenTool,
    },
    { 
      id: '3', 
      type: 'search',
      title: 'Found 3 new papers on quantum error correction',
      project: 'Quantum Computing Survey',
      time: 'Yesterday',
      icon: Search,
    },
  ];

  const quickActions = [
    {
      title: 'New Project',
      description: 'Start a new research project',
      href: ROUTES.PROJECT_NEW,
      icon: Plus,
      color: 'bg-indigo-500',
    },
    {
      title: 'Upload Document',
      description: 'Add PDFs to your library',
      href: ROUTES.UPLOAD,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Search Knowledge',
      description: 'Search across all sources',
      href: ROUTES.SEARCH,
      icon: Search,
      color: 'bg-green-500',
    },
    {
      title: 'AI Assistant',
      description: 'Get research insights',
      href: '#',
      icon: Brain,
      color: 'bg-purple-500',
    },
  ];

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Researcher';

  // 渲染逻辑保持不变...
  return (
    <div className="space-y-8">
      {/* Welcome Header with Stats */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-8 w-8" />
          <h1 className="text-3xl font-bold">
            Welcome back, {displayName}!
          </h1>
        </div>
        <p className="text-lg opacity-90 mb-6">
          Here&apos;s your research intelligence dashboard
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 text-white/80 mb-1">
              <FolderOpen className="h-4 w-4" />
              <span className="text-sm">Projects</span>
            </div>
            <p className="text-2xl font-bold">{userStats.projectCount}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 text-white/80 mb-1">
              <FileText className="h-4 w-4" />
              <span className="text-sm">Documents</span>
            </div>
            <p className="text-2xl font-bold">{userStats.documentCount}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 text-white/80 mb-1">
              <PenTool className="h-4 w-4" />
              <span className="text-sm">Canvases</span>
            </div>
            <p className="text-2xl font-bold">{userStats.canvasCount}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 text-white/80 mb-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">Collaborators</span>
            </div>
            <p className="text-2xl font-bold">{userStats.collaborators}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 text-white/80 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">This Week</span>
            </div>
            <p className="text-2xl font-bold">+{userStats.weeklyActivity}%</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 text-white/80 mb-1">
              <Activity className="h-4 w-4" />
              <span className="text-sm">Storage</span>
            </div>
            <p className="text-2xl font-bold">{userStats.storageUsed}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group"
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 h-full">
              <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {action.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Projects section - 保持不变 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Your Research Projects
          </h2>
          <Link
            href={ROUTES.PROJECTS}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View all projects
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {project.description}
                  </p>
                </div>
                <span className="text-xs text-gray-500">{project.lastActivity}</span>
              </div>

              {/* AI Summary */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <Brain className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-indigo-900 dark:text-indigo-300 mb-1">
                      AI Insight
                    </p>
                    <p className="text-xs text-indigo-700 dark:text-indigo-400">
                      {project.aiSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Suggested Action */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-green-900 dark:text-green-300 mb-1">
                      Suggested Action
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-400">
                      {project.suggestedAction}
                    </p>
                    {project.relatedResearch > 0 && (
                      <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                        {project.relatedResearch} new related papers found
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress and Stats */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-gray-900 dark:text-gray-100">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    {project.documentCount} documents
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {project.collaborators} collaborators
                  </span>
                </div>
              </div>

              <Link
                href={ROUTES.PROJECT_DETAIL(project.id)}
                className="mt-4 flex items-center justify-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Open Canvas
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity and AI Intelligence sections - 保持不变 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${activity.type === 'upload' ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
                    ${activity.type === 'canvas' ? 'bg-purple-100 dark:bg-purple-900/30' : ''}
                    ${activity.type === 'search' ? 'bg-green-100 dark:bg-green-900/30' : ''}
                  `}>
                    <activity.icon className={`h-5 w-5
                      ${activity.type === 'upload' ? 'text-blue-600 dark:text-blue-400' : ''}
                      ${activity.type === 'canvas' ? 'text-purple-600 dark:text-purple-400' : ''}
                      ${activity.type === 'search' ? 'text-green-600 dark:text-green-400' : ''}
                    `} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-gray-100">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.project}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Research Intelligence
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                  New Papers Alert
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  5 new papers match your AI Ethics research interests
                </p>
              </div>
              
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="text-sm font-medium text-purple-900 dark:text-purple-300 mb-1">
                  Citation Opportunity
                </h3>
                <p className="text-xs text-purple-700 dark:text-purple-400">
                  Your quantum computing paper could cite recent IBM breakthrough
                </p>
              </div>
              
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="text-sm font-medium text-green-900 dark:text-green-300 mb-1">
                  Collaboration Match
                </h3>
                <p className="text-xs text-green-700 dark:text-green-400">
                  Dr. Sarah Chen is working on similar climate models
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
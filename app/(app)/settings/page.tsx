// File: /app/(app)/settings/page.tsx
// ============================================================================
// Settings Page with Sub-navigation
// ============================================================================

import { PageHeader } from '../../../components/nav/Breadcrumbs';
import { Card } from '../../../components/ui/Card';
import { User, Shield, Bell, CreditCard, Key, Palette } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '../../../lib/routes';

const settingsCategories = [
  {
    title: 'General',
    description: 'Manage your account settings and preferences',
    icon: User,
    href: ROUTES.SETTINGS_GENERAL,
    color: 'bg-blue-500',
  },
  {
    title: 'Security',
    description: 'Password, two-factor authentication, and security preferences',
    icon: Shield,
    href: ROUTES.SETTINGS_SECURITY,
    color: 'bg-green-500',
  },
  {
    title: 'Notifications',
    description: 'Configure how and when you receive notifications',
    icon: Bell,
    href: ROUTES.SETTINGS_NOTIFICATIONS,
    color: 'bg-purple-500',
  },
  {
    title: 'Billing',
    description: 'Manage your subscription and payment methods',
    icon: CreditCard,
    href: ROUTES.SETTINGS_BILLING,
    color: 'bg-orange-500',
  },
  {
    title: 'API Keys',
    description: 'Manage API keys for integrations',
    icon: Key,
    href: ROUTES.SETTINGS_API,
    color: 'bg-red-500',
  },
  {
    title: 'Appearance',
    description: 'Customize the look and feel of the application',
    icon: Palette,
    href: '/app/settings/appearance',
    color: 'bg-indigo-500',
  },
];

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your account and application preferences"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsCategories.map((category) => (
          <Link key={category.href} href={category.href}>
            <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 h-full cursor-pointer">
              <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <category.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                {category.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {category.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Settings */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Quick Settings
        </h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Email Notifications
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive email updates about your research activity
                </p>
              </div>
              <button
                type="button"
                className="bg-indigo-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                role="switch"
                aria-checked="true"
              >
                <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Dark Mode
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use dark theme across the application
                </p>
              </div>
              <button
                type="button"
                className="bg-gray-200 dark:bg-indigo-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                role="switch"
                aria-checked="false"
              >
                <span className="translate-x-0 dark:translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Auto-save
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically save your work as you type
                </p>
              </div>
              <button
                type="button"
                className="bg-indigo-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                role="switch"
                aria-checked="true"
              >
                <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
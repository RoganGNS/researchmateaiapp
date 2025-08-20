// File: /components/auth/AuthForm.tsx
// ============================================================================
// Enterprise Auth Form Component - 企业级认证表单组件
// ============================================================================

'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

/**
 * 基础认证字段
 */
interface BaseAuthFields {
  email: string;
  password: string;
}

/**
 * 登录表单数据结构
 * 包含企业级应用常见的登录选项
 */
export interface LoginFormData extends BaseAuthFields {
  /** 记住登录状态 */
  rememberMe: boolean;
  /** 多因素认证码（可选） */
  mfaCode?: string;
  /** 登录来源追踪 */
  loginSource?: 'direct' | 'redirect' | 'session-expired';
}

/**
 * 注册表单数据结构
 * 包含完整的用户注册信息
 */
export interface RegisterFormData extends BaseAuthFields {
  /** 确认密码 */
  confirmPassword: string;
  /** 用户全名 */
  fullName: string;
  /** 组织/公司名称（可选） */
  organization?: string;
  /** 同意服务条款 */
  acceptTerms: boolean;
  /** 订阅营销邮件（可选） */
  subscribeToNewsletter?: boolean;
  /** 推荐人代码（可选） */
  referralCode?: string;
}

/**
 * 表单验证错误
 */
interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  organization?: string;
  acceptTerms?: string;
  mfaCode?: string;
}

/**
 * 认证表单组件属性基础接口
 */
interface AuthFormPropsBase {
  /** 加载状态 */
  isLoading: boolean;
  /** 表单错误信息 */
  errors?: FormErrors;
  /** 是否显示社交登录选项 */
  showSocialAuth?: boolean;
  /** 自定义提交按钮文本 */
  submitButtonText?: string;
}

/**
 * 登录表单属性
 */
interface LoginAuthFormProps extends AuthFormPropsBase {
  mode: 'login';
  onSubmit: (data: LoginFormData) => Promise<void>;
  /** 是否显示记住我选项 */
  showRememberMe?: boolean;
  /** 是否需要MFA */
  requireMFA?: boolean;
}

/**
 * 注册表单属性
 */
interface RegisterAuthFormProps extends AuthFormPropsBase {
  mode: 'register';
  onSubmit: (data: RegisterFormData) => Promise<void>;
  /** 服务条款链接 */
  termsUrl?: string;
  /** 隐私政策链接 */
  privacyUrl?: string;
  /** 是否需要组织信息 */
  requireOrganization?: boolean;
}

type AuthFormProps = LoginAuthFormProps | RegisterAuthFormProps;

/**
 * 企业级认证表单组件
 * 支持登录和注册两种模式，包含完整的表单验证和用户体验优化
 */
export function AuthForm(props: AuthFormProps) {
  const { mode, onSubmit, isLoading, errors = {} } = props;
  
  // 表单状态管理
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // 登录表单状态
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
    mfaCode: '',
    loginSource: 'direct',
  });
  
  // 注册表单状态
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    organization: '',
    acceptTerms: false,
    subscribeToNewsletter: false,
    referralCode: '',
  });

  /**
   * 处理表单提交
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (mode === 'login') {
      const submitData: LoginFormData = {
        ...loginData,
        loginSource: loginData.loginSource || 'direct',
      };
      await onSubmit(submitData);
    } else {
      await onSubmit(registerData);
    }
  };

  /**
   * 处理输入变化
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    if (mode === 'login') {
      setLoginData(prev => ({ ...prev, [name]: inputValue }));
    } else {
      setRegisterData(prev => ({ ...prev, [name]: inputValue }));
    }
  };

  /**
   * 获取当前表单数据
   */
  const formData = mode === 'login' ? loginData : registerData;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Email Field */}
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                     rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                     dark:bg-gray-700 dark:text-gray-100 sm:text-sm
                     disabled:opacity-50 disabled:cursor-not-allowed
                     aria-invalid:border-red-500 aria-invalid:focus:ring-red-500"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400" id="email-error">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Full Name Field (Register only) */}
      {mode === 'register' && (
        <div>
          <label 
            htmlFor="fullName" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Full name
          </label>
          <div className="mt-1">
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={registerData.fullName}
              onChange={handleInputChange}
              disabled={isLoading}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500
                       focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                       dark:bg-gray-700 dark:text-gray-100 sm:text-sm
                       disabled:opacity-50 disabled:cursor-not-allowed
                       aria-invalid:border-red-500 aria-invalid:focus:ring-red-500"
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400" id="fullName-error">
                {errors.fullName}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Organization Field (Register only, optional) */}
      {mode === 'register' && (props as RegisterAuthFormProps).requireOrganization && (
        <div>
          <label 
            htmlFor="organization" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Organization <span className="text-gray-500">(optional)</span>
          </label>
          <div className="mt-1">
            <input
              id="organization"
              name="organization"
              type="text"
              autoComplete="organization"
              value={registerData.organization}
              onChange={handleInputChange}
              disabled={isLoading}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500
                       focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                       dark:bg-gray-700 dark:text-gray-100 sm:text-sm
                       disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Acme Corp"
            />
          </div>
        </div>
      )}

      {/* Password Field */}
      <div>
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                     rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                     dark:bg-gray-700 dark:text-gray-100 sm:text-sm pr-10
                     disabled:opacity-50 disabled:cursor-not-allowed
                     aria-invalid:border-red-500 aria-invalid:focus:ring-red-500"
            placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••'}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400" id="password-error">
            {errors.password}
          </p>
        )}
        {mode === 'register' && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Password must contain:
            </p>
            <ul className="mt-1 text-xs text-gray-500 dark:text-gray-400 list-disc list-inside">
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
            </ul>
          </div>
        )}
      </div>

      {/* Confirm Password Field (Register only) */}
      {mode === 'register' && (
        <div>
          <label 
            htmlFor="confirmPassword" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Confirm password
          </label>
          <div className="mt-1 relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={registerData.confirmPassword}
              onChange={handleInputChange}
              disabled={isLoading}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500
                       focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                       dark:bg-gray-700 dark:text-gray-100 sm:text-sm pr-10
                       disabled:opacity-50 disabled:cursor-not-allowed
                       aria-invalid:border-red-500 aria-invalid:focus:ring-red-500"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              tabIndex={-1}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400" id="confirmPassword-error">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      )}

      {/* MFA Code Field (Login only, when required) */}
      {mode === 'login' && (props as LoginAuthFormProps).requireMFA && (
        <div>
          <label 
            htmlFor="mfaCode" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Two-factor authentication code
          </label>
          <div className="mt-1">
            <input
              id="mfaCode"
              name="mfaCode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={6}
              value={loginData.mfaCode}
              onChange={handleInputChange}
              disabled={isLoading}
              aria-invalid={!!errors.mfaCode}
              aria-describedby={errors.mfaCode ? 'mfaCode-error' : undefined}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500
                       focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                       dark:bg-gray-700 dark:text-gray-100 sm:text-sm
                       disabled:opacity-50 disabled:cursor-not-allowed
                       aria-invalid:border-red-500 aria-invalid:focus:ring-red-500"
              placeholder="000000"
            />
            {errors.mfaCode && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400" id="mfaCode-error">
                {errors.mfaCode}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Remember Me (Login only) */}
      {mode === 'login' && (props as LoginAuthFormProps).showRememberMe !== false && (
        <div className="flex items-center">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={loginData.rememberMe}
            onChange={handleInputChange}
            disabled={isLoading}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded
                     disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Remember me for 30 days
          </label>
        </div>
      )}

      {/* Terms and Conditions (Register only) */}
      {mode === 'register' && (
        <div className="space-y-4">
          <div className="flex items-start">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              required
              checked={registerData.acceptTerms}
              onChange={handleInputChange}
              disabled={isLoading}
              aria-invalid={!!errors.acceptTerms}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5
                       disabled:opacity-50 disabled:cursor-not-allowed
                       aria-invalid:border-red-500"
            />
            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              I agree to the{' '}
              <a 
                href={(props as RegisterAuthFormProps).termsUrl || '/terms'} 
                className="text-indigo-600 hover:text-indigo-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a 
                href={(props as RegisterAuthFormProps).privacyUrl || '/privacy'} 
                className="text-indigo-600 hover:text-indigo-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.acceptTerms}
            </p>
          )}

          <div className="flex items-start">
            <input
              id="subscribeToNewsletter"
              name="subscribeToNewsletter"
              type="checkbox"
              checked={registerData.subscribeToNewsletter}
              onChange={handleInputChange}
              disabled={isLoading}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5
                       disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label htmlFor="subscribeToNewsletter" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Send me product updates and newsletters
            </label>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                   shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600
                   transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
              {mode === 'login' ? 'Signing in...' : 'Creating account...'}
            </>
          ) : (
            props.submitButtonText || (mode === 'login' ? 'Sign in' : 'Create account')
          )}
        </button>
      </div>

      {/* Social Auth Options */}
      {props.showSocialAuth && (
        <div>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 
                         dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 
                         text-sm font-medium text-gray-500 dark:text-gray-300 
                         hover:bg-gray-50 dark:hover:bg-gray-600
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 
                         dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 
                         text-sm font-medium text-gray-500 dark:text-gray-300 
                         hover:bg-gray-50 dark:hover:bg-gray-600
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-2">GitHub</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
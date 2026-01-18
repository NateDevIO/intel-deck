import { useState, useEffect } from 'react';
import { X, Key, Eye, EyeOff, ExternalLink, Building2, Plus, Trash2 } from 'lucide-react';
import { Button } from './Button';

export function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  browserlessToken,
  onSaveBrowserlessToken,
  companyInfo,
  onSaveCompanyInfo,
  customFields,
  onSaveCustomFields
}) {
  const [key, setKey] = useState(apiKey || '');
  const [blToken, setBlToken] = useState(browserlessToken || '');
  const [showKey, setShowKey] = useState(false);
  const [showBlToken, setShowBlToken] = useState(false);
  const [activeTab, setActiveTab] = useState('api');
  const [company, setCompany] = useState(companyInfo || { name: '', description: '', strengths: '' });
  const [fields, setFields] = useState(customFields || []);
  const [newField, setNewField] = useState('');

  useEffect(() => {
    setKey(apiKey || '');
    setBlToken(browserlessToken || '');
    setCompany(companyInfo || { name: '', description: '', strengths: '' });
    setFields(customFields || []);
  }, [apiKey, browserlessToken, companyInfo, customFields, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(key);
    if (onSaveBrowserlessToken) onSaveBrowserlessToken(blToken);
    if (onSaveCompanyInfo) onSaveCompanyInfo(company);
    if (onSaveCustomFields) onSaveCustomFields(fields);
    onClose();
  };

  const addCustomField = () => {
    if (newField.trim() && !fields.includes(newField.trim())) {
      setFields([...fields, newField.trim()]);
      setNewField('');
    }
  };

  const removeCustomField = (field) => {
    setFields(fields.filter(f => f !== field));
  };

  const tabs = [
    { id: 'api', label: 'API Key' },
    { id: 'company', label: 'Your Company' },
    { id: 'fields', label: 'Custom Fields' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* API Key Tab */}
          {activeTab === 'api' && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Claude API Key
                  </div>
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="sk-ant-..."
                    className="w-full px-4 py-2 pr-10 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Your API key is stored locally in your browser and never sent to our servers.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Don't have an API key?{' '}
                  <a
                    href="https://console.anthropic.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                  >
                    Get one from Anthropic
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>

              {/* Browserless Token */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Browserless Token (Optional)
                  </div>
                </label>
                <div className="relative">
                  <input
                    type={showBlToken ? 'text' : 'password'}
                    value={blToken}
                    onChange={(e) => setBlToken(e.target.value)}
                    placeholder="Your Browserless.io token..."
                    className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowBlToken(!showBlToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showBlToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Used as fallback for JavaScript-heavy sites that Jina can't render.{' '}
                  <a
                    href="https://www.browserless.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                  >
                    Get free token (1000 req/mo)
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            </>
          )}

          {/* Company Info Tab */}
          {activeTab === 'company' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Add your company information to generate personalized SWOT analyses and talking points.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={company.name}
                  onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  placeholder="Acme Inc."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={company.description}
                  onChange={(e) => setCompany({ ...company, description: e.target.value })}
                  placeholder="What does your company do?"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Strengths
                </label>
                <textarea
                  value={company.strengths}
                  onChange={(e) => setCompany({ ...company, strengths: e.target.value })}
                  placeholder="What makes your product/service unique?"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          )}

          {/* Custom Fields Tab */}
          {activeTab === 'fields' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Add custom fields to extract from competitor pages (e.g., "security certifications", "compliance standards").
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newField}
                  onChange={(e) => setNewField(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomField()}
                  placeholder="Add a custom field..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Button onClick={addCustomField} disabled={!newField.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {fields.length > 0 ? (
                <div className="space-y-2">
                  {fields.map((field, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">{field}</span>
                      <button
                        onClick={() => removeCustomField(field)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">
                  No custom fields added yet
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

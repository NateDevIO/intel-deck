import { useState, useRef, useEffect } from 'react';
import {
  Download,
  ChevronDown,
  FileText,
  MessageSquare,
  FileJson,
  FileImage,
  Check,
  Copy
} from 'lucide-react';
import { Button } from '../common/Button';
import {
  generateMarkdown,
  generateSlackMessage,
  generateJSON,
  generateBattlecardHTML
} from '../../utils/exportTemplates';

export function ExportMenu({ analysis, onExportComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = async (format) => {
    let content;

    switch (format) {
      case 'markdown':
        content = generateMarkdown(analysis);
        break;
      case 'slack':
        content = generateSlackMessage(analysis);
        break;
      case 'json':
        content = generateJSON(analysis);
        break;
      default:
        return;
    }

    await navigator.clipboard.writeText(content);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);

    if (onExportComplete) {
      onExportComplete(format, 'copy');
    }
  };

  const handleDownloadJSON = () => {
    const content = generateJSON(analysis);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${analysis.companyName.toLowerCase().replace(/\s+/g, '-')}-analysis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsOpen(false);
    if (onExportComplete) {
      onExportComplete('json', 'download');
    }
  };

  const handleDownloadPDF = () => {
    const html = generateBattlecardHTML(analysis);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for fonts to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };

    setIsOpen(false);
    if (onExportComplete) {
      onExportComplete('pdf', 'download');
    }
  };

  const exportOptions = [
    {
      id: 'markdown',
      label: 'Copy as Markdown',
      description: 'For Notion, docs, wikis',
      icon: FileText,
      action: () => handleCopy('markdown')
    },
    {
      id: 'slack',
      label: 'Copy for Slack',
      description: 'Formatted for messaging',
      icon: MessageSquare,
      action: () => handleCopy('slack')
    },
    {
      id: 'json',
      label: 'Copy as JSON',
      description: 'Structured data',
      icon: FileJson,
      action: () => handleCopy('json')
    },
    { type: 'divider' },
    {
      id: 'json-download',
      label: 'Download JSON',
      description: 'Save to file',
      icon: Download,
      action: handleDownloadJSON
    },
    {
      id: 'pdf',
      label: 'Print / Save PDF',
      description: 'Print-ready format',
      icon: FileImage,
      action: handleDownloadPDF
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-1"
      >
        <Download className="w-4 h-4" />
        Export
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Export Options
            </p>
          </div>

          {exportOptions.map((option, idx) => {
            if (option.type === 'divider') {
              return <div key={idx} className="my-2 border-t border-gray-100" />;
            }

            const Icon = option.icon;
            const isCopied = copied === option.id;

            return (
              <button
                key={option.id}
                onClick={option.action}
                className="w-full px-3 py-2 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                  ${isCopied ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}
                `}>
                  {isCopied ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isCopied ? 'text-green-600' : 'text-gray-900'}`}>
                    {isCopied ? 'Copied!' : option.label}
                  </p>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

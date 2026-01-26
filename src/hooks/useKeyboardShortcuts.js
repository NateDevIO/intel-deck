import { useEffect, useCallback } from 'react';

export function useKeyboardShortcuts({
  onNewAnalysis,
  onSave,
  onFocusSearch,
  onCloseModal,
  onToggleExport,
  onShowHelp,
  canSave = false,
  isModalOpen = false
}) {
  const handleKeyDown = useCallback((e) => {
    // Don't trigger shortcuts when typing in inputs (except for Escape)
    const isInputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);

    // Escape - close modals (always works)
    if (e.key === 'Escape') {
      if (isModalOpen && onCloseModal) {
        e.preventDefault();
        onCloseModal();
      }
      return;
    }

    // Don't process other shortcuts when typing in inputs
    if (isInputFocused) return;

    const isMod = e.ctrlKey || e.metaKey;

    // ? - Show keyboard shortcuts help
    if (e.key === '?' && !isMod) {
      e.preventDefault();
      onShowHelp?.();
      return;
    }

    // Ctrl/Cmd + N - New analysis
    if (isMod && e.key === 'n') {
      e.preventDefault();
      onNewAnalysis?.();
      return;
    }

    // Ctrl/Cmd + S - Save current analysis
    if (isMod && e.key === 's') {
      e.preventDefault();
      if (canSave) {
        onSave?.();
      }
      return;
    }

    // Ctrl/Cmd + E - Toggle export menu
    if (isMod && e.key === 'e') {
      e.preventDefault();
      onToggleExport?.();
      return;
    }

    // / - Focus search (when not in input)
    if (e.key === '/' && !isMod) {
      e.preventDefault();
      onFocusSearch?.();
      return;
    }
  }, [onNewAnalysis, onSave, onFocusSearch, onCloseModal, onToggleExport, onShowHelp, canSave, isModalOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

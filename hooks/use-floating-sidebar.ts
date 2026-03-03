'use client';

import { useState, useCallback, useRef } from 'react';

export function useFloatingSidebar(collapseDelay = 400) {
  const [activeItem, setActiveItem] = useState<string>('documents');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    clearTimer();
    setIsExpanded(true);
  }, [clearTimer]);

  const handleMouseLeave = useCallback(() => {
    // Don't collapse if a popover is open
    if (isUserMenuOpen || isWorkspaceMenuOpen) return;
    clearTimer();
    collapseTimer.current = setTimeout(() => {
      setIsExpanded(false);
    }, collapseDelay);
  }, [collapseDelay, clearTimer, isUserMenuOpen, isWorkspaceMenuOpen]);

  const handleNavClick = useCallback((id: string) => {
    setActiveItem(id);
  }, []);

  // When popovers close, trigger collapse check
  const handleUserMenuChange = useCallback(
    (open: boolean) => {
      setIsUserMenuOpen(open);
      if (!open) {
        collapseTimer.current = setTimeout(() => {
          setIsExpanded(false);
        }, collapseDelay);
      }
    },
    [collapseDelay],
  );

  const handleWorkspaceMenuChange = useCallback(
    (open: boolean) => {
      setIsWorkspaceMenuOpen(open);
      if (!open) {
        collapseTimer.current = setTimeout(() => {
          setIsExpanded(false);
        }, collapseDelay);
      }
    },
    [collapseDelay],
  );

  return {
    activeItem,
    isExpanded,
    isUserMenuOpen,
    isWorkspaceMenuOpen,
    handleNavClick,
    handleMouseEnter,
    handleMouseLeave,
    setActiveItem,
    setIsUserMenuOpen: handleUserMenuChange,
    setIsWorkspaceMenuOpen: handleWorkspaceMenuChange,
  };
}

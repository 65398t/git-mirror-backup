// Scrollable wrapper that shows transparent triangle indicators instead of scrollbars
import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import { useTheme, alpha } from '@mui/material/styles';

interface ScrollContainerProps {
  children: ReactNode;
  maxHeight?: number | string;
  sx?: Record<string, unknown>;
}

export default function ScrollContainer({ children, maxHeight = 400, sx }: ScrollContainerProps) {
  const theme = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 2;
    setCanScrollUp(el.scrollTop > threshold);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - threshold);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      observer.disconnect();
    };
  }, [checkScroll]);

  // Re-check when children change
  useEffect(() => {
    checkScroll();
  }, [children, checkScroll]);

  const indicatorColor = alpha(theme.palette.text.primary, 0.4);

  const triangleBase = {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    pointerEvents: 'none' as const,
    zIndex: 2,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.short,
    }),
  };

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      {/* Triangle indicator top */}
      <Box
        sx={{
          ...triangleBase,
          top: 0,
          background: `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 0.9)}, transparent)`,
          opacity: canScrollUp ? 1 : 0,
        }}
      >
        <Box
          sx={{
            width: 0,
            height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderBottom: `12px solid ${indicatorColor}`,
          }}
        />
      </Box>

      {/* Scrollable content */}
      <Box
        ref={scrollRef}
        sx={{
          maxHeight,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {children}
      </Box>

      {/* Triangle indicator bottom */}
      <Box
        sx={{
          ...triangleBase,
          bottom: 0,
          background: `linear-gradient(to top, ${alpha(theme.palette.background.paper, 0.9)}, transparent)`,
          opacity: canScrollDown ? 1 : 0,
        }}
      >
        <Box
          sx={{
            width: 0,
            height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: `12px solid ${indicatorColor}`,
          }}
        />
      </Box>
    </Box>
  );
}

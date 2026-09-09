'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function CustomScrollbar() {
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Disable custom scrollbar on mobile / touch-only devices
    if (
      typeof window === 'undefined' ||
      window.innerWidth < 768 ||
      ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches)
    ) {
      return;
    }

    const scrollbar = scrollbarRef.current;
    const thumb = thumbRef.current;
    if (!scrollbar || !thumb) return;

    let hideTimer: ReturnType<typeof setTimeout>;
    let isDragging = false;
    let dragStartY = 0;
    let dragStartScroll = 0;

    function getTarget() {
      // 1. Try explicit admin scroll container
      const adminEl = document.getElementById('admin-main-scroll');
      if (adminEl && adminEl.scrollHeight > adminEl.clientHeight) {
        const rect = adminEl.getBoundingClientRect();
        return {
          isWindow: false,
          element: adminEl,
          scrollTop: adminEl.scrollTop,
          viewport: adminEl.clientHeight,
          scrollHeight: adminEl.scrollHeight,
          topOffset: Math.max(8, rect.top + 6),
          trackHeight: rect.height - 12,
        };
      }

      // 2. Check any other overflow container
      const anyContainer = document.querySelector('[data-admin-scroll="true"], .admin-theme main.overflow-y-auto') as HTMLElement | null;
      if (anyContainer && anyContainer.scrollHeight > anyContainer.clientHeight) {
        const rect = anyContainer.getBoundingClientRect();
        return {
          isWindow: false,
          element: anyContainer,
          scrollTop: anyContainer.scrollTop,
          viewport: anyContainer.clientHeight,
          scrollHeight: anyContainer.scrollHeight,
          topOffset: Math.max(8, rect.top + 6),
          trackHeight: rect.height - 12,
        };
      }

      // 3. Fall back to window / document
      const doc = document.documentElement;
      const body = document.body;
      const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
      const viewport = window.innerHeight;
      const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);

      return {
        isWindow: true,
        element: null,
        scrollTop,
        viewport,
        scrollHeight,
        topOffset: 8,
        trackHeight: viewport - 16,
      };
    }

    function update() {
      if (!scrollbar || !thumb) return;
      const target = getTarget();

      const maxScroll = target.scrollHeight - target.viewport;
      if (maxScroll <= 2 || target.trackHeight <= 0) {
        scrollbar.classList.remove('visible');
        return;
      }

      scrollbar.style.top = `${target.topOffset}px`;
      scrollbar.style.height = `${target.trackHeight}px`;

      const thumbHeight = Math.max(
        36,
        Math.min(target.trackHeight, (target.viewport / target.scrollHeight) * target.trackHeight)
      );

      const maxThumbTravel = target.trackHeight - thumbHeight;
      const thumbTop = maxScroll > 0 ? (target.scrollTop / maxScroll) * maxThumbTravel : 0;

      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${Math.max(0, Math.min(maxThumbTravel, thumbTop))}px)`;
    }

    function flashScrollbar() {
      if (!scrollbar) return;
      scrollbar.classList.add('visible');
      clearTimeout(hideTimer);

      if (!isDragging) {
        hideTimer = setTimeout(() => {
          if (!isDragging && scrollbar) {
            scrollbar.classList.remove('visible');
          }
        }, 850);
      }
    }

    function onScroll() {
      update();
      flashScrollbar();
    }

    function onThumbMouseDown(e: MouseEvent) {
      e.preventDefault();
      e.stopPropagation();

      isDragging = true;
      dragStartY = e.clientY;

      const target = getTarget();
      dragStartScroll = target.scrollTop;

      document.body.classList.add('select-none');
      scrollbar?.classList.add('visible');
      clearTimeout(hideTimer);

      function onMouseMove(ev: MouseEvent) {
        if (!isDragging) return;
        ev.preventDefault();

        const curTarget = getTarget();
        const deltaY = ev.clientY - dragStartY;
        const thumbHeight = parseFloat(thumb?.style.height || '36');
        const maxThumbTravel = curTarget.trackHeight - thumbHeight;
        const maxScroll = curTarget.scrollHeight - curTarget.viewport;

        if (maxThumbTravel > 0 && maxScroll > 0) {
          const scrollDelta = (deltaY / maxThumbTravel) * maxScroll;
          const nextScroll = Math.max(0, Math.min(maxScroll, dragStartScroll + scrollDelta));

          if (curTarget.element) {
            curTarget.element.scrollTop = nextScroll;
          } else {
            window.scrollTo(0, nextScroll);
          }
          update();
        }
      }

      function onMouseUp() {
        isDragging = false;
        document.body.classList.remove('select-none');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        flashScrollbar();
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    function onTrackClick(e: MouseEvent) {
      if (e.target === thumb) return;
      if (!scrollbar) return;

      const rect = scrollbar.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const target = getTarget();
      const thumbHeight = parseFloat(thumb?.style.height || '36');
      const maxThumbTravel = target.trackHeight - thumbHeight;
      const maxScroll = target.scrollHeight - target.viewport;

      if (maxThumbTravel > 0 && maxScroll > 0) {
        const targetThumbTop = Math.max(0, Math.min(maxThumbTravel, clickY - thumbHeight / 2));
        const targetScroll = (targetThumbTop / maxThumbTravel) * maxScroll;

        if (target.element) {
          target.element.scrollTo({ top: targetScroll, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
      }
    }

    // Capture scrolling globally
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    window.addEventListener('resize', onScroll);

    thumb.addEventListener('mousedown', onThumbMouseDown);
    scrollbar.addEventListener('click', onTrackClick);

    // Initial sync
    update();
    const t1 = setTimeout(update, 100);
    const t2 = setTimeout(update, 400);

    const observer = new ResizeObserver(() => {
      update();
    });

    const adminEl = document.getElementById('admin-main-scroll');
    if (adminEl) {
      observer.observe(adminEl);
    }
    observer.observe(document.body);

    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
      thumb.removeEventListener('mousedown', onThumbMouseDown);
      scrollbar.removeEventListener('click', onTrackClick);
      observer.disconnect();
      clearTimeout(hideTimer);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isAdmission =
      pathname?.startsWith('/admission-portal') ||
      pathname?.startsWith('/admission') ||
      window.location.hostname.startsWith('admission.');

    if (scrollbarRef.current) {
      if (isAdmission) {
        scrollbarRef.current.classList.add('admission-scrollbar');
      } else {
        scrollbarRef.current.classList.remove('admission-scrollbar');
      }
    }
  }, [pathname]);

  return (
    <div
      ref={scrollbarRef}
      className="custom-scrollbar"
      id="customScrollbar"
      aria-hidden="true"
    >
      <div className="custom-scrollbar-track">
        <div
          ref={thumbRef}
          className="custom-scrollbar-thumb"
          id="customScrollbarThumb"
        />
      </div>
    </div>
  );
}

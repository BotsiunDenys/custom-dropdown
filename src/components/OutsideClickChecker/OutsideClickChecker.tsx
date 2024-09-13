import React, { useRef, useEffect } from "react";

// Hook that alerts clicks outside of the passed ref

function useOutsideAlerter(
  ref: React.RefObject<HTMLDivElement>,
  actionFn: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        actionFn();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

interface Props {
  children: React.ReactNode;
  actionFn: () => void;
}

// component that checks outside click

function OutsideClickChecker({ children, actionFn }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef, actionFn);

  return (
    <div style={{ width: "100%" }} ref={wrapperRef}>
      {children}
    </div>
  );
}

export default OutsideClickChecker;

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const getSessionId = () => {
  let sid = sessionStorage.getItem("sr_sid");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("sr_sid", sid);
  }
  return sid;
};

export const usePageTracking = () => {
  const location = useLocation();
  const lastPath = useRef("");

  useEffect(() => {
    const path = location.pathname;
    if (path === lastPath.current) return;
    lastPath.current = path;

    // Don't track admin pages
    if (path.toLowerCase().includes("rajputadmin")) return;

    supabase.from("page_views").insert({
      path,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      session_id: getSessionId(),
    }).then(() => {});
  }, [location.pathname]);
};

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  try {
    // Get all users who have weekly report enabled
    const { data: prefs, error: prefsError } = await supabase
      .from('email_preferences')
      .select('user_id')
      .eq('weekly_report_enabled', true);

    if (prefsError) throw prefsError;
    if (!prefs || prefs.length === 0) {
      return new Response(JSON.stringify({ message: 'No users opted in' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userIds = prefs.map(p => p.user_id);
    let sent = 0;

    for (const userId of userIds) {
      // Get user email
      const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
      if (userError || !user?.email) continue;

      // Get display name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', userId)
        .single();

      const displayName = profile?.display_name || 'there';

      // Get gamification data
      const { data: gamification } = await supabase
        .from('user_gamification')
        .select('total_xp')
        .eq('user_id', userId)
        .single();

      const totalXP = gamification?.total_xp || 0;

      // Get habits and calculate weekly stats
      const { data: habits } = await supabase
        .from('habits')
        .select('completed_days, goal, name')
        .eq('user_id', userId);

      const today = new Date();
      const currentDay = today.getDate();
      const weekStart = Math.max(1, currentDay - 6);
      let completed = 0;
      let total = 0;
      const habitCount = habits?.length || 0;

      if (habits) {
        for (let d = weekStart; d <= currentDay; d++) {
          total += habits.length;
          completed += habits.filter(h => (h.completed_days as number[]).includes(d)).length;
        }
      }

      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      let grade: string;
      let gradeColor: string;
      let message: string;
      if (percentage >= 95) { grade = "A+"; gradeColor = "#22c55e"; message = "Absolutely unstoppable! 🏆"; }
      else if (percentage >= 85) { grade = "A"; gradeColor = "#22c55e"; message = "Crushing it! Keep going! 💪"; }
      else if (percentage >= 75) { grade = "B+"; gradeColor = "#3b82f6"; message = "Great week! Building momentum! 🚀"; }
      else if (percentage >= 65) { grade = "B"; gradeColor = "#3b82f6"; message = "Solid effort! Room to grow! 🌱"; }
      else if (percentage >= 50) { grade = "C"; gradeColor = "#eab308"; message = "Halfway there! Push harder! ⚡"; }
      else { grade = "D"; gradeColor = "#ef4444"; message = "Fresh start this week! You've got this! 💫"; }

      // Get login streak
      const todayStr = today.toISOString().split('T')[0];
      const { data: loginData } = await supabase
        .from('daily_logins')
        .select('streak_count')
        .eq('user_id', userId)
        .order('login_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      const loginStreak = loginData?.streak_count || 0;

      const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#1a1d2e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:500px;margin:0 auto;padding:32px 20px;">
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="color:#50c8a8;font-size:24px;margin:0;">Superoutine</h1>
      <p style="color:#8b8fa3;font-size:13px;margin-top:4px;">Your Weekly Report Card</p>
    </div>
    <div style="background:#222640;border-radius:16px;padding:28px;border:1px solid #2d3154;">
      <p style="color:#c8cad4;font-size:15px;margin:0 0 20px;">Hey ${displayName}! 👋</p>
      <div style="text-align:center;margin:24px 0;">
        <div style="display:inline-block;width:80px;height:80px;border-radius:16px;background:${gradeColor}20;line-height:80px;">
          <span style="font-size:36px;font-weight:800;color:${gradeColor};">${grade}</span>
        </div>
        <p style="color:#c8cad4;font-size:14px;margin-top:12px;">${message}</p>
      </div>
      <div style="background:#1a1d2e;border-radius:12px;padding:16px;margin:20px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#8b8fa3;font-size:12px;padding:6px 0;">Habits Completed</td>
            <td style="color:#c8cad4;font-size:14px;font-weight:600;text-align:right;">${completed}/${total} (${percentage}%)</td>
          </tr>
          <tr>
            <td style="color:#8b8fa3;font-size:12px;padding:6px 0;">Total XP</td>
            <td style="color:#50c8a8;font-size:14px;font-weight:600;text-align:right;">⚡ ${totalXP}</td>
          </tr>
          <tr>
            <td style="color:#8b8fa3;font-size:12px;padding:6px 0;">Login Streak</td>
            <td style="color:#f59e0b;font-size:14px;font-weight:600;text-align:right;">🔥 ${loginStreak} days</td>
          </tr>
          <tr>
            <td style="color:#8b8fa3;font-size:12px;padding:6px 0;">Active Habits</td>
            <td style="color:#c8cad4;font-size:14px;font-weight:600;text-align:right;">${habitCount}</td>
          </tr>
        </table>
      </div>
      <div style="text-align:center;margin-top:24px;">
        <a href="https://routine-bloom-web.lovable.app/dashboard" style="display:inline-block;background:#50c8a8;color:#1a1d2e;font-weight:700;padding:12px 32px;border-radius:10px;text-decoration:none;font-size:14px;">
          Open Dashboard →
        </a>
      </div>
    </div>
    <p style="color:#5a5e73;font-size:11px;text-align:center;margin-top:20px;">
      You're receiving this because you opted in to weekly reports.<br/>
      Manage preferences in Settings.
    </p>
  </div>
</body>
</html>`;

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Superoutine <onboarding@resend.dev>',
          to: [user.email],
          subject: `📊 Your Weekly Report Card: ${grade} (${percentage}%)`,
          html: emailHtml,
        }),
      });

      if (res.ok) sent++;
      else {
        const errText = await res.text();
        console.error(`Failed to send to ${user.email}: ${errText}`);
      }
    }

    return new Response(JSON.stringify({ success: true, sent }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending weekly reports:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

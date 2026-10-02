import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type Row = Record<string, any>;

const call = async (action: string, body?: object) => {
  const token = (await supabase.auth.getSession()).data.session?.access_token;
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=${action}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json;
};

const inr = (n: number) => `$${Number(n || 0).toFixed(2)}`;
const d = (s: string) => new Date(s).toLocaleString();

const AdminMoney = ({ users, onChanged }: { users: { id: string; email: string }[]; onChanged: () => void }) => {
  const [data, setData] = useState<{ payments: Row[]; referrals: Row[]; earnings: Row[]; payouts: Row[] }>({ payments: [], referrals: [], earnings: [], payouts: [] });
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [plan, setPlan] = useState("Pro monthly");
  const [students, setStudents] = useState<Row[]>([]);
  const loadStudents = useCallback(async () => {
    try { setStudents((await call("students")).requests); } catch (e: any) { toast.error(e.message); }
  }, []);
  useEffect(() => { loadStudents(); }, [loadStudents]);
  const decide = async (id: string, status: string) => {
    try { await call("student-decision", { id, status }); toast.success(`Student request ${status}`); loadStudents(); }
    catch (e: any) { toast.error(e.message); }
  };

  const load = useCallback(async () => {
    try { setData(await call("money")); } catch (e: any) { toast.error(e.message); }
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, [load]);

  const record = async () => {
    if (!userId || !(Number(amount) > 0)) return toast.error("Pick a user and enter an amount");
    try {
      await call("record-payment", { userId, amount: Number(amount), plan });
      toast.success("Payment recorded, user upgraded to Pro");
      setAmount(""); load(); onChanged();
    } catch (e: any) { toast.error(e.message); }
  };

  const setStatus = async (id: string, status: string) => {
    try { await call("update-payout", { id, status }); toast.success(`Payout marked ${status}`); load(); onChanged(); }
    catch (e: any) { toast.error(e.message); }
  };

  const revenue = data.payments.reduce((a, p) => a + Number(p.amount), 0);
  const commission = data.earnings.reduce((a, e) => a + Number(e.amount), 0);
  const pending = data.payouts.filter(p => p.status === "pending").reduce((a, p) => a + Number(p.amount), 0);
  const paid = data.payouts.filter(p => p.status === "paid").reduce((a, p) => a + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[["Revenue", inr(revenue)], ["Commission owed", inr(commission)], ["Payouts pending", inr(pending)], ["Paid out", inr(paid)], ["Referrals", data.referrals.length]].map(([k, v]) => (
          <Card key={k as string} className="border-border/50"><CardContent className="p-4"><div className="text-2xl font-bold font-display">{v}</div><div className="text-xs text-muted-foreground mt-1">{k}</div></CardContent></Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">Record an offline payment (in USD — gives 1 month of Pro, inviter gets 10%). Razorpay payments appear automatically.</CardTitle></CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-2">
          <select value={userId} onChange={e => setUserId(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm flex-1">
            <option value="">Select user…</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.email}</option>)}
          </select>
          <Input value={plan} onChange={e => setPlan(e.target.value)} placeholder="Plan" className="md:w-40" />
          <Input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount $" type="number" className="md:w-32" />
          <Button onClick={record}>Record payment</Button>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">Student price requests ($2.49/month once approved)</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>User</TableHead><TableHead>School</TableHead><TableHead>Student ID</TableHead><TableHead>Sent</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {students.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No student requests yet</TableCell></TableRow>}
              {students.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="text-sm">{r.email}</TableCell>
                  <TableCell className="text-sm">{r.school}</TableCell>
                  <TableCell className="text-xs">{r.student_id || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d(r.created_at)}</TableCell>
                  <TableCell><Badge variant={r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : "secondary"}>{r.status}</Badge></TableCell>
                  <TableCell className="text-right space-x-1">
                    {r.status !== "approved" && <Button size="sm" onClick={() => decide(r.id, "approved")}>Approve</Button>}
                    {r.status !== "rejected" && <Button size="sm" variant="outline" onClick={() => decide(r.id, "rejected")}>Reject</Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">Payout requests</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Amount</TableHead><TableHead>Bank</TableHead><TableHead>Requested</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {data.payouts.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No payout requests yet</TableCell></TableRow>}
              {data.payouts.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="text-sm">{p.email}</TableCell>
                  <TableCell className="font-semibold">{inr(p.amount)}</TableCell>
                  <TableCell className="text-xs">{p.account_holder}<br />A/C {p.account_number}<br />IFSC {p.ifsc}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d(p.created_at)}</TableCell>
                  <TableCell><Badge variant={p.status === "paid" ? "default" : p.status === "rejected" ? "destructive" : "secondary"}>{p.status}</Badge></TableCell>
                  <TableCell className="text-right space-x-1">
                    {p.status === "pending" && <>
                      <Button size="sm" onClick={() => setStatus(p.id, "paid")}>Mark paid</Button>
                      <Button size="sm" variant="outline" onClick={() => setStatus(p.id, "rejected")}>Reject</Button>
                    </>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base">Payments</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Plan</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
              <TableBody>
                {data.payments.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No payments yet</TableCell></TableRow>}
                {data.payments.map(p => <TableRow key={p.id}><TableCell className="text-sm">{p.email}</TableCell><TableCell className="text-sm">{p.plan}{p.razorpay_payment_id && <div className="text-[10px] text-muted-foreground">Razorpay {p.razorpay_payment_id}</div>}</TableCell><TableCell>{inr(p.amount)}</TableCell><TableCell className="text-xs text-muted-foreground">{d(p.created_at)}</TableCell></TableRow>)}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base">Who invited whom</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Inviter</TableHead><TableHead>Friend</TableHead><TableHead>Earned</TableHead><TableHead>Joined</TableHead></TableRow></TableHeader>
              <TableBody>
                {data.referrals.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No referrals yet</TableCell></TableRow>}
                {data.referrals.map(r => {
                  const earned = data.earnings.filter(e => e.referred_id === r.referred_id).reduce((a, e) => a + Number(e.amount), 0);
                  return <TableRow key={r.id}><TableCell className="text-sm">{r.referrer_email}</TableCell><TableCell className="text-sm">{r.referred_email}</TableCell><TableCell>{inr(earned)}</TableCell><TableCell className="text-xs text-muted-foreground">{d(r.created_at)}</TableCell></TableRow>;
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMoney;

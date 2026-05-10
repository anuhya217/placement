"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Difficulty, Problem, ProblemCategory, Profile } from "@/types";
import {
  adminCreateProblem,
  adminCreateSqlQuestion,
  adminDeleteProblem,
  adminDeleteSqlQuestion,
  adminSetUserRole,
} from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const pillars: ProblemCategory[] = [
  "Arrays",
  "Strings",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Greedy",
  "Recursion",
];

export function AdminPanel({
  problems,
  sqlQuestions,
  users,
}: {
  problems: Problem[];
  sqlQuestions: {
    id: string;
    title: string;
    category: string;
    difficulty: string;
  }[];
  users: Profile[];
}) {
  const router = useRouter();
  const [pTitle, setPTitle] = useState("");
  const [pSlug, setPSlug] = useState("");
  const [pCat, setPCat] = useState<ProblemCategory>("Arrays");
  const [pDiff, setPDiff] = useState<Difficulty>("Medium");
  const [pDesc, setPDesc] = useState("");
  const [pStatement, setPStatement] = useState("");
  const [pInput, setPInput] = useState("");
  const [pOutput, setPOutput] = useState("");
  const [pSamples, setPSamples] = useState("");
  const [pConstraints, setPConstraints] = useState("");
  const [pLcUrl, setPLcUrl] = useState("");
  const [pTips, setPTips] = useState("");

  const [sTitle, setSTitle] = useState("");
  const [sCat, setSCat] = useState("Window Functions");
  const [sDiff, setSDiff] = useState<Difficulty>("Medium");
  const [sQ, setSQ] = useState("");
  const [sSol, setSSol] = useState("");
  const [sExp, setSExp] = useState("");

  async function addProblem(e: FormEvent) {
    e.preventDefault();
    try {
      await adminCreateProblem({
        category: pCat,
        title: pTitle,
        slug: pSlug || pTitle.toLowerCase().replace(/\s+/g, "-"),
        difficulty: pDiff,
        description: pDesc,
        problem_statement: pStatement || undefined,
        input_format: pInput || undefined,
        output_format: pOutput || undefined,
        sample_io: pSamples || undefined,
        constraints_text: pConstraints || undefined,
        leetcode_url: pLcUrl || undefined,
        interviewer_tips: pTips || undefined,
      });
      toast.success("Problem added");
      router.refresh();
      setPTitle("");
      setPSlug("");
      setPDesc("");
      setPStatement("");
      setPInput("");
      setPOutput("");
      setPSamples("");
      setPConstraints("");
      setPLcUrl("");
      setPTips("");
    } catch {
      toast.error("Could not add problem");
    }
  }

  async function addSql(e: FormEvent) {
    e.preventDefault();
    try {
      await adminCreateSqlQuestion({
        category: sCat,
        title: sTitle,
        difficulty: sDiff,
        questionText: sQ,
        solutionSql: sSol,
        explanation: sExp,
      });
      toast.success("SQL question added");
      router.refresh();
      setSTitle("");
      setSQ("");
      setSSol("");
      setSExp("");
    } catch {
      toast.error("Could not add SQL question");
    }
  }

  return (
    <div className="space-y-10">
      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader>
          <CardTitle>Add DSA problem</CardTitle>
          <CardDescription>Shown instantly to all learners.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={addProblem} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="pt">Title</Label>
              <Input id="pt" value={pTitle} onChange={(e) => setPTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ps">Slug (unique)</Label>
              <Input id="ps" value={pSlug} onChange={(e) => setPSlug(e.target.value)} placeholder="auto from title if empty" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={pCat} onValueChange={(v) => setPCat(v as ProblemCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pillars.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={pDiff} onValueChange={(v) => setPDiff(v as Difficulty)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Easy", "Medium", "Hard"] as const).map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="pd">Short list description</Label>
              <Textarea id="pd" rows={2} value={pDesc} onChange={(e) => setPDesc(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="pst">Problem statement</Label>
              <Textarea
                id="pst"
                rows={4}
                value={pStatement}
                onChange={(e) => setPStatement(e.target.value)}
                placeholder="Interview-style wording"
              />
            </div>
            <div className="space-y-2 md:col-span-2 md:grid md:grid-cols-2 md:gap-4">
              <div className="space-y-2">
                <Label htmlFor="pIn">Input format</Label>
                <Textarea id="pIn" rows={2} value={pInput} onChange={(e) => setPInput(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pOut">Output format</Label>
                <Textarea id="pOut" rows={2} value={pOutput} onChange={(e) => setPOutput(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="pSamp">Sample I/O</Label>
              <Textarea id="pSamp" rows={4} value={pSamples} onChange={(e) => setPSamples(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="pCon">Constraints</Label>
              <Textarea id="pCon" rows={2} value={pConstraints} onChange={(e) => setPConstraints(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="pLc">LeetCode URL (optional if slug matches)</Label>
              <Input
                id="pLc"
                value={pLcUrl}
                onChange={(e) => setPLcUrl(e.target.value)}
                placeholder="https://leetcode.com/problems/..."
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="pTip">Interview tips</Label>
              <Textarea id="pTip" rows={2} value={pTips} onChange={(e) => setPTips(e.target.value)} />
            </div>
            <Button type="submit" className="md:col-span-2">
              Publish problem
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader>
          <CardTitle>DSA inventory</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problems.map((x) => (
                <TableRow key={x.id}>
                  <TableCell>{x.title}</TableCell>
                  <TableCell>{x.category}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        if (!confirm("Delete this problem?")) return;
                        try {
                          await adminDeleteProblem(x.id);
                          toast.success("Deleted");
                          router.refresh();
                        } catch {
                          toast.error("Delete failed");
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader>
          <CardTitle>Add SQL question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addSql} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="st">Title</Label>
                <Input id="st" value={sTitle} onChange={(e) => setSTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sc">Category label</Label>
                <Input id="sc" value={sCat} onChange={(e) => setSCat(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={sDiff} onValueChange={(v) => setSDiff(v as Difficulty)}>
                <SelectTrigger className="max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Easy", "Medium", "Hard"] as const).map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sq">Prompt</Label>
              <Textarea id="sq" rows={4} value={sQ} onChange={(e) => setSQ(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sol">Solution SQL</Label>
              <Textarea id="sol" rows={4} value={sSol} onChange={(e) => setSSol(e.target.value)} required className="font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sex">Explanation</Label>
              <Textarea id="sex" rows={3} value={sExp} onChange={(e) => setSExp(e.target.value)} />
            </div>
            <Button type="submit">Publish SQL item</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader>
          <CardTitle>SQL inventory</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sqlQuestions.map((x) => (
                <TableRow key={x.id}>
                  <TableCell>{x.title}</TableCell>
                  <TableCell>{x.category}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        if (!confirm("Delete?")) return;
                        try {
                          await adminDeleteSqlQuestion(x.id);
                          toast.success("Deleted");
                          router.refresh();
                        } catch {
                          toast.error("Delete failed");
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Promote trusted operators to admin.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.full_name}</TableCell>
                  <TableCell className="text-zinc-500">{u.email}</TableCell>
                  <TableCell>
                    <Select
                      value={u.role}
                      onValueChange={async (role) => {
                        try {
                          await adminSetUserRole(
                            u.id,
                            role as "student" | "admin"
                          );
                          toast.success("Role updated");
                          router.refresh();
                        } catch {
                          toast.error("Could not update role");
                        }
                      }}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">student</SelectItem>
                        <SelectItem value="admin">admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

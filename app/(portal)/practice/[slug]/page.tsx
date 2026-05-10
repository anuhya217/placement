import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Lightbulb, Database, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { sqlQuestions } from "@/data/sqlQuestions";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PracticeDetailPage(props: PageProps) {
  const params = await props.params;
  const question = sqlQuestions.find((q) => q.slug === params.slug);

  if (!question) {
    notFound();
  }

  const difficultyColors = {
    Easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Hard: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4 text-zinc-500">
          <Link href="/sql">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Practice
          </Link>
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{question.title}</h1>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Badge variant="outline" className={difficultyColors[question.difficulty]}>
                {question.difficulty}
              </Badge>
              <Badge variant="secondary">{question.category}</Badge>
            </div>
          </div>
          <Button asChild size="lg" className="shrink-0 gap-2">
            <a href={question.leetcode_url} target="_blank" rel="noopener noreferrer">
              Solve on LeetCode <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code2 className="h-5 w-5 text-blue-500" />
                Problem Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {question.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-500" />
                Sample Schema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="rounded-md bg-zinc-950 p-4 border dark:border-zinc-800">
                <pre className="text-sm font-mono text-zinc-100 whitespace-pre-wrap">
                  {question.schema_sql}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags & Companies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2 text-zinc-500">SQL Concepts</h4>
                <div className="flex flex-wrap gap-2">
                  {question.sql_concepts.map((concept) => (
                    <Badge key={concept} variant="outline" className="bg-blue-500/5 text-blue-600 dark:text-blue-400">
                      {concept}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2 text-zinc-500">Company Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {question.company_tags.map((company) => (
                    <Badge key={company} variant="secondary">
                      {company}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {question.hints && question.hints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Hints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {question.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Lightbulb,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Mail,
  Building2,
  User,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Submission } from "@/types";

const STATUS_CONFIG: Record<
  Submission["status"],
  { label: string; color: string; bg: string }
> = {
  pending: { label: "Pending", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
  reviewing: { label: "Reviewing", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  call_scheduled: { label: "Call Scheduled", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
  selected: { label: "Selected", color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/20" },
  building: { label: "Building", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  completed: { label: "Completed", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
  declined: { label: "Declined", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as Submission["status"][];

function StatusBadge({ status }: { status: Submission["status"] }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.bg,
        config.color,
      )}
    >
      {config.label}
    </span>
  );
}

function StatCard({
  label,
  count,
  icon: Icon,
  color,
}: {
  label: string;
  count: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="mt-1 text-3xl font-bold text-white">{count}</p>
        </div>
        <div className={cn("rounded-xl p-3", color)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

function SubmissionRow({
  submission,
  isExpanded,
  onToggle,
}: {
  submission: Submission;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const date = new Date(submission.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/20 transition-colors overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-white truncate">
              {submission.idea_title}
            </h3>
            <StatusBadge status={submission.status} />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {submission.full_name}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {submission.email}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {date}
            </span>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500 shrink-0" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 px-5 py-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailField label="Role" value={submission.role} />
                <DetailField label="Company" value={submission.company} />
                <DetailField
                  label="Target Audience"
                  value={submission.target_audience}
                />
                <DetailField
                  label="Business Model"
                  value={submission.business_model}
                />
                <DetailField
                  label="Referral Source"
                  value={submission.referral_source}
                />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 mb-1">
                  Description
                </p>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {submission.idea_description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium text-gray-400">{label}</p>
      <p className="text-sm text-gray-200">{value}</p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-white/10" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-white/5"
            />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl bg-white/5"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Submission["status"] | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchSubmissions() {
    try {
      const res = await fetch("/api/submissions");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSubmissions(data);
    } catch {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchSubmissions();
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    fetchSubmissions();
  }

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      !search ||
      s.idea_title.toLowerCase().includes(search.toLowerCase()) ||
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    active: submissions.filter((s) =>
      ["reviewing", "call_scheduled", "selected", "building"].includes(s.status),
    ).length,
    completed: submissions.filter((s) => s.status === "completed").length,
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white font-[var(--font-space)]">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Track and manage idea submissions
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={cn("h-4 w-4", refreshing && "animate-spin")}
            />
            Refresh
          </button>
        </motion.div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Submissions"
            count={stats.total}
            icon={Lightbulb}
            color="bg-cyan-500/20"
          />
          <StatCard
            label="Pending Review"
            count={stats.pending}
            icon={Clock}
            color="bg-yellow-500/20"
          />
          <StatCard
            label="In Progress"
            count={stats.active}
            icon={Building2}
            color="bg-blue-500/20"
          />
          <StatCard
            label="Completed"
            count={stats.completed}
            icon={CheckCircle2}
            color="bg-green-500/20"
          />
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or idea..."
              className="w-full rounded-lg bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as Submission["status"] | "all")
              }
              className="appearance-none rounded-lg bg-white/5 border border-white/10 pl-10 pr-10 py-2.5 text-sm text-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_CONFIG[s].label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </motion.div>

        {/* Submissions List */}
        <div className="mt-6 space-y-3">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center rounded-2xl bg-white/5 border border-white/10 py-16"
            >
              {submissions.length === 0 ? (
                <>
                  <Lightbulb className="h-12 w-12 text-gray-600" />
                  <p className="mt-4 text-lg font-medium text-gray-400">
                    No submissions yet
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Ideas will appear here once someone submits one.
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="h-12 w-12 text-gray-600" />
                  <p className="mt-4 text-lg font-medium text-gray-400">
                    No matching submissions
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter.
                  </p>
                </>
              )}
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((submission) => (
                <SubmissionRow
                  key={submission.id}
                  submission={submission}
                  isExpanded={expandedId === submission.id}
                  onToggle={() =>
                    setExpandedId(
                      expandedId === submission.id ? null : submission.id,
                    )
                  }
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {filtered.length > 0 && (
          <p className="mt-4 text-center text-xs text-gray-500">
            Showing {filtered.length} of {submissions.length} submission
            {submissions.length !== 1 && "s"}
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";

interface PointTransaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string | Date | null;
}

interface PointsHistoryProps {
  transactions: PointTransaction[];
}

const getTypeIcon = (type: string, amount: number) => {
  if (amount > 0)
    return (
      <ArrowUpRight
        className="h-4 w-4 text-green-500"
        aria-label="Points earned"
      />
    );
  return (
    <ArrowDownLeft
      className="h-4 w-4 text-red-500"
      aria-label="Points spent"
    />
  );
};

export function PointsHistory({ transactions }: PointsHistoryProps) {
  if (transactions.length === 0) {
    return (
      <Empty className="p-8">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Clock className="h-8 w-8 opacity-50" />
          </EmptyMedia>
          <EmptyTitle>No transactions yet</EmptyTitle>
          <EmptyDescription>
            Your points history will appear here once you start earning or
            spending points.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ScrollArea className="h-[300px] w-full pr-4">
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${tx.amount > 0 ? 'bg-green-100/50 dark:bg-green-900/20' : 'bg-red-100/50 dark:bg-red-900/20'}`}>
                {getTypeIcon(tx.type, tx.amount)}
              </div>
              <div>
                <p className="font-medium text-sm">{tx.description}</p>
                <p className="text-xs text-muted-foreground">
                    {tx.createdAt ? format(new Date(tx.createdAt), 'MMM d, yyyy h:mm a') : '-'}
                </p>
              </div>
            </div>
            <div className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {tx.amount > 0 ? '+' : ''}{tx.amount} pts
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

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
  if (amount > 0) return <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />;
  return <ArrowDownLeft className="h-4 w-4 text-rose-600 dark:text-rose-400" aria-hidden="true" />;
};

export function PointsHistory({ transactions }: PointsHistoryProps) {
  if (transactions.length === 0) {
    return (
      <Empty className="py-8 border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Clock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No transactions yet</EmptyTitle>
          <EmptyDescription>
            Your loyalty points history and activity will appear here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ScrollArea className="h-[300px] w-full pr-4">
      <div className="space-y-4" role="list" aria-label="Points transaction history">
        {transactions.map((tx) => {
          const isPositive = tx.amount > 0;
          const formattedDate = tx.createdAt ? format(new Date(tx.createdAt), 'MMM d, yyyy h:mm a') : '';
          const ariaLabel = `${tx.description}. ${isPositive ? 'Earned' : 'Spent'} ${Math.abs(tx.amount)} points. ${formattedDate}`;

          return (
            <div
              key={tx.id}
              role="listitem"
              aria-label={ariaLabel}
              className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isPositive ? 'bg-emerald-100/50 dark:bg-emerald-900/20' : 'bg-rose-100/50 dark:bg-rose-900/20'}`}>
                  {getTypeIcon(tx.type, tx.amount)}
                </div>
                <div>
                  <p className="font-medium text-sm">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {tx.createdAt ? format(new Date(tx.createdAt), 'MMM d, yyyy h:mm a') : '-'}
                  </p>
                </div>
              </div>
              <div className={`font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {isPositive ? '+' : ''}{tx.amount} pts
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

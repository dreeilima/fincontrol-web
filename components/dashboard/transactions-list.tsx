"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowUpRight,
  CheckCircle2Icon,
  CircleDollarSignIcon,
  UserIcon,
  XCircleIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

// Dados temporários para exemplo
const subscriptions = [
  {
    id: "1",
    user: {
      name: "João Silva",
      email: "joao@email.com",
    },
    plan: "PRO",
    status: "ACTIVE",
    amount: 29.9,
    lastPayment: new Date("2024-03-05"),
  },
  {
    id: "2",
    user: {
      name: "Maria Santos",
      email: "maria@email.com",
    },
    plan: "BASIC",
    status: "PENDING",
    amount: 19.9,
    lastPayment: new Date("2024-03-10"),
  },
  {
    id: "3",
    user: {
      name: "Pedro Costa",
      email: "pedro@email.com",
    },
    plan: "PRO",
    status: "ACTIVE",
    amount: 29.9,
    lastPayment: new Date("2024-03-15"),
  },
  {
    id: "4",
    user: {
      name: "Ana Oliveira",
      email: "ana@email.com",
    },
    plan: "BASIC",
    status: "CANCELLED",
    amount: 19.9,
    lastPayment: new Date("2024-03-01"),
  },
];

interface TransactionsListProps {
  className?: string;
}

export default function TransactionsList({ className }: TransactionsListProps) {
  return (
    <Card className={`xl:col-span-2 ${className || ""}`}>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Assinaturas Recentes</CardTitle>
          <CardDescription className="text-balance">
            Últimas assinaturas e renovações do sistema
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="ml-auto gap-1">
          <Link href="/admin/subscriptions" className="flex items-center gap-2">
            <span>Ver Todas</span>
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">
                Último Pagamento
              </TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserIcon className="size-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{sub.user.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:block">
                        {sub.user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{sub.plan}</Badge>
                </TableCell>
                <TableCell>
                  {sub.status === "ACTIVE" ? (
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle2Icon className="size-4" />
                      <span>Ativo</span>
                    </div>
                  ) : sub.status === "PENDING" ? (
                    <div className="flex items-center gap-2 text-yellow-500">
                      <CircleDollarSignIcon className="size-4" />
                      <span>Pendente</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-500">
                      <XCircleIcon className="size-4" />
                      <span>Cancelado</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDistanceToNow(sub.lastPayment, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  R$ {sub.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

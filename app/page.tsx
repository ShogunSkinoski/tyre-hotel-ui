'use client'
import { useRouter } from "next/navigation";
import TransactionsPage from "./transactions/page";

export default function Main() {
  const router = useRouter();
  router.push('/transactions');
  return <TransactionsPage />;
}


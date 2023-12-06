import React from "react";
import Link from "next/link";
import connectDB from "./practice/InsertQuestions/insert";

export default function Home() {
  connectDB();
  return (
    <Link href="/practice" className="text-black">
      Practice
    </Link>
  );
}

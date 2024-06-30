'use client'
import React, { useState } from "react";
import { Minigame } from "../Components/Minigame";
import Link from "next/link";

export default function Page({ params }: { params: { page: number} }) {
  console.log("rendering new page")
  return <Minigame page = {params.page} />;
}

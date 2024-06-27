'use client'
import React, { useState } from "react";
import { Minigame } from "../Components/Minigame";
import Link from "next/link";

export default function Page({ params }: { params: { page: number} }) {
  console.log(typeof params.page)
  return <Minigame page = {params.page} />;
}

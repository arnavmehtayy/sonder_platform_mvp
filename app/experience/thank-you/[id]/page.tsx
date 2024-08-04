'use client'

import React from 'react';
import { useParams } from 'next/navigation';

export default function Thank_you_page({id}: {id: number}) {
    const params = useParams();
    return (
        <main>
            <style>{`body, html { touch-action: auto;
    overflow-y: scroll;
    overflow: auto;
    height: 100%;
  width: 100%; }`}</style>

            <h1> Thank you! </h1>
            <h1> {params.id} </h1>
        </main>
    );
}
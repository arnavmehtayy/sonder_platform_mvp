'use client'

import React from 'react';
import { useParams } from 'next/navigation';

export default function Thank_you_page() {
    const params = useParams();
    const id = params.id as string;

    return (
        <main>
            <style>{`body, html { 
                touch-action: auto;
                overflow-y: scroll;
                overflow: auto;
                height: 100%;
                width: 100%; 
            }`}</style>

            <h1>Thank you!</h1>
            <h1>{id}</h1>
        </main>
    );
}
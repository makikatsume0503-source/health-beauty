'use client';

import React from 'react';

export default function DebugPage() {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '';
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
    const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '';

    return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1>Environment Variable Debugger</h1>
            <p>Please take a screenshot of this page.</p>

            <div style={{ background: '#f0f0f0', padding: '1rem', marginTop: '1rem', borderRadius: '8px' }}>
                <div>
                    <strong>Project ID:</strong> {projectId}
                    <br />
                    (Expected: health-beauty-83533)
                </div>
                <hr style={{ margin: '1rem 0' }} />
                <div>
                    <strong>API Key Status:</strong>
                    <ul>
                        <li>Loaded: {apiKey ? 'YES' : 'NO'}</li>
                        <li>Length: {apiKey.length} characters</li>
                        <li>First 4 chars: "{apiKey.substring(0, 4)}"</li>
                        <li>Last 4 chars: "{apiKey.substring(apiKey.length - 4)}"</li>
                    </ul>
                </div>
                <hr style={{ margin: '1rem 0' }} />
                <div>
                    <strong>Auth Domain:</strong> {authDomain}
                </div>
            </div>

            <p style={{ marginTop: '2rem', color: 'red' }}>
                Note: If the API Key starts with a quote (") or has a length different from ~39, that's the issue!
            </p>
        </div>
    );
}

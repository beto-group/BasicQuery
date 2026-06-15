/**
 * UNIVERSAL QUERY CORE
 * 
 * Provides an Abstracted Storage Interface for Hybrid Data Queries.
 * Parses standard Obsidian search syntax into a JSON AST, and routes
 * queries simultaneously to Local WASM/Datacore and Remote Cloud servers.
 */

// 1. AST Parser
export function parseObsidianQuery(queryStr) {
    if (!queryStr || typeof queryStr !== 'string') return { type: 'ALL' };

    const ast = {
        type: 'AND',
        conditions: []
    };

    // Very basic regex tokenization for: key:"value" or -key:value
    // Real implementation would use a proper tokenizer
    const regex = /(-)?([a-zA-Z]+):("([^"]+)"|([^\s]+))/g;
    let match;

    while ((match = regex.exec(queryStr)) !== null) {
        const isNot = match[1] === '-';
        const key = match[2].toLowerCase();
        const value = match[4] || match[5];

        let condition = {
            type: key, // 'path', 'tag', 'file', etc.
            value: value,
            exact: !!match[4] // If quotes were used, it's exact
        };

        if (isNot) {
            condition = { type: 'NOT', condition };
        }

        ast.conditions.push(condition);
    }

    if (ast.conditions.length === 0) {
        // Fallback: treat as raw text search
        return { type: 'TEXT', value: queryStr };
    }

    if (ast.conditions.length === 1) return ast.conditions[0];
    return ast;
}

import { LocalDatacoreProvider } from "./providers/LocalDatacoreProvider.js";
import { PassiveCloudWasmAdapter } from "./providers/PassiveCloudWasmAdapter.js";
import { GoogleDriveAdapter } from "./providers/GoogleDriveAdapter.js";

// 4. Federated Hook
export function createUniversalHook(dc) {
    const { useState, useEffect } = dc;
    const localProvider = new LocalDatacoreProvider(dc);
    const passiveWasmProvider = new PassiveCloudWasmAdapter();
    const gDriveProvider = new GoogleDriveAdapter();

    return function useUniversalQuery(obsidianQueryString, options = { local: true, cloud: false, gdrive: true }) {
        const [cloudResults, setCloudResults] = useState([]);
        const [gDriveResults, setGDriveResults] = useState([]);
        const [isCloudLoading, setIsCloudLoading] = useState(false);
        const [isGDriveLoading, setIsGDriveLoading] = useState(false);

        // Parse query to AST
        const ast = parseObsidianQuery(obsidianQueryString);

        // 1. LOCAL EXECUTION (Reactive Obsidian Datacore)
        const localSyntax = localProvider.executeQuery(ast);
        const localPages = options.local ? dc.useQuery(localSyntax) : [];

        // 2. PASSIVE CLOUD EXECUTION (Local WASM engine pulling from mock Dropbox)
        useEffect(() => {
            if (options.cloud && obsidianQueryString) {
                setIsCloudLoading(true);
                passiveWasmProvider.executeQueryAsync(ast).then(res => {
                    const mappedPages = res.map(path => ({ path, value: (prop) => prop === "$link" ? path : "WASM" }));
                    setCloudResults(mappedPages);
                    setIsCloudLoading(false);
                }).catch(err => {
                    console.error("[UniversalQuery] WASM Cloud error:", err);
                    setIsCloudLoading(false);
                });
            } else {
                setCloudResults([]);
            }
        }, [obsidianQueryString, options.cloud]);

        // 3. TERABYTE CLOUD EXECUTION (Native Google Drive API Translation)
        useEffect(() => {
            if (options.gdrive && obsidianQueryString) {
                setIsGDriveLoading(true);
                gDriveProvider.executeQueryAsync(ast).then(res => {
                    const mappedPages = res.map(path => ({ path, value: (prop) => prop === "$link" ? path : "GDRIVE API" }));
                    setGDriveResults(mappedPages);
                    setIsGDriveLoading(false);
                }).catch(err => {
                    console.error("[UniversalQuery] GDrive API error:", err);
                    setIsGDriveLoading(false);
                });
            } else {
                setGDriveResults([]);
            }
        }, [obsidianQueryString, options.gdrive]);

        // MERGE / FEDERATE
        const combined = [...localPages, ...cloudResults, ...gDriveResults];

        return {
            pages: combined,
            isCloudLoading: isCloudLoading || isGDriveLoading,
            ast,
            localSyntax
        };
    };
}

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

// 2. Storage Providers
class LocalDatacoreProvider {
    constructor(dc) {
        this.dc = dc; // Obsidian Datacore instance
    }

    // Convert AST back to Datacore syntax for execution inside Obsidian
    astToDatacoreSyntax(ast) {
        if (ast.type === 'ALL') return '@page';
        if (ast.type === 'TEXT') return `@page`; // Simple text search needs custom handling
        
        if (ast.type === 'AND') {
            return '@page and ' + ast.conditions.map(c => this.astToDatacoreSyntax(c)).join(' and ');
        }
        if (ast.type === 'NOT') {
            return `!(${this.astToDatacoreSyntax(ast.condition)})`;
        }
        
        if (ast.type === 'path') {
            return `path("${ast.value}")`;
        }
        if (ast.type === 'tag') {
            return `tag("${ast.value.replace('#', '')}")`;
        }
        
        return `@page`;
    }

    executeQuery(ast) {
        // Return a mock or real Datacore query string.
        // The actual execution in React happens via `dc.useQuery`, 
        // so the provider just constructs the native string for now.
        return this.astToDatacoreSyntax(ast);
    }
}

class RemoteCloudProvider {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    async executeQueryAsync(ast) {
        // Stub for remote API call
        console.log(`[RemoteCloud] Executing AST remotely:`, ast);
        // return await fetch(this.endpoint, { method: 'POST', body: JSON.stringify(ast) });
        return []; 
    }
}

// 3. Federated Hook
export function createUniversalHook(dc) {
    const { useState, useEffect } = dc;
    const localProvider = new LocalDatacoreProvider(dc);
    const remoteProvider = new RemoteCloudProvider("https://api.datacore.cloud/query");

    return function useUniversalQuery(obsidianQueryString, options = { local: true, cloud: true }) {
        const [cloudResults, setCloudResults] = useState([]);
        const [isCloudLoading, setIsCloudLoading] = useState(false);

        // Parse query to AST
        const ast = parseObsidianQuery(obsidianQueryString);

        // 1. LOCAL EXECUTION (Reactive)
        // We use Datacore's native reactive hook for local files
        const localSyntax = localProvider.executeQuery(ast);
        const localPages = options.local ? dc.useQuery(localSyntax) : [];

        // 2. CLOUD EXECUTION (Async)
        useEffect(() => {
            if (options.cloud && obsidianQueryString) {
                setIsCloudLoading(true);
                remoteProvider.executeQueryAsync(ast).then(res => {
                    setCloudResults(res);
                    setIsCloudLoading(false);
                }).catch(err => {
                    console.error("[UniversalQuery] Cloud error:", err);
                    setIsCloudLoading(false);
                });
            } else {
                setCloudResults([]);
            }
        }, [obsidianQueryString, options.cloud]);

        // 3. MERGE / FEDERATE
        // Here we would deduplicate results based on file paths or IDs
        const combined = [...localPages, ...cloudResults];

        return {
            pages: combined,
            isCloudLoading,
            ast,
            localSyntax
        };
    };
}

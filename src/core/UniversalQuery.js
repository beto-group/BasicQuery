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

class PassiveCloudWasmAdapter {
    constructor() {
        this.engine = null;
        this.isReady = false;
        this.init();
    }

    async init() {
        try {
            // Dynamically import the compiled WASM Datacore Engine
            // Assuming we bundle or serve the datacore-wasm-engine pkg here
            const wasm = await import("../../../../plugins/datacore-wasm-engine/pkg/datacore_wasm_engine.js");
            await wasm.default();
            this.engine = new wasm.DatacoreEngine();
            this.isReady = true;
            console.log("[PassiveCloud] WASM Datacore Engine initialized.");
            
            // Mock fetching from Dropbox/iCloud
            this.syncPassiveStorage();
        } catch (e) {
            console.error("[PassiveCloud] WASM init failed:", e);
        }
    }

    syncPassiveStorage() {
        if (!this.engine) return;
        // Mocking a passive storage sync from Dropbox
        const mockFiles = [
            { path: "/iCloud/Vault/_OPERATION/MissionAlpha.md", content: "#alpha Operation starting today." },
            { path: "/Dropbox/Datacore/secret.md", content: "Top secret #status-done" }
        ];

        mockFiles.forEach(file => {
            this.engine.ingest_file(file.path, file.content);
        });
        console.log("[PassiveCloud] Synced 2 files from passive storage into WASM index.");
    }

    async executeQueryAsync(ast) {
        if (!this.isReady || !this.engine) {
            console.warn("[PassiveCloud] Engine not ready.");
            return [];
        }
        
        // Serialize AST to JSON and pass into Rust WASM engine
        const astJson = JSON.stringify(ast);
        console.log(`[PassiveCloud] Executing AST in WASM:`, astJson);
        
        const resultJson = this.engine.execute_query(astJson);
        return JSON.parse(resultJson);
    }
}

class GoogleDriveAdapter {
    constructor(accessToken) {
        this.accessToken = accessToken || "mock_token";
    }

    astToGoogleDriveQuery(ast) {
        if (ast.type === 'ALL') return "trashed=false";
        if (ast.type === 'TEXT') return `fullText contains '${ast.value.replace(/'/g, "\\'")}'`;
        
        if (ast.type === 'AND') {
            return ast.conditions.map(c => this.astToGoogleDriveQuery(c)).join(' and ');
        }
        if (ast.type === 'NOT') {
            return `not (${this.astToGoogleDriveQuery(ast.condition)})`;
        }
        
        if (ast.type === 'path') {
            // Google Drive uses 'name' for filenames and 'parents' for folders,
            // so path matching is an approximation using name/fullText.
            return `name contains '${ast.value}' or fullText contains '${ast.value}'`;
        }
        if (ast.type === 'tag') {
            // Google Drive doesn't index metadata natively, so we search text for the tag.
            return `fullText contains '#${ast.value}'`;
        }
        
        return "trashed=false";
    }

    async executeQueryAsync(ast) {
        const q = this.astToGoogleDriveQuery(ast);
        console.log(`[GoogleDriveAdapter] Translated AST to GDrive Query:`, q);
        
        // Mock API Fetch against Google Drive API
        // In reality: fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}`)
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(`[GoogleDriveAdapter] Mock fetch returned 1 result for: ${q}`);
                resolve([
                    "/Google Drive/Datacore/Project " + (ast.value || "Result") + ".md"
                ]);
            }, 600); // simulate network latency
        });
    }
}

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

import { StorageProvider } from "./StorageProvider.js";

export class GoogleDriveAdapter extends StorageProvider {
    constructor(accessToken) {
        super();
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
            return `name contains '${ast.value}' or fullText contains '${ast.value}'`;
        }
        if (ast.type === 'tag') {
            return `fullText contains '#${ast.value}'`;
        }
        
        return "trashed=false";
    }

    async executeQueryAsync(ast) {
        const q = this.astToGoogleDriveQuery(ast);
        console.log(`[GoogleDriveAdapter] Translated AST to GDrive Query:`, q);
        
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(`[GoogleDriveAdapter] Mock fetch returned 1 result for: ${q}`);
                resolve([
                    "/Google Drive/Datacore/Project " + (ast.value || "Result") + ".md"
                ]);
            }, 600);
        });
    }
}

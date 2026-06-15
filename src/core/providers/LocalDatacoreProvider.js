import { StorageProvider } from "./StorageProvider.js";

export class LocalDatacoreProvider extends StorageProvider {
    constructor(dc) {
        super();
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

    // This is synchronous/reactive since it binds to Obsidian's useQuery directly
    executeQuery(ast) {
        return this.astToDatacoreSyntax(ast);
    }
}

/**
 * Base Interface for all Storage Providers
 * Ensures that all future providers adhere to the same contract, preventing
 * updates in one platform from breaking others.
 */
export class StorageProvider {
    /**
     * Executes the parsed JSON AST against the storage backend.
     * Must be implemented by all subclasses.
     * 
     * @param {Object} ast - The JSON Abstract Syntax Tree
     * @returns {Promise<Array<Object>>} A promise resolving to an array of page objects or paths
     */
    async executeQueryAsync(ast) {
        throw new Error("Method 'executeQueryAsync()' must be implemented.");
    }
}

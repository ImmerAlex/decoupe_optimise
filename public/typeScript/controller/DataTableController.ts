import { OptimizationResult } from "../types/Type.js";

export default class DataTableController {
    private data: OptimizationResult | undefined;

    setData(data: OptimizationResult): void {
        this.data = data;        
    }

    render(): void {
        if (!this.data) {
            return;
        }

        
    }
}
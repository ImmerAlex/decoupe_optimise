type CutResult = {
    source: "chute" | "baseSize";
    sourceSize: number;
    cuts: Array<{
        size: number;
        cadre: string;
    }>;
    remaining: number;
};

type OptimizationResult = {
    project: string;
    baseSize: number;
    data: CutResult[];
};


export { OptimizationResult };
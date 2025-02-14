export default class Profile {
    public longeur: number;
    public multiple: number;
    public priority: number;
    public cadre: string;

    constructor(
        longeur: number,
        multiple: number,
        priority: number,
        cadre: string,
    ) {
        this.longeur = longeur;
        this.multiple = multiple;
        this.priority = priority;
        this.cadre = cadre;
    }
}
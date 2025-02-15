export default class Profile {
    public longeur: number;
    public priority: number;
    public cadre: string;

    constructor(
        longeur: number,
        priority: number,
        cadre: string,
    ) {
        this.longeur = longeur;
        this.priority = priority;
        this.cadre = cadre;
    }
}
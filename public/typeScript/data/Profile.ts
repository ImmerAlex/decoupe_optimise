export default class Profile {
    public longeur: number;
    public multiple: number;
    public priority: number; // Renommé de priorite à priority
    public cadre: string;

    constructor(
        longeur: number,
        multiple: number,
        priority: number, // Renommé de priorite à priority
        cadre: string,
    ) {
        this.longeur = longeur;
        this.multiple = multiple;
        this.priority = priority; // Renommé de priorite à priority
        this.cadre = cadre;
    }
}
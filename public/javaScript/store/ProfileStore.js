export default class ProfileStore {
    static addProfile(profile) {
        if (!this.profileList.includes(profile)) {
            this.profileList.push(profile);
        }
    }
    static clearProfileList() {
        this.profileList = [];
    }
    static getProfile() {
        return this.profileList;
    }
    static sortBy(sortBy, order) {
        this.profileList.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) {
                return order === "asc" ? -1 : 1;
            }
            if (a[sortBy] > b[sortBy]) {
                return order === "asc" ? 1 : -1;
            }
            return 0;
        });
    }
    static getByName(name) {
        return this.profileList.find((profile) => profile.cadre === name);
    }
}
ProfileStore.profileList = [];

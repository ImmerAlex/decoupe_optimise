export default class ProfileStore {
    static addProfile(profile) {
        if (!(this.profileList.includes(profile))) {
            this.profileList.push(profile);
        }
    }
    static getProfile() {
        return this.profileList;
    }
}
ProfileStore.profileList = [];

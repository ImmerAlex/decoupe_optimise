export default class DataTableController {
    constructor() {
        this.dataTableContainer = document.getElementById("data-table-container");
        this.tableProjectName = document.getElementById("table-project-name");
    }
    setData(data) {
        this.data = data;
    }
    render() {
        var _a;
        if (!this.data) {
            return;
        }
        console.log(JSON.stringify(this.data, null, 2));
        this.tableProjectName.textContent = this.data.project;
        while (this.tableProjectName.nextSibling) {
            (_a = this.tableProjectName.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.tableProjectName.nextSibling);
        }
        this.data.data.forEach((elt, index) => {
            const result = `
                <table>
                    <thead>
                        <tr>
                            <td class="num-bar">Barre ${index + 1}</td>
                            <td>Source</td>
                            <td>Taille ref</td>
                            <td>Longueur</td>
                            <td>Cadre</td>
                        </tr>
                    </thead>
                    <tbody>
                        ${elt.cuts.map(cut => `
                            <tr>
                                <td></td>
                                <td>${elt.source === 'chute' ? elt.source : 'profilé référence'}</td>
                                <td>${elt.sourceSize}</td>
                                <td>${cut.size}</td>
                                <td>${cut.cadre}</td>
                            </tr>
                        `).join('')}
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>Chute restant</td>
                            <td>${elt.remaining}</td>
                        </tr>
                    </tbody>
                </table>`;
            this.dataTableContainer.insertAdjacentHTML('beforeend', result);
        });
    }
}

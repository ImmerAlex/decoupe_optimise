export default class DataTableController {
    constructor() {
        this.exemple = {
            "project": "ARASAKA",
            "baseSize": 6000,
            "data": [
                {
                    "source": "chute",
                    "sourceSize": 3000,
                    "cuts": [
                        {
                            "size": 2800,
                            "cadre": "C1"
                        },
                        {
                            "size": 100,
                            "cadre": "C3"
                        }
                    ],
                    "remaining": 100
                },
                {
                    "source": "baseSize",
                    "sourceSize": 6000,
                    "cuts": [
                        {
                            "size": 3100,
                            "cadre": "C4"
                        },
                        {
                            "size": 2100,
                            "cadre": "C4"
                        }
                    ],
                    "remaining": 800
                },
                {
                    "source": "baseSize",
                    "sourceSize": 6000,
                    "cuts": [
                        {
                            "size": 1500,
                            "cadre": "C1"
                        },
                        {
                            "size": 1300,
                            "cadre": "C2"
                        }
                    ],
                    "remaining": 3200
                }
            ]
        };
        this.htmlTableStruct = `
        <table>
            <thead>
                <tr>
                    <td class="num-bar">Barre 1</td>
                    <td>Source</td>
                    <td>Taille ref</td>
                    <td>Longueur</td>
                    <td>Cadre</td>
                </tr>
            </thead>
            <tbody id="table-body">
                <tr>
                    <td></td>
                    <td>chute</td>
                    <td>3000</td>
                    <td>500</td>
                    <td>C1</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>Chute restant</td>
                    <td>300</td>
                </tr>
            </tbody>
        </table>`;
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
        // clear all thing after tableProject name
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

'use strict';

class TableTemplate {
    static fillIn(id, dictionary, columnName) {
        const table = document.querySelector('#' + id);
        const rows = table.rows;

        const ths = rows[0].cells;
        let columnNameIndex = -1;
        for (let i = 0; i < ths.length; i++) {
            const headProcessor = new Cs142TemplateProcessor(ths[i].textContent);
            ths[i].textContent = headProcessor.fillIn(dictionary);

            if (ths[i].textContent === columnName) {
                columnNameIndex = i;
            }
        }

        if (columnNameIndex > -1) {
            for (let i = 1; i < rows.length; i++) {
                const td = rows[i].cells[columnNameIndex];

                const dataProcessor = new Cs142TemplateProcessor(td.textContent);
                td.textContent = dataProcessor.fillIn(dictionary);
            }
        } else if (columnName === undefined){
            for (let i = 1; i < rows.length; i++) {
                for (let j = 0; j < rows[0].cells.length; j++) {
                    const td = rows[i].cells[j];

                    const dataProcessor = new Cs142TemplateProcessor(td.textContent);
                    td.textContent = dataProcessor.fillIn(dictionary);
                }     
            }
        }

        if (table.style.visibility === 'hidden') {
            table.style.visibility = 'visible';
        }
    }
}
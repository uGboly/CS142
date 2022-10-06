'use strict';

class DatePicker {
    constructor(id, callback) {
        this.id = id;
        this.callback = callback;
        this.monthNames = ['January', 'February', 'March', 'Aoril',
         'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; 
    }

    render(date) {
        const div = document.querySelector(`#${this.id}`);
        div.innerHTML=`<h2>${date.getFullYear()} : ${date.getMonth() + 1} : ${date.getDate()}</h2>`;

        const calendar = document.createElement('table');
        div.appendChild(calendar);

        const calendarHead = document.createElement('thead');
        calendar.appendChild(calendarHead);

        calendarHead.innerHTML = '<tr><th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th><tr>';

        
        const calendarBody = document.createElement('tbody');
        calendar.appendChild(calendarBody);

        //本月第一天
        date.setDate(1);
        const currMonth = date.getMonth();
        let row = document.createElement('tr');
        calendarBody.appendChild(row);

        //补全日历第一排
        if (date.getDay() !== 1) {
            //本周第一天
            date.setDate(1 - date.getDay());
            
            while (date.getMonth() !== currMonth) {
                const newDay = document.createElement('td');
                newDay.innerText = `${date.getDate()}`;
                newDay.classList.add('dimmed');
                row.appendChild(newDay);
                date.setDate(date.getDate() + 1);
            }
        }


        while (date.getMonth() === currMonth) {
            if (date.getDay() === 0 && date.getDate() !== 1) {
                row = document.createElement('tr');
                calendarBody.appendChild(row);
            }

            const newDay = document.createElement('td');
            newDay.innerText = `${date.getDate()}`;
            newDay.addEventListener('click', 
                this.callback.bind(this, this.id, {
                    day: date.getDate(),
                    month: this.monthNames[date.getMonth()],
                    year: date.getFullYear()
                }));
            row.appendChild(newDay);
            date.setDate(date.getDate() + 1);
        }
        
        //补全日历最后一排
        while (date.getDay() !== 0) {
            const newDay = document.createElement('td');
            newDay.innerText = `${date.getDate()}`;
            newDay.classList.add('dimmed');
            row.appendChild(newDay);
            date.setDate(date.getDate() + 1);
        }

        const prevButton = document.createElement('button');
        prevButton.innerText = '<';
        prevButton.addEventListener('click', this.render.bind(this, new Date(date.getFullYear(), date.getMonth() - 2, 1)));

        const nextButton = document.createElement('button');
        nextButton.innerText = '>';
        nextButton.addEventListener('click', this.render.bind(this, new Date(date.getFullYear(), date.getMonth(), 1)));
        div.appendChild(prevButton);
        div.appendChild(nextButton);
    }
}
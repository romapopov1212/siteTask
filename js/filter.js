// устанавливаем соответствие между полями формы и столбцами таблицы
let correspond = {
    "Название": "name",
    "Высота (м)": ["height_min", "height_max"],
    "Страна": "location",
    "Хребет": "chrebet",
    "Первое восхождение": "firstGo",
    "Количество восхождений": "count"
};

let dataFilter = (dataForm) => {
    let dictFilter = {};

    // Перебираем все элементы формы с фильтрами
    for (let j = 0; j < dataForm.elements.length; j++) {
        // Выделяем очередной элемент формы
        let item = dataForm.elements[j];

        // Пропускаем кнопки (они не нужны в фильтре)
        if (item.type === "button") continue;

        // Получаем значение элемента
        let valInput = item.value;

        // Если поле пустое, пропускаем его
        if (valInput === "") continue;

        // Обработка текстовых полей
        if (item.type === "text") {
            valInput = valInput.toLowerCase(); // Приводим к нижнему регистру
        }

        // Обработка числовых полей
        if (item.type === "number") {
            valInput = Number(valInput); // Преобразуем значение в число
        }

        // Формируем очередной элемент ассоциативного массива
        dictFilter[item.id] = valInput;
    }

    return dictFilter;
};

let filterTable = (data, idTable, dataForm) => {
    // Получаем данные из полей формы
    let datafilter = dataFilter(dataForm);

    // Фильтруем данные
    let tableFilter = data.filter(item => {
        let result = true;

        for (let key in item) {
            let val = item[key];
            let filterValue = datafilter[correspond[key]];

            // Для текстовых полей
            if (typeof val === "string" && filterValue) {
                val = val.toLowerCase();
                if (typeof filterValue === "string") {
                    result = result && val.includes(filterValue);
                }
            }

            // Для числовых полей
            if (typeof val === "number") {
                // Для высоты (диапазон)
                if (key === "Высота (м)") {
                    let min = datafilter["height_min"] || -Infinity;
                    let max = datafilter["height_max"] || Infinity;
                    result = result && (val >= min && val <= max);
                } 
                // Для других числовых полей (точное совпадение)
                else if (filterValue !== undefined) {
                    result = result && (val == filterValue);
                }
            }
        }

        return result;
    });

    // Очищаем таблицу перед обновлением
    clearTable(idTable);

    // Создаем таблицу с отфильтрованными данными
    createTable(tableFilter, idTable);

    // Применяем текущую сортировку, если она есть
    let sortForm = document.getElementById("sort");
    if (sortForm) {
        let sortArr = createSortArr(sortForm);
        if (sortArr.length > 0) {
            sortTable(idTable, sortForm);
        }
    }
};

let clearFilter = (idTable, data, dataForm) => {
    // Очищаем все поля формы
    for (let i = 0; i < dataForm.elements.length; i++) {
        let element = dataForm.elements[i];

        // Пропускаем кнопки (они не нужны для очистки)
        if (element.type === "button") continue;

        // Очищаем значение поля
        element.value = "";
    }

    // Очищаем таблицу
    clearTable(idTable);

    // Выводим таблицу с исходными данными
    createTable(data, idTable);

    // Проверяем, есть ли активная сортировка
    let sortForm = document.getElementById("sort");
    if (sortForm) {
        let sortArr = createSortArr(sortForm);
        if (sortArr.length > 0) {
            // Если есть активная сортировка, применяем её
            sortTable(idTable, sortForm);
        }
    }
};
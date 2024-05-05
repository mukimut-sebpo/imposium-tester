var headers, tagPosition, compTagList, data = [], fieldCount = 0;
var previewDiv = document.getElementById('previews');
function addField() {
    fieldCount++;
    var compSelect = createSelect('comp' + fieldCount, [], compTagList);
    var fieldSelect = createSelect('linkField' + fieldCount, [], headers);
    fieldSelect.addEventListener('change', processData);
    var inputsDiv = document.getElementById('inputs');
    inputsDiv.appendChild(compSelect);
    inputsDiv.appendChild(fieldSelect);
    inputsDiv.appendChild(document.createElement('br'));
}
document.addEventListener('keypress', (e) => {
    if(e.key == 'Enter') {
        processData();
        e.preventDefault();
      }
})
var fileInput = document.getElementById('input');
fileInput.addEventListener('change', function () {
    var file = fileInput.files[0];
    file.text().then(function (e) {
        var lines = e.split('\n');
        lines.forEach(function (line) {
            var currentLineList = [];
            var findComma = true;
            var currentWord = '';
            for (var i = 0; i < line.length; i++) {
                var currentChar = line.charAt(i);
                if (currentChar == '"') {
                    findComma = !findComma;
                }
                if (findComma && currentChar == ',') {
                    currentLineList.push(currentWord);
                    currentWord = '';
                }
                else {
                    currentWord += currentChar;
                }
            }
            currentLineList.push(currentWord);
            if (currentLineList.length > 1) {
                data.push(currentLineList);
            }
        });
        headers = data[0];
        data = data.slice(1);
        tagPosition = headers.indexOf('composition_tag');
        var tags = new Set();
        data.forEach(function (dataLine) { return tags.add(dataLine[tagPosition]); });
        compTagList = Array.from(tags);
        addField();
    });
});
function createSelect(id, classes, dataList) {
    var select = createElement('select', classes, id);
    dataList.forEach(function (header) {
        var option = document.createElement('option');
        option.innerHTML = header;
        option.value = header;
        select.appendChild(option);
    });
    return select;
}
function processData() {
    var previewType = Array.from(document.getElementsByName('previewType')).map(function (e) { return e.checked; });
    var width = document.getElementById('widthInput').value;
    var height = document.getElementById('heightInput').value;
    previewDiv.innerHTML = '';
    var map = new Map();
    for (var i = 1; i <= fieldCount; i++) {
        var tag = document.getElementById('comp' + i).value;
        var field = document.getElementById('linkField' + i).value;
        map.set(tag, field);
    }
    data.forEach(function (line, index) {
        var versionName;
        for (var i = 0; i < line.length; i++) {
            if (line[i] && line[i].trim() != '') {
                versionName = line[i];
                break;
            }
        }
        var previewHeader = map.get(line[tagPosition]);
        if (!previewHeader) {
            return;
        }
        var linkPosition = headers.indexOf(previewHeader);
        var previewArea = createElement('div', ['previewArea'], 'previewArea' + index);
        var infoArea = createElement('div', ['info'], 'info' + index);
        infoArea.innerText = versionName + ' | ' + line[tagPosition];
        previewArea.appendChild(infoArea);
        var imageContainer = createElement('div', ['imageContainer'], 'imageContainer' + index);
        if (previewType[0]) {
            var imageElement = createElement('img', ['preview'], 'preview' + index);
            imageElement.src = line[linkPosition];
            imageContainer.appendChild(imageElement);
        }
        else {
            imageContainer.innerHTML = '<video controls class="preview"><source src=' + line[linkPosition] + '></video>';
        }
        previewArea.appendChild(imageContainer);
        previewArea.addEventListener('click', function () { return window.open(line[linkPosition]); });
        previewArea.style.width = width + 'px';
        previewArea.style.height = height + 'px';
        previewDiv.appendChild(previewArea);
    });
}
function createElement(tag, classList, id) {
    var element = document.createElement(tag);
    element.id = id;
    classList.forEach(function (className) { return element.classList.add(className); });
    return element;
}
function trace(e) {
    console.log(e);
}

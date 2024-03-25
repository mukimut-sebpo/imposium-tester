var headers, tagPosition, compTagList, data = [], fieldCount = 0;
var previewDiv = document.getElementById('previews');
function addField() {
    fieldCount++;
    var compSelect = createSelect('comp' + fieldCount, [], compTagList);
    var fieldSelect = createSelect('linkField' + fieldCount, [], headers);
    var inputsDiv = document.getElementById('inputs');
    inputsDiv.appendChild(compSelect);
    inputsDiv.appendChild(fieldSelect);
    inputsDiv.appendChild(document.createElement('br'));
}
var fileInput = document.getElementById('input');
fileInput.addEventListener('change', function () {
    var file = fileInput.files[0];
    file.text().then(function (e) {
        var lines = e.split('\n');
        headers = lines[0].split(',');
        tagPosition = headers.indexOf('composition_tag');
        for (var i = 1; i < lines.length; i++) {
            var lineList = lines[i].split(',');
            if (lineList.length > 1) {
                data.push(lineList);
            }
        }
        var tags = new Set();
        for (var i = 1; i < data.length; i++) {
            tags.add(data[i][tagPosition]);
        }
        compTagList = Array.from(tags);
        addField();
        // const previewSelect = createSelect('linkField1', [], headers);
        // const compSelect = createSelect('comp1', [], compTagList);
        // const inputsDiv = document.getElementById('inputs');
        // inputsDiv.appendChild(compSelect);
        // inputsDiv.appendChild(previewSelect);
        // inputsDiv.appendChild(document.createElement('br'));
        // processData();
    });
});
function createSelect(id, classes, dataList) {
    var select = createElement('select', classes, id);
    // select.addEventListener('change', (e:Event) => {trace(e.target)});
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

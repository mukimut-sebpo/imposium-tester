var headers, tagPosition, data = [], fieldCount = 1;
var previewDiv = document.getElementById('previews');
function addField() {
    fieldCount++;
    var compInput = createTextInput('comp' + fieldCount, 'composition tag');
    var fieldInput = createTextInput('linkField' + fieldCount, 'link field');
    var inputsDiv = document.getElementById('inputs');
    inputsDiv.appendChild(compInput);
    inputsDiv.appendChild(fieldInput);
    inputsDiv.appendChild(document.createElement('br'));
    function createTextInput(id, placeHolder) {
        var input = createElement('input', [], id);
        input.type = 'text';
        input.placeholder = placeHolder;
        return input;
    }
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
        processData();
    });
});
function processData() {
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
        var imageElement = createElement('img', ['preview'], 'preview' + index);
        imageElement.src = line[linkPosition];
        imageContainer.appendChild(imageElement);
        previewArea.appendChild(imageContainer);
        previewArea.addEventListener('click', function () { return window.open(line[linkPosition]); });
        previewDiv.appendChild(previewArea);
        // trace(versionName);
        // trace(line[tagPosition]);
        // trace(line[linkPosition]);
        // trace('----------------------')
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

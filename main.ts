let headers: string[], tagPosition: number, data: string[][] = [], fieldCount = 1;
const previewDiv = document.getElementById('previews');

function addField() {
    fieldCount++;
    const compInput = createTextInput('comp' + fieldCount, 'composition tag');
    const fieldInput = createTextInput('linkField' + fieldCount, 'link field');

    const inputsDiv = document.getElementById('inputs');
    inputsDiv.appendChild(compInput);
    inputsDiv.appendChild(fieldInput);
    inputsDiv.appendChild(document.createElement('br'));

    function createTextInput(id: string, placeHolder: string):  HTMLInputElement {
        const input = createElement('input', [], id) as HTMLInputElement;
        input.type = 'text'
        input.placeholder = placeHolder;

        return input;
    }
}

const fileInput: HTMLInputElement = document.getElementById('input') as HTMLInputElement;
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    file.text().then((e: string) => {
        const lines = e.split('\n')
        headers = lines[0].split(',');
        tagPosition = headers.indexOf('composition_tag');

        for(let i = 1; i < lines.length; i++) {
            const lineList = lines[i].split(',');
            if(lineList.length > 1) {
                data.push(lineList);
            }
        }
        processData();
    });
});

function processData() {
  previewDiv.innerHTML = '';
  const map = new Map<string, string>();
  for(let i = 1; i <= fieldCount; i++) {
    const tag = (document.getElementById('comp' + i) as HTMLInputElement).value;
    const field = (document.getElementById('linkField' + i) as HTMLInputElement).value;

    map.set(tag, field);
  }

  

  data.forEach((line, index) => {
    let versionName: string;
    for(let i = 0; i < line.length; i++) {
      if(line[i] && line[i].trim() != '') {
        versionName = line[i];
        break;
      }
    }

    const previewHeader = map.get(line[tagPosition]);
    if(!previewHeader) {
      return;
    }
    
    const linkPosition = headers.indexOf(previewHeader);
    const previewArea = createElement('div', ['previewArea'], 'previewArea' + index);

    const infoArea = createElement('div', ['info'], 'info' + index);
    infoArea.innerText = versionName + ' | ' + line[tagPosition];
    previewArea.appendChild(infoArea);

    const imageContainer = createElement('div', ['imageContainer'], 'imageContainer' + index);
    const imageElement = createElement('img', ['preview'], 'preview' + index) as HTMLImageElement;
    imageElement.src = line[linkPosition];
    imageContainer.appendChild(imageElement);
    previewArea.appendChild(imageContainer);
    previewArea.addEventListener('click', () => window.open(line[linkPosition]))

    previewDiv.appendChild(previewArea);





    // trace(versionName);
    // trace(line[tagPosition]);
    // trace(line[linkPosition]);
    // trace('----------------------')
  })
}

function createElement(tag: keyof HTMLElementTagNameMap, classList: string[], id: string): HTMLElement {
  const element = document.createElement(tag);
  element.id = id;
  classList.forEach(className => element.classList.add(className))
  return element;
} 



    function trace(e) {
        console.log(e)
    }
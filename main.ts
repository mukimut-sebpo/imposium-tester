let headers: string[], tagPosition: number, compTagList: string[], data: string[][] = [], fieldCount = 0;
const previewDiv = document.getElementById('previews');

function addField() {
    fieldCount++;
    const compSelect = createSelect('comp' + fieldCount, [], compTagList);
    const fieldSelect = createSelect('linkField' + fieldCount, [], headers);
    fieldSelect.addEventListener('change', processData);
    const inputsDiv = document.getElementById('inputs');
    inputsDiv.appendChild(compSelect);
    inputsDiv.appendChild(fieldSelect);
    inputsDiv.appendChild(document.createElement('br'));
}

const fileInput: HTMLInputElement = document.getElementById('input') as HTMLInputElement;
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    file.text().then((e: string) => {
        const lines = e.split('\n')

        lines.forEach(line => {
          const currentLineList: string[] = [];
          let findComma = true;
          let currentWord = '';

          for(let i = 0; i < line.length; i++) {
            const currentChar = line.charAt(i);

            if(currentChar == '"') {
              findComma = !findComma;
            }

            if(findComma && currentChar == ',') {
              currentLineList.push(currentWord);
              currentWord = ''
            } else {
              currentWord += currentChar;
            }
          }
          currentLineList.push(currentWord);
          if(currentLineList.length > 1) {
            data.push(currentLineList);
          }
        });
        

        headers = data[0];
        data = data.slice(1);
        tagPosition = headers.indexOf('composition_tag');

        const tags = new Set<string>();
        data.forEach(dataLine => tags.add(dataLine[tagPosition]));
        compTagList = Array.from(tags);

        addField();
    });
});

function createSelect(id: string, classes: string[], dataList: string[]): HTMLSelectElement {
  const select: HTMLSelectElement = createElement('select', classes, id) as HTMLSelectElement;
  dataList.forEach(header => {
    const option: HTMLOptionElement = document.createElement('option');
    option.innerHTML = header;
    option.value = header;
    select.appendChild(option);
  });
  return select
}

function processData() {
  const previewType = Array.from(document.getElementsByName('previewType')).map((e: HTMLInputElement) => e.checked);

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
    if(previewType[0]) {
      const imageElement = createElement('img', ['preview'], 'preview' + index) as HTMLImageElement;
      imageElement.src = line[linkPosition];
      imageContainer.appendChild(imageElement);
    } else {
      imageContainer.innerHTML = '<video controls class="preview"><source src=' + line[linkPosition] + '></video>'
    }
    
    previewArea.appendChild(imageContainer);
    previewArea.addEventListener('click', () => window.open(line[linkPosition]))

    previewDiv.appendChild(previewArea);
  });
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
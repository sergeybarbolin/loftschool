const deleteCharacters = str => str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g, '');

const formHandler = formIdentifier => {
    const form = document.querySelector(formIdentifier);
    const data = {};

    for (const el of form.children) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            data[el.getAttribute('name')] = el.value
        } 
    }
    
    return data;
}

const formClear = formIdentifier => {
    const form = document.querySelector(formIdentifier);

    for (const el of form.children) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.value = '';
        } 
    }
}

export { deleteCharacters, formHandler, formClear }
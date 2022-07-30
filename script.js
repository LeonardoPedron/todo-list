document.addEventListener('DOMContentLoaded', (event) => {
    let countId = 0; // Identifica in modo univoco ogni appunto inserito con successo tramite un numero crescente
    let arrayLanguage = [1, 0, 0, 0, 0]; // Il numero 1 indica la lingua selezionata [italiano, inglese, spagnolo, francese, tedesco] DEFAULT: ITALIANO

    document.querySelector('input#placeholder').value = '';

    document.querySelector('#addList').addEventListener('click', (element) => {
        let str = document.querySelector('#placeholder').value;

        if (str.length <= 0){ // Nel caso l'input fosse vuoto compare un alert
            alert();
            updateLanguage(arrayLanguage);
            return setTimeout(() => document.querySelector(".alert").remove(), 5000);
        }

        document.querySelector('#placeholder').value = ''; // setto a zero l'input una volta inserita la nota

        let compontent = `<li id="item-${countId}" class=\"list-group-item\">
                            <input class=\"form-check-input me-1\" type=\"checkbox\" value=\"\" aria-label=\"...\">
                            <span>${str}</span>
                            <i id=\"remove\" class=\"fa-solid fa-trash-can float-end text-danger\" style=\"cursor: pointer;\" data-bs-toggle="modal" data-bs-target="#codeID-${countId}"></i>
                            ${modal(`${countId}`, `Elimina elemento codeID-${countId}`, 'Sei sicuro di voler elminare questa riga ? Tutti i dati di questa riga verranno persi !!!', 'Annulla', 'Elimina')}
                        </li>`;
                        
        let el = document.querySelector('#list');

        el.insertAdjacentHTML('afterbegin', compontent);
        updateLanguage(arrayLanguage);

        document.querySelector(`#accept-${countId}`).addEventListener('click', (element) => {
            const { target } = element;
            const id = target.id.split('-');
            document.querySelector(`#decline-${id[1]}`).click()
            document.querySelector(`#item-${id[1]}`).remove();  
        })

        countId++;
    });

    document.querySelectorAll('.language').forEach( el => {
        el.addEventListener('click', (event) => {
            const { target } = event;
            
            document.querySelectorAll('.language').forEach( el => {
                el.className = 'btn btn-dark language'
            });

            target.className = 'btn btn-success active language';

            setLanguage(target.id, arrayLanguage)
            updateLanguage(arrayLanguage)
            
        })
    });

    const alert = () => {
        let compontent = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <i class="fa-solid fa-triangle-exclamation me-2"></i>
                            <span id="warning">Attenzione !!! Il campo di inseriemnto deve essere riempito per inserie l'appunto</span>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;
        let element = document.querySelector('#alert');

        return element.insertAdjacentHTML('afterbegin', compontent);
    }
    
    const modal = (id, title, description,) => {
        let element = `<div class="modal fade" id="codeID-${id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title title-mod" id="modal">${title}</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div id="description" class="modal-body">
                                    ${description}
                                </div>
                                <div class="modal-footer">
                                    <button id="decline-${id}" type="button" class="btn btn-danger decline" data-bs-dismiss="modal">
                                        <i class="fa-solid fa-circle-xmark me-2"></i>
                                        <span id="decline" >Annulla</span>
                                    </button>
                                    <button id="accept-${id}" type="button" class="btn btn-success accept">
                                        <i class="fa-solid fa-circle-check me-2"></i>
                                        <span id="accepet">Elimina</span>
                                    </button>
                                </div>
                                </div>
                            </div>
                        </div>`;

        return element;
    }

    const getJSON = async (language) => {
        const url = `./language/${language}.json`;
        let data;
    
        await fetch(url).then(response => response.json() )
        .then(json => {
            data = json;
        }).catch((err) => {
            return new Error(err)
        });

        return data;
    }

    const getLanguage = async (language) => {
        for (let i = 0; i < language.length; i++) {
            if (language[i] === 1) 
                switch (i) {
                    case 0:
                        return 'italiano';
                    case 1:
                        return 'inglese'
                    case 2:
                        return 'spagnolo';
                    case 3:
                        return 'francese';
                    case 4:
                        return 'tedesco';
                }
            
        }
    }

    const setLanguage = async (id, language) => {
        const resetLanguage = (array) => {
            for (let i = 0; i < array.length; i++) array[i] = 0;
            return;
        }

        switch (id) {
            case 'italiano':
                resetLanguage(language);
                language[0] = 1;
                break;
            case 'inglese':
                resetLanguage(language);
                language[1] = 1;
                break;
            case 'spagnolo':
                resetLanguage(language);
                language[2] = 1;
                break;
            case 'francese':
                resetLanguage(language);
                language[3] = 1;
                break;
            case 'tedesco':
                resetLanguage(language);
                language[4] = 1;
                break;

            default:
                break;
        }
    }

    const updateLanguage = async (language) => {
        let currentLanguage = await getLanguage(language);
        let JSON
        
        await getJSON(currentLanguage).then( res => JSON = res )
        .catch( err => {
            return new  Error(err);
        });

        document.querySelector('#placeholder') ? document.querySelector('#placeholder').placeholder = JSON.placeholder : '';
        document.querySelector('#warning') ? document.querySelector('#warning').textContent = JSON.warning : '';

        if(selectAll('#modal')){
            selectAll('#modal').forEach( element => {
                element.textContent = JSON.modal
            })
            selectAll('#description').forEach( element => {
                element.textContent = JSON.description
            })
            selectAll('#decline').forEach( element => {
                element.textContent = JSON.decline
            })
    
            selectAll('#accepet').forEach( element => {
                element.textContent = JSON.accepet
            })
        }
        
        
       
        

    }

    const selectAll = (el) => { return document.querySelectorAll(el); }

})